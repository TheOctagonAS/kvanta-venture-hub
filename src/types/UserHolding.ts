export interface UserHolding {
  id: string;
  user_id: string;
  property_id: string;
  token_count: number;
  accumulated_rent: number;
  last_claim_at?: string;
  created_at: string;
}