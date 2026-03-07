export interface GroqIntent {
  category: string;
  budget_amount: number | null;
  currency?: string;
  must_have_features?: string[];
  nice_to_have?: string[];
  use_case?: string;
  recipient?: string;
}

export interface SearchResult {
  title: string;
  price: string;
  rating?: string;
  reviews?: string;
  source?: string;
  imageUrl?: string;
  link?: string;
}

export interface ProductCard {
  rank: number;
  product_title: string;
  price: string;
  match_score: number;
  badge: "Best Match" | "Budget Pick" | "Premium" | "Result" | string;
  reason: string;
  imageUrl?: string | null;
  link?: string | null;
}

export interface UserPlan {
  plan: 'free' | 'pro' | 'teams';
  subscription_status: 'active' | 'past_due' | 'cancelled' | 'paused' | 'unpaid' | string;
  current_period_ends_at: string;
}

export interface APIError {
  error: string;
  code: string;
  retryable: boolean;
  resetsIn?: string;
}

export interface SearchResponse {
  results: ProductCard[];
  budget_warning?: string;
}
