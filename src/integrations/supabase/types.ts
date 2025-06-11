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
      proj: {
        Row: {
          cat: string | null
          code: string | null
          created_at: string | null
          description: string | null
          id: number
          sec: string | null
        }
        Insert: {
          cat?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          sec?: string | null
        }
        Update: {
          cat?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          sec?: string | null
        }
        Relationships: []
      }
      proj2: {
        Row: {
          cat: string | null
          code: string | null
          created_at: string | null
          description: string | null
          id: number
          sec: string | null
          title: string | null
        }
        Insert: {
          cat?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          sec?: string | null
          title?: string | null
        }
        Update: {
          cat?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          sec?: string | null
          title?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          cat: string | null
          code: string | null
          description: string | null
          id: number
          sec: string | null
        }
        Insert: {
          cat?: string | null
          code?: string | null
          description?: string | null
          id?: number
          sec?: string | null
        }
        Update: {
          cat?: string | null
          code?: string | null
          description?: string | null
          id?: number
          sec?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string | null
          group_code: string
          id: number
          member_code: string
          project_code: string
          response: number
        }
        Insert: {
          created_at?: string | null
          group_code: string
          id?: number
          member_code: string
          project_code: string
          response: number
        }
        Update: {
          created_at?: string | null
          group_code?: string
          id?: number
          member_code?: string
          project_code?: string
          response?: number
        }
        Relationships: []
      }
      user_responses: {
        Row: {
          created_at: string | null
          group_code: string
          id: number
          member_code: string
          project_code: string
          response: number
        }
        Insert: {
          created_at?: string | null
          group_code: string
          id?: number
          member_code: string
          project_code: string
          response: number
        }
        Update: {
          created_at?: string | null
          group_code?: string
          id?: number
          member_code?: string
          project_code?: string
          response?: number
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
