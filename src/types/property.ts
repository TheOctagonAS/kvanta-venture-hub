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
  status: 'Active' | 'Coming Soon' | 'Sold Out';
  is_featured: boolean;
  property_type: string;
}