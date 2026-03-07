import { SearchResult } from "@/types";
import { API_TIMEOUT } from "./constants";
import { logger } from "./logger";

export async function searchGoogleShopping(query: string, retries = 1): Promise<SearchResult[]> {
  const url = 'https://google.serper.dev/shopping';
  const data = JSON.stringify({ q: query, gl: 'in', hl: 'en', location: 'India' });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: data,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if ((response.status === 429 || response.status === 503) && retries > 0) {
        logger.warn(`Serper API ${response.status}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return searchGoogleShopping(query, retries - 1);
      }
      throw new Error(`Serper API returned ${response.status}`);
    }

    const result = await response.json();
    let items: Record<string, string | number | undefined>[] = result.shopping || [];

    // Filter missing title or price
    items = items.filter(i => i.title && i.price);

    // Deduplicate by title
    const seen = new Set<string>();
    items = items.filter(i => {
      const normalizedTitle = String(i.title).toLowerCase().trim();
      if (seen.has(normalizedTitle)) return false;
      seen.add(normalizedTitle);
      return true;
    });

    if (items.length === 0) {
      logger.warn(`Serper returned 0 results for query: ${query}`);
    }

    return items.map((i: Record<string, unknown>) => ({
      title: String(i.title || ''),
      price: String(i.price || ''),
      rating: i.rating ? String(i.rating) : undefined,
      reviews: i.reviews ? String(i.reviews) : undefined,
      source: i.source ? String(i.source) : undefined,
      imageUrl: i.imageUrl ? String(i.imageUrl) : undefined,
      link: i.link ? String(i.link) : undefined
    }));
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('Serper API timeout');
    } else {
      logger.error('Serper API error:', error);
    }
    // Return empty array, never crash the backend due to external service failure
    return [];
  }
}
