export interface KycData {
  id: string;
  user_id: string | null;
  full_name: string;
  address: string;
  personal_number: string;
  is_pep: boolean | null;
  created_at: string | null;
}

export interface Profile {
  id: string;
  is_kyc: boolean;
  created_at: string;
  algo_address: string | null;
}