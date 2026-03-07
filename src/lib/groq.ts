import Groq from 'groq-sdk';
import { GroqIntent, ProductCard, SearchResult } from "@/types";
import { API_TIMEOUT } from "./constants";
import { logger } from "./logger";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  maxRetries: 1, // Let SDK handle transient retries
});

export const INTENT_PARSER_SYSTEM_PROMPT = `Extract buying intent from a plain English product description. Return only valid JSON:
{ "category": "string", "budget_amount": "number|null", "currency": "string", "must_have_features": [], "nice_to_have": [], "use_case": "string", "recipient": "string" }
If budget not mentioned set budget_amount to null.
If the user mentions a price in ₹ or rupees or INR, set currency to 'INR'. If no currency is mentioned but the user appears to be from India (based on product context or pricing), default currency to 'INR'. Never assume USD unless explicitly stated.
Always append ' India' to the end of every search query you generate in the 'category' field. Always use 'rupees' or '₹' instead of '$' or 'dollars' in queries.`;

export const RANKER_SYSTEM_PROMPT = `You are a shopping expert. Given these products and requirements, rank the top 3 only. For each return:
{ "rank": "number", "product_title": "string", "price": "string", "match_score": "number (0-100)", "badge": "Best Match|Budget Pick|Premium|Over Budget", "reason": "one sentence, specific, no generic phrases" }

All prices in results will be in INR. Compare product prices against user budget in the same currency only. Never compare INR budget against USD prices.

BUDGET ENFORCEMENT RULES:
1. If a product price exceeds the user's stated budget by more than 20%, its match_score must not exceed 60.
2. If it exceeds budget by more than 50%, score must not exceed 30.
3. A product over budget should NEVER receive the 'Best Match' or 'Budget Pick' badge.

BADGE LOGIC:
- "Best Match": best overall fit including price.
- "Budget Pick": closest to or under stated budget.
- "Premium": over budget but justified by quality.
- "Over Budget": If ALL results are over budget, label them as "Over Budget" instead of misleading badges.

SCORE DIFFERENTIATION:
Scores must reflect real differences. Do not cluster all scores within 5 points of each other. If one product fits significantly better than another, the score gap should reflect that (15-30 points apart).

Return only valid JSON array.`;

export async function parseIntent(query: string, attempt: number = 1): Promise<GroqIntent> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: INTENT_PARSER_SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, { signal: controller.signal as any }); // groq sdk supports fetch options
    
    clearTimeout(timeoutId);
    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content) as GroqIntent;
    
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    logger.warn(`parseIntent failed on attempt ${attempt}:`, error);
    
    if (attempt === 1) {
      logger.log('Retrying parseIntent once...');
      return parseIntent(query, 2);
    }
    
    // Fallback: Use raw query as category
    logger.error('parseIntent failed twice, falling back to raw query intent');
    return {
      category: query,
      budget_amount: null,
      currency: "usd",
      must_have_features: [],
      nice_to_have: [],
    };
  }
}

export async function rankProducts(requirements: GroqIntent, products: SearchResult[]): Promise<ProductCard[]> {
  const sparseProducts = products.map(p => ({
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviews: p.reviews,
    source: p.source
  }));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: RANKER_SYSTEM_PROMPT },
        { role: "user", content: `Requirements:\n${JSON.stringify(requirements)}\n\nProducts:\n${JSON.stringify(sparseProducts)}` }
      ],
      model: "llama-3.3-70b-versatile",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, { signal: controller.signal as any });

    clearTimeout(timeoutId);
    
    const content = completion.choices[0].message.content || '[]';
    let ranked: Partial<ProductCard>[] = [];
    
    try {
      ranked = JSON.parse(content) as Partial<ProductCard>[];
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         ranked = JSON.parse(jsonMatch[0]) as Partial<ProductCard>[];
      }
    }
    
    if (!Array.isArray(ranked)) {
      ranked = [];
    }
    
    return ranked.map((r, i) => ({
      rank: typeof r.rank === 'number' ? r.rank : (i + 1),
      product_title: r.product_title || 'Unknown Product',
      price: r.price || '',
      match_score: Math.max(0, Math.min(100, typeof r.match_score === 'number' ? r.match_score : 0)),
      badge: r.badge || 'Result',
      reason: r.reason || 'No explanation available',
    }));

  } catch (error: unknown) {
    clearTimeout(timeoutId);
    logger.error('rankProducts failed:', error);
    return [];
  }
}
