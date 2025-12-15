export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      awards: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          issuer: string | null
          link_url: string | null
          sort_order: number
          title: string
          updated_at: string
          updated_by: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          issuer?: string | null
          link_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          issuer?: string | null
          link_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          updated_by: string | null
          views_count: number
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          updated_by?: string | null
          views_count?: number
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          replied_at: string | null
          replied_by: string | null
          status: string
          subject: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          question: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          question: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          background_image_url: string | null
          background_video_url: string | null
          created_at: string
          created_by: string | null
          cta_link: string | null
          cta_text: string | null
          heading: string
          id: string
          is_active: boolean
          overlay_opacity: number
          sort_order: number
          subheading: string | null
          text_alignment: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          background_image_url?: string | null
          background_video_url?: string | null
          created_at?: string
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          heading: string
          id?: string
          is_active?: boolean
          overlay_opacity?: number
          sort_order?: number
          subheading?: string | null
          text_alignment?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          background_image_url?: string | null
          background_video_url?: string | null
          created_at?: string
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          heading?: string
          id?: string
          is_active?: boolean
          overlay_opacity?: number
          sort_order?: number
          subheading?: string | null
          text_alignment?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          ip_address: string | null
          is_active: boolean
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          client_name: string | null
          content: string | null
          created_at: string
          created_by: string | null
          featured_image_url: string | null
          gallery_urls: string[] | null
          id: string
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          project_url: string | null
          published_at: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          technologies: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          client_name?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          featured_image_url?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          project_url?: string | null
          published_at?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          technologies?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          client_name?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          featured_image_url?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          project_url?: string | null
          published_at?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          technologies?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          cta_button_link: string | null
          cta_button_text: string | null
          cta_heading: string | null
          cta_subheading: string | null
          favicon_url: string | null
          footer_copyright: string | null
          id: string
          logo_dark_url: string | null
          logo_light_url: string | null
          meta_description_default: string | null
          meta_title_default: string | null
          newsletter_enabled: boolean
          newsletter_heading: string | null
          newsletter_placeholder: string | null
          primary_color: string | null
          site_name: string
          social_facebook: string | null
          social_github: string | null
          social_image_url: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          tagline: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          cta_button_link?: string | null
          cta_button_text?: string | null
          cta_heading?: string | null
          cta_subheading?: string | null
          favicon_url?: string | null
          footer_copyright?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          meta_description_default?: string | null
          meta_title_default?: string | null
          newsletter_enabled?: boolean
          newsletter_heading?: string | null
          newsletter_placeholder?: string | null
          primary_color?: string | null
          site_name?: string
          social_facebook?: string | null
          social_github?: string | null
          social_image_url?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          cta_button_link?: string | null
          cta_button_text?: string | null
          cta_heading?: string | null
          cta_subheading?: string | null
          favicon_url?: string | null
          footer_copyright?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          meta_description_default?: string | null
          meta_title_default?: string | null
          newsletter_enabled?: boolean
          newsletter_heading?: string | null
          newsletter_placeholder?: string | null
          primary_color?: string | null
          site_name?: string
          social_facebook?: string | null
          social_github?: string | null
          social_image_url?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          phone: string | null
          role: string
          slug: string
          social_github: string | null
          social_linkedin: string | null
          social_twitter: string | null
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          phone?: string | null
          role: string
          slug: string
          social_github?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          phone?: string | null
          role?: string
          slug?: string
          social_github?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_company: string | null
          client_name: string
          client_role: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          project_id: string | null
          quote: string
          rating: number | null
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          client_company?: string | null
          client_name: string
          client_role?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          project_id?: string | null
          quote: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_company?: string | null
          client_name?: string
          client_role?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          project_id?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: boolean
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_users_with_roles: {
        Args: never
        Returns: {
          email: string
          full_name: string
          roles: Database["public"]["Enums"]["app_role"][]
          user_id: string
        }[]
      }
      revoke_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
