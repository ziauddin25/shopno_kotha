/**
 * Database types for the Shopno Kotha Supabase schema.
 *
 * This file mirrors `supabase/migrations/*`. After applying migrations to a
 * linked project it can be regenerated with:
 *
 *   npx supabase gen types typescript --linked > src/types/database.ts
 *
 * Keep it free of domain imports so regeneration stays simple; map rows into
 * the app types in `src/types/index.ts` inside the repository layer.
 */

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
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          icon: string;
          title_bn: string;
          title_en: string;
          description_bn: string;
          description_en: string;
          sort_order: number;
          status: Database["public"]["Enums"]["category_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          icon?: string;
          title_bn: string;
          title_en: string;
          description_bn?: string;
          description_en?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["category_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          icon?: string;
          title_bn?: string;
          title_en?: string;
          description_bn?: string;
          description_en?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["category_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          id: string;
          slug: string;
          type: Database["public"]["Enums"]["source_type"];
          title_bn: string;
          title_en: string;
          citation: string | null;
          url: string | null;
          note_bn: string;
          note_en: string;
          verification: Database["public"]["Enums"]["verification_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          type: Database["public"]["Enums"]["source_type"];
          title_bn: string;
          title_en: string;
          citation?: string | null;
          url?: string | null;
          note_bn?: string;
          note_en?: string;
          verification?: Database["public"]["Enums"]["verification_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          type?: Database["public"]["Enums"]["source_type"];
          title_bn?: string;
          title_en?: string;
          citation?: string | null;
          url?: string | null;
          note_bn?: string;
          note_en?: string;
          verification?: Database["public"]["Enums"]["verification_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          locale: Database["public"]["Enums"]["content_locale"];
          title: string;
          summary: string;
          body: Json;
          category_id: string | null;
          status: Database["public"]["Enums"]["article_status"];
          featured: boolean;
          published_at: string | null;
          reading_minutes: number;
          is_demo: boolean;
          keywords: string[];
          seo_title: string | null;
          seo_description: string | null;
          og_image_path: string | null;
          author_id: string | null;
          editorial_approved_at: string | null;
          religious_review_status: Database["public"]["Enums"]["religious_review_status"];
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          locale: Database["public"]["Enums"]["content_locale"];
          title: string;
          summary?: string;
          body?: Json;
          category_id?: string | null;
          status?: Database["public"]["Enums"]["article_status"];
          featured?: boolean;
          published_at?: string | null;
          reading_minutes?: number;
          is_demo?: boolean;
          keywords?: string[];
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_path?: string | null;
          author_id?: string | null;
          editorial_approved_at?: string | null;
          religious_review_status?: Database["public"]["Enums"]["religious_review_status"];
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          locale?: Database["public"]["Enums"]["content_locale"];
          title?: string;
          summary?: string;
          body?: Json;
          category_id?: string | null;
          status?: Database["public"]["Enums"]["article_status"];
          featured?: boolean;
          published_at?: string | null;
          reading_minutes?: number;
          is_demo?: boolean;
          keywords?: string[];
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_path?: string | null;
          author_id?: string | null;
          editorial_approved_at?: string | null;
          religious_review_status?: Database["public"]["Enums"]["religious_review_status"];
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      article_sources: {
        Row: {
          article_id: string;
          source_id: string;
          position: number;
        };
        Insert: {
          article_id: string;
          source_id: string;
          position?: number;
        };
        Update: {
          article_id?: string;
          source_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "article_sources_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_sources_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      article_related: {
        Row: {
          article_id: string;
          related_article_id: string;
          position: number;
        };
        Insert: {
          article_id: string;
          related_article_id: string;
          position?: number;
        };
        Update: {
          article_id?: string;
          related_article_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "article_related_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_related_related_article_id_fkey";
            columns: ["related_article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          slug: string;
          name_bn: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_bn: string;
          name_en: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_bn?: string;
          name_en?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      article_tags: {
        Row: {
          article_id: string;
          tag_id: string;
        };
        Insert: {
          article_id: string;
          tag_id: string;
        };
        Update: {
          article_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      duas: {
        Row: {
          id: string;
          slug: string;
          title_bn: string;
          title_en: string;
          occasion_bn: string;
          occasion_en: string;
          arabic: string;
          transliteration: string;
          translation_bn: string;
          translation_en: string;
          status: Database["public"]["Enums"]["dua_status"];
          verification: Database["public"]["Enums"]["verification_status"];
          translation_is_editorial: boolean;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_bn: string;
          title_en: string;
          occasion_bn?: string;
          occasion_en?: string;
          arabic: string;
          transliteration?: string;
          translation_bn?: string;
          translation_en?: string;
          status?: Database["public"]["Enums"]["dua_status"];
          verification?: Database["public"]["Enums"]["verification_status"];
          translation_is_editorial?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_bn?: string;
          title_en?: string;
          occasion_bn?: string;
          occasion_en?: string;
          arabic?: string;
          transliteration?: string;
          translation_bn?: string;
          translation_en?: string;
          status?: Database["public"]["Enums"]["dua_status"];
          verification?: Database["public"]["Enums"]["verification_status"];
          translation_is_editorial?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dua_sources: {
        Row: {
          dua_id: string;
          source_id: string;
          position: number;
        };
        Insert: {
          dua_id: string;
          source_id: string;
          position?: number;
        };
        Update: {
          dua_id?: string;
          source_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dua_sources_dua_id_fkey";
            columns: ["dua_id"];
            isOneToOne: false;
            referencedRelation: "duas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dua_sources_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      article_reviews: {
        Row: {
          id: string;
          article_id: string;
          reviewer_id: string | null;
          review_type: Database["public"]["Enums"]["review_type"];
          status: Database["public"]["Enums"]["review_status"];
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          reviewer_id?: string | null;
          review_type: Database["public"]["Enums"]["review_type"];
          status?: Database["public"]["Enums"]["review_status"];
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          reviewer_id?: string | null;
          review_type?: Database["public"]["Enums"]["review_type"];
          status?: Database["public"]["Enums"]["review_status"];
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_reviews_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      correction_reports: {
        Row: {
          id: string;
          article_id: string | null;
          name: string | null;
          email: string | null;
          subject_type: string | null;
          message: string;
          status: Database["public"]["Enums"]["correction_status"];
          resolution_notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id?: string | null;
          name?: string | null;
          email?: string | null;
          subject_type?: string | null;
          message: string;
          status?: Database["public"]["Enums"]["correction_status"];
          resolution_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string | null;
          name?: string | null;
          email?: string | null;
          subject_type?: string | null;
          message?: string;
          status?: Database["public"]["Enums"]["correction_status"];
          resolution_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "correction_reports_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          status: Database["public"]["Enums"]["contact_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          status?: Database["public"]["Enums"]["contact_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          status?: Database["public"]["Enums"]["contact_status"];
          created_at?: string;
        };
        Relationships: [];
      };
      dream_topics: {
        Row: {
          id: string;
          slug: string;
          title_bn: string;
          title_en: string;
          summary_bn: string;
          summary_en: string;
          category_id: string | null;
          status: Database["public"]["Enums"]["category_status"];
          review_status: Database["public"]["Enums"]["review_status"];
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_bn: string;
          title_en: string;
          summary_bn?: string;
          summary_en?: string;
          category_id?: string | null;
          status?: Database["public"]["Enums"]["category_status"];
          review_status?: Database["public"]["Enums"]["review_status"];
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_bn?: string;
          title_en?: string;
          summary_bn?: string;
          summary_en?: string;
          category_id?: string | null;
          status?: Database["public"]["Enums"]["category_status"];
          review_status?: Database["public"]["Enums"]["review_status"];
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dream_topics_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      dream_topic_aliases: {
        Row: {
          id: string;
          topic_id: string;
          locale: Database["public"]["Enums"]["content_locale"];
          is_romanized: boolean;
          alias: string;
          normalized: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          locale?: Database["public"]["Enums"]["content_locale"];
          is_romanized?: boolean;
          alias: string;
          normalized?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          locale?: Database["public"]["Enums"]["content_locale"];
          is_romanized?: boolean;
          alias?: string;
          normalized?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dream_topic_aliases_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "dream_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      dream_topic_articles: {
        Row: {
          topic_id: string;
          article_id: string;
          position: number;
        };
        Insert: {
          topic_id: string;
          article_id: string;
          position?: number;
        };
        Update: {
          topic_id?: string;
          article_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dream_topic_articles_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "dream_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dream_topic_articles_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      dream_topic_duas: {
        Row: {
          topic_id: string;
          dua_id: string;
          position: number;
        };
        Insert: {
          topic_id: string;
          dua_id: string;
          position?: number;
        };
        Update: {
          topic_id?: string;
          dua_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dream_topic_duas_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "dream_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dream_topic_duas_dua_id_fkey";
            columns: ["dua_id"];
            isOneToOne: false;
            referencedRelation: "duas";
            referencedColumns: ["id"];
          },
        ];
      };
      dream_topic_sources: {
        Row: {
          topic_id: string;
          source_id: string;
          position: number;
        };
        Insert: {
          topic_id: string;
          source_id: string;
          position?: number;
        };
        Update: {
          topic_id?: string;
          source_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dream_topic_sources_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "dream_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dream_topic_sources_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      admin_set_user_role: {
        Args: {
          p_user_id: string;
          p_role: Database["public"]["Enums"]["user_role"];
        };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      record_religious_review: {
        Args: {
          p_article_id: string;
          p_status: Database["public"]["Enums"]["review_status"];
          p_notes?: string;
        };
        Returns: Database["public"]["Tables"]["article_reviews"]["Row"];
      };
    };
    Enums: {
      user_role: "admin" | "editor" | "reviewer";
      content_locale: "bn" | "en";
      article_status: "draft" | "in_review" | "published" | "archived";
      category_status: "draft" | "published";
      source_type: "quran" | "hadith" | "scholarly" | "editorial" | "cultural";
      verification_status: "checked" | "pending" | "demo";
      dua_status: "draft" | "published";
      review_type: "editorial" | "religious";
      review_status: "pending" | "approved" | "changes_requested";
      religious_review_status: "none" | "pending" | "approved";
      correction_status: "open" | "reviewing" | "resolved" | "rejected";
      contact_status: "new" | "read" | "archived";
    };
    CompositeTypes: Record<never, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
