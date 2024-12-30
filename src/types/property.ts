export interface Property {
  id: string;
  name: string;
  location: string;
  price_per_token: number;
  image_url: string | null;
  yield: number;
  max_tokens: number;
  tokens_sold: number;
  launch_date: string | null;
  status: "Active" | "Coming Soon" | "Sold Out";
  is_featured: boolean;
  property_type: string;
}

// Type guard to check if a string is a valid PropertyStatus
export const isValidPropertyStatus = (status: string): status is Property["status"] => {
  return ["Active", "Coming Soon", "Sold Out"].includes(status);
};