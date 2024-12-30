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
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          launch_date: string | null
          location: string
          max_tokens: number
          name: string
          price_per_token: number
          property_token_asa_id: number | null
          property_type: string
          status: string
          tokens_sold: number
          yield: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          launch_date?: string | null
          location: string
          max_tokens?: number
          name: string
          price_per_token: number
          property_token_asa_id?: number | null
          property_type?: string
          status?: string
          tokens_sold?: number
          yield?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          launch_date?: string | null
          location?: string
          max_tokens?: number
          name?: string
          price_per_token?: number
          property_token_asa_id?: number | null
          property_type?: string
          status?: string
          tokens_sold?: number
          yield?: number
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
