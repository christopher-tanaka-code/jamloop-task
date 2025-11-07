export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          user_id: string;
          account_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          account_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          account_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          budget_usd: number;
          start_date: string;
          end_date: string;
          age_min: number;
          age_max: number;
          gender: Database["public"]["Enums"]["gender"];
          country: string;
          state: string | null;
          city: string | null;
          zip: string | null;
          inventory: Database["public"]["Enums"]["publisher"][];
          screens: Database["public"]["Enums"]["screen"][];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          budget_usd?: number;
          start_date: string;
          end_date: string;
          age_min: number;
          age_max: number;
          gender?: Database["public"]["Enums"]["gender"];
          country: string;
          state?: string | null;
          city?: string | null;
          zip?: string | null;
          inventory: Database["public"]["Enums"]["publisher"][];
          screens: Database["public"]["Enums"]["screen"][];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          budget_usd?: number;
          start_date?: string;
          end_date?: string;
          age_min?: number;
          age_max?: number;
          gender?: Database["public"]["Enums"]["gender"];
          country?: string;
          state?: string | null;
          city?: string | null;
          zip?: string | null;
          inventory?: Database["public"]["Enums"]["publisher"][];
          screens?: Database["public"]["Enums"]["screen"][];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      gender: "any" | "male" | "female" | "nonbinary";
      screen: "CTV" | "Mobile Device" | "Web Browser";
      publisher:
        | "Hulu"
        | "Discovery"
        | "ABC"
        | "A&E"
        | "TLC"
        | "Fox News"
        | "Fox Sports"
        | "Etc";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
