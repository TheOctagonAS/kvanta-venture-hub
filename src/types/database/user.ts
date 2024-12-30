export interface UserBalance {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface UserHoldings {
  id: string;
  user_id: string;
  property_id: string;
  token_count: number;
  created_at: string;
  accumulated_rent: number;
  last_claim_at: string | null;
}