import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { supabase } from '@/lib/supabase';
import { parseIntent, rankProducts } from '@/lib/groq';
import { searchGoogleShopping } from '@/lib/serper';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';
import { CACHE_TTL, MIN_QUERY_LENGTH, MAX_QUERY_LENGTH, RATE_LIMIT_MAX } from '@/lib/constants';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function sendError(error: string, status: number, code: string, retryable: boolean, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, code, retryable, ...extra }, { status });
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return sendError('Method Not Allowed', 405, 'METHOD_NOT_ALLOWED', false);
  }

  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return sendError('Unsupported Media Type', 415, 'UNSUPPORTED_MEDIA_TYPE', false);
  }

  // Get user session
  const { data: { user } } = await supabase.auth.getUser();

  if (!process.env.GROQ_API_KEY || !process.env.SERPER_API_KEY) {
    logger.error('Missing required environment variables');
    return sendError('Service misconfigured', 500, 'INTERNAL_ERROR', false);
  }

  try {
    const rawBody = await req.json().catch(() => ({}));
    let query = typeof rawBody.query === 'string' ? rawBody.query : '';

    // Input Sanitization
    query = query.trim().replace(/\s+/g, ' ').replace(/<[^>]*>?/gm, '');

    if (query.length < MIN_QUERY_LENGTH) {
      return sendError(`Query too short. Minimum ${MIN_QUERY_LENGTH} characters required.`, 400, 'BAD_REQUEST', false);
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return sendError(`Query too long. Maximum ${MAX_QUERY_LENGTH} characters allowed.`, 400, 'BAD_REQUEST', false);
    }

    // IP Hash
    const ip = headers().get('x-forwarded-for') || 'anonymous';
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const ipHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Cache Key
    const cacheKeyBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(query.toLowerCase()));
    const cacheKey = `search:${Array.from(new Uint8Array(cacheKeyBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')}`;

    const isRedisConfigured = process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN !== '********';

    // Rate Limiting
    if (isRedisConfigured) {
      const rateLimitKey = user?.id 
        ? `ratelimit::user::${user.id}`
        : `ratelimit::ip::${ipHash}`;
        
      const usage = await redis.incr(rateLimitKey);
      if (usage === 1) {
        await redis.expire(rateLimitKey, 60 * 60 * 24);
      }
      
      if (usage > RATE_LIMIT_MAX) {
        return sendError(
          "You've used your 10 free searches today. Come back tomorrow or upgrade.", 
          429, 
          'RATE_LIMITED', 
          false,
          { resetsIn: "24 hours" }
        );
      }
    }

    // Cache Check
    if (isRedisConfigured) {
      try {
        const cachedResult = await redis.get(cacheKey);
        if (cachedResult) {
          logger.log('Cache hit for query:', query);
          const response = NextResponse.json({ results: typeof cachedResult === 'string' ? JSON.parse(cachedResult) : cachedResult });
          response.headers.set('X-Cache', 'HIT');
          response.headers.set('Cache-Control', `s-maxage=${CACHE_TTL}`);
          return response;
        }
      } catch (cacheErr) {
        logger.warn('Redis cache read error:', cacheErr);
      }
    }

    // Processing Pipeline
    const intent = await parseIntent(query);

    let mainSearchStr = intent.category || query;
    if (intent.must_have_features && intent.must_have_features.length > 0) {
      mainSearchStr += ` ${intent.must_have_features.join(' ')}`;
    }

    // Parallelize Groq logic: if we have a category, also run a broader search
    const [mainResults, fallbackResults] = await Promise.all([
      searchGoogleShopping(mainSearchStr),
      intent.category && intent.category !== mainSearchStr 
        ? searchGoogleShopping(intent.category) 
        : Promise.resolve([])
    ]);

    let rawResults = mainResults;
    if (rawResults.length < 3 && fallbackResults.length > 0) {
      rawResults = fallbackResults;
    }

    if (rawResults.length === 0) {
      const response = NextResponse.json({ results: [] });
      response.headers.set('X-Cache', 'MISS');
      return response;
    }

    // Groq Ranking
    const rankedResults = await rankProducts(intent, rawResults.slice(0, 10));

    // Formatting
    const top3 = rankedResults.slice(0, 3).map(item => {
      const match = rawResults.find(r => 
        r.title.toLowerCase().includes(item.product_title.toLowerCase()) || 
        item.product_title.toLowerCase().includes(r.title.toLowerCase())
      );
      return {
        ...item,
        imageUrl: match?.imageUrl || null,
        link: match?.link || null
      };
    });

    // Background Saves
    const doBackgroundTasks = async () => {
      if (isRedisConfigured) {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(top3)).catch(e => logger.warn('Cache write async error:', e));
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'unconfigured';
      if (!supabaseUrl.includes('unconfigured-supabase')) {
        try {
          await supabase.from('searches').insert({
            query: query,
            results: top3,
            ip_hash: ipHash,
            created_at: new Date().toISOString()
          });
        } catch (e: unknown) {
          logger.warn('Supabase async log error:', e);
        }
      }
    };
    
    // Fire and forget
    doBackgroundTasks();

    // Budget check for warning
    let budget_warning: string | undefined = undefined;
    if (intent.budget_amount) {
      // Check if ALL products in the top3 are > budget. We assume any price without numbers is 0 or unparseable.
      const allOverBudget = top3.every(item => {
        const priceStr = String(item.price).replace(/[^0-9.]/g, '');
        const priceNum = parseFloat(priceStr);
        return !isNaN(priceNum) && priceNum > intent.budget_amount!;
      });

      if (allOverBudget && top3.length > 0) {
        budget_warning = `No products found under ${intent.currency || '$'}${intent.budget_amount}. Showing closest available options.`;
      }
    }

    const response = NextResponse.json({ results: top3, budget_warning });
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Cache-Control', `s-maxage=${CACHE_TTL}`);
    return response;

  } catch (error: unknown) {
    logger.error("Search API Error:", error);
    return sendError('An internal error occurred during processing', 500, 'INTERNAL_SERVER_ERROR', true);
  }
}
