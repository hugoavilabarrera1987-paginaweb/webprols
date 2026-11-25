export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description_html: string;
  client_name: string | null;
  project_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  is_featured: boolean;
  priority: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content_html: string;
  read_minutes: number;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      projects: Table<
        Project,
        Omit<Project, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<Omit<Project, "id" | "created_at">>
      >;
      project_images: Table<
        ProjectImage,
        Omit<ProjectImage, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        },
        Partial<Omit<ProjectImage, "id" | "created_at">>
      >;
      blog_posts: Table<
        BlogPost,
        Omit<BlogPost, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<Omit<BlogPost, "id" | "created_at">>
      >;
      admin_users: Table<
        { user_id: string; created_at: string },
        { user_id: string; created_at?: string },
        never
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_portfolio_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
