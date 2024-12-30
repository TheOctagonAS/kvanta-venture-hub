export interface Order {
  id: string;
  user_id: string;
  property_id: string;
  order_type: string;
  token_count: number;
  price_per_token: number;
  status: string;
  buyer_id: string | null;
  created_at: string | null;
  executed_at: string | null;
  cancelled_at: string | null;
  on_chain_tx_id: string | null;
  payment_method: string;
}