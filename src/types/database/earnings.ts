export interface RentEarnings {
  id: string;
  user_id: string;
  property_id: string;
  year: number;
  earned_amount: number;
  withdrawn_amount: number;
  created_at: string;
  updated_at: string;
}

export interface TaxDeductions {
  id: string;
  user_id: string;
  property_id: string;
  year: number;
  expense_type: string;
  amount: number;
  created_at: string;
  updated_at: string;
}