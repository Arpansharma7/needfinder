import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not found', { status: 404 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  const ip = headers().get('x-forwarded-for') || 'anonymous';
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const ipHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  const rateLimitKey = user?.id 
    ? `ratelimit::user::${user.id}`
    : `ratelimit::ip::${ipHash}`;

  await redis.del(rateLimitKey);

  return NextResponse.json({ cleared: true, key: rateLimitKey });
}
