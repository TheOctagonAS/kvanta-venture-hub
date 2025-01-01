export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      kyc_data: {
        Row: {
          address: string
          created_at: string | null
          full_name: string
          id: string
          is_pep: boolean | null
          personal_number: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          full_name: string
          id?: string
          is_pep?: boolean | null
          personal_number: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_pep?: boolean | null
          personal_number?: string
          user_id?: string | null
        }
        Relationships: []
      }
      on_chain_transfers: {
        Row: {
          block_number: number | null
          created_at: string | null
          from_address: string
          id: string
          property_id: string
          to_address: string
          token_count: number
          tx_hash: string
          user_id: string
        }
        Insert: {
          block_number?: number | null
          created_at?: string | null
          from_address: string
          id?: string
          property_id: string
          to_address: string
          token_count: number
          tx_hash: string
          user_id: string
        }
        Update: {
          block_number?: number | null
          created_at?: string | null
          from_address?: string
          id?: string
          property_id?: string
          to_address?: string
          token_count?: number
          tx_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "on_chain_transfers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          cancelled_at: string | null
          created_at: string | null
          executed_at: string | null
          id: string
          on_chain_tx_id: string | null
          order_type: string
          payment_method: string
          price_per_token: number
          property_id: string
          status: string
          token_count: number
          user_id: string
        }
        Insert: {
          buyer_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          on_chain_tx_id?: string | null
          order_type: string
          payment_method: string
          price_per_token: number
          property_id: string
          status?: string
          token_count: number
          user_id: string
        }
        Update: {
          buyer_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          on_chain_tx_id?: string | null
          order_type?: string
          payment_method?: string
          price_per_token?: number
          property_id?: string
          status?: string
          token_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          algo_address: string | null
          created_at: string
          id: string
          is_kyc: boolean
        }
        Insert: {
          algo_address?: string | null
          created_at?: string
          id: string
          is_kyc?: boolean
        }
        Update: {
          algo_address?: string | null
          created_at?: string
          id?: string
          is_kyc?: boolean
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          chain_explorer_url: string | null
          chain_name: string | null
          commercial_lease_term_months: number | null
          commercial_occupancy_rate: number | null
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          last_renovation_year: number | null
          launch_date: string | null
          location: string
          max_investors: number | null
          max_tokens: number
          monthly_rent: number | null
          name: string
          on_chain_decimals: number | null
          on_chain_symbol: string | null
          owner_id: string | null
          price_per_token: number
          property_description: string | null
          property_token_address: string | null
          property_token_asa_id: number | null
          property_type: string
          rejection_reason: string | null
          size_sqm: number | null
          status: string
          tokens_sold: number
          total_raise_cap: number | null
          year_built: number | null
          yield: number
        }
        Insert: {
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          chain_explorer_url?: string | null
          chain_name?: string | null
          commercial_lease_term_months?: number | null
          commercial_occupancy_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          last_renovation_year?: number | null
          launch_date?: string | null
          location: string
          max_investors?: number | null
          max_tokens?: number
          monthly_rent?: number | null
          name: string
          on_chain_decimals?: number | null
          on_chain_symbol?: string | null
          owner_id?: string | null
          price_per_token: number
          property_description?: string | null
          property_token_address?: string | null
          property_token_asa_id?: number | null
          property_type?: string
          rejection_reason?: string | null
          size_sqm?: number | null
          status?: string
          tokens_sold?: number
          total_raise_cap?: number | null
          year_built?: number | null
          yield?: number
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          chain_explorer_url?: string | null
          chain_name?: string | null
          commercial_lease_term_months?: number | null
          commercial_occupancy_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          last_renovation_year?: number | null
          launch_date?: string | null
          location?: string
          max_investors?: number | null
          max_tokens?: number
          monthly_rent?: number | null
          name?: string
          on_chain_decimals?: number | null
          on_chain_symbol?: string | null
          owner_id?: string | null
          price_per_token?: number
          property_description?: string | null
          property_token_address?: string | null
          property_token_asa_id?: number | null
          property_type?: string
          rejection_reason?: string | null
          size_sqm?: number | null
          status?: string
          tokens_sold?: number
          total_raise_cap?: number | null
          year_built?: number | null
          yield?: number
        }
        Relationships: []
      }
      property_dd_answers: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          property_id: string | null
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_dd_answers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_documents: {
        Row: {
          created_at: string | null
          doc_type: string
          file_url: string
          id: string
          property_id: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: string
          file_url: string
          id?: string
          property_id?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string
          file_url?: string
          id?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_loan_requests_deprecated: {
        Row: {
          created_at: string
          estimated_value: number
          id: string
          interest_rate: number
          monthly_payment: number | null
          ownership_declaration: boolean
          property_type: string
          repayment_months: number
          requested_amount: number
          status: string
          total_payback: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_value: number
          id?: string
          interest_rate: number
          monthly_payment?: number | null
          ownership_declaration?: boolean
          property_type: string
          repayment_months: number
          requested_amount: number
          status?: string
          total_payback?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_value?: number
          id?: string
          interest_rate?: number
          monthly_payment?: number | null
          ownership_declaration?: boolean
          property_type?: string
          repayment_months?: number
          requested_amount?: number
          status?: string
          total_payback?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          amount: number
          claimed_at: string | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          amount?: number
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      rent_earnings: {
        Row: {
          created_at: string
          earned_amount: number
          id: string
          property_id: string
          updated_at: string
          user_id: string
          withdrawn_amount: number
          year: number
        }
        Insert: {
          created_at?: string
          earned_amount?: number
          id?: string
          property_id: string
          updated_at?: string
          user_id: string
          withdrawn_amount?: number
          year: number
        }
        Update: {
          created_at?: string
          earned_amount?: number
          id?: string
          property_id?: string
          updated_at?: string
          user_id?: string
          withdrawn_amount?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "rent_earnings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_deductions: {
        Row: {
          amount: number
          created_at: string
          expense_type: string
          id: string
          property_id: string
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          amount?: number
          created_at?: string
          expense_type: string
          id?: string
          property_id: string
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          expense_type?: string
          id?: string
          property_id?: string
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_deductions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      token_price_history: {
        Row: {
          id: string
          price: number
          property_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          price: number
          property_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          price?: number
          property_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      user_balance: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_holdings: {
        Row: {
          accumulated_rent: number
          created_at: string
          id: string
          last_claim_at: string | null
          property_id: string
          token_count: number
          user_id: string
        }
        Insert: {
          accumulated_rent?: number
          created_at?: string
          id?: string
          last_claim_at?: string | null
          property_id: string
          token_count?: number
          user_id: string
        }
        Update: {
          accumulated_rent?: number
          created_at?: string
          id?: string
          last_claim_at?: string | null
          property_id?: string
          token_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_holdings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          address: string | null
          balance: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
          wallet_type: string
        }
        Insert: {
          address?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          wallet_type: string
        }
        Update: {
          address?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_payment: {
        Args: {
          loan_amount: number
          interest_rate: number
          months: number
        }
        Returns: number
      }
      migrate_to_wallets: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
