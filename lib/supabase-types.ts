// Manual Supabase type definitions for tables created in Phase 17.
// These mirror the migration SQL schemas. If columns change, update here.
// Note: Relationships must be present on each table (required by GenericTable contract).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          id: string;
          type: string;
          rating: number | null;
          message: string;
          page: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          rating?: number | null;
          message: string;
          page: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          rating?: number | null;
          message?: string;
          page?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string;
          confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
