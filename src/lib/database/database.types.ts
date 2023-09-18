export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles_table: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login?: string
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_table_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts_table: {
        Row: {
          created_at: string
          description: string
          id: string
          is_favorited: boolean
          profile_id: string
          tag_ids: string[] | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["prompt_visibility"]
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_favorited?: boolean
          profile_id: string
          tag_ids?: string[] | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["prompt_visibility"]
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_favorited?: boolean
          profile_id?: string
          tag_ids?: string[] | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["prompt_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "prompts_table_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles_table"
            referencedColumns: ["id"]
          }
        ]
      }
      tag_prompt_link_table: {
        Row: {
          created_at: string
          created_by: string
          prompt_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          prompt_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          prompt_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_prompt_link_table_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles_table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_prompt_link_table_prompt_id_fkey"
            columns: ["prompt_id"]
            referencedRelation: "prompts_table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_prompt_link_table_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags_table"
            referencedColumns: ["id"]
          }
        ]
      }
      tags_table: {
        Row: {
          created_at: string
          id: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_table_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles_table"
            referencedColumns: ["id"]
          }
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
      prompt_visibility: "Private" | "Public" | "Link-Only"
      subscription_plan: "free" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
