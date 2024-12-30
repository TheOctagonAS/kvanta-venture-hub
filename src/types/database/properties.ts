export interface Property {
  id: string;
  name: string;
  location: string;
  price_per_token: number;
  image_url: string | null;
  created_at: string;
  yield: number;
  max_tokens: number;
  tokens_sold: number;
  launch_date: string | null;
  status: "Active" | "Coming Soon" | "Sold Out";
  is_featured: boolean;
  property_type: string;
  property_token_asa_id: number | null;
}

export const isValidPropertyStatus = (status: string): status is Property["status"] => {
  return ["Active", "Coming Soon", "Sold Out"].includes(status);
};