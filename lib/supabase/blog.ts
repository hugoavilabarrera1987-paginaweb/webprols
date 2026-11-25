import type { BlogPost } from "./database.types";
import { createSupabasePublicClient } from "./public";

export type BlogPostPreview = Pick<
  BlogPost,
  "title" | "slug" | "category" | "summary" | "read_minutes"
>;

export type PublicBlogPost = BlogPostPreview &
  Pick<
    BlogPost,
    "content_html" | "seo_title" | "seo_description" | "published_at"
  >;

export const legacyBlogPosts: BlogPostPreview[] = [
  {
    title: "Por qué una empresa necesita un sitio web profesional",
    slug: "por-que-empresa-necesita-sitio-web-profesional",
    category: "Diseño web",
    summary: "Descubre cómo una presencia digital bien construida genera confianza y consultas.",
    read_minutes: 5,
  },
  {
    title: "Cuándo una empresa necesita un sistema web",
    slug: "cuando-empresa-necesita-sistema-web",
    category: "Sistemas personalizados",
    summary: "Identifica cuándo automatizar procesos puede mejorar la gestión y reducir tareas manuales.",
    read_minutes: 6,
  },
  {
    title: "Qué es el SEO técnico",
    slug: "que-es-el-seo-tecnico",
    category: "SEO",
    summary: "Revisa los elementos técnicos que ayudan a los buscadores a entender y mostrar tu sitio.",
    read_minutes: 7,
  },
  {
    title: "Cómo mejorar la velocidad de un sitio",
    slug: "como-mejorar-velocidad-sitio",
    category: "Optimización web",
    summary: "Conoce prácticas clave para ofrecer una experiencia rápida en todos los dispositivos.",
    read_minutes: 5,
  },
  {
    title: "Beneficios de una tienda online",
    slug: "beneficios-tienda-online",
    category: "Tiendas online",
    summary: "Cómo vender de forma continua y administrar productos y pedidos desde un solo lugar.",
    read_minutes: 6,
  },
  {
    title: "Cómo mejorar la experiencia de usuario",
    slug: "como-mejorar-experiencia-usuario",
    category: "UX/UI",
    summary: "Principios para crear navegación clara, accesible y orientada a conversiones.",
    read_minutes: 5,
  },
];

export async function getPublishedBlogPosts(): Promise<BlogPost[] | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los artículos: ${error.message}`);
  }

  return data;
}

export async function getPublishedBlogSlugs(): Promise<
  Pick<BlogPost, "slug" | "updated_at">[] | null
> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los enlaces del blog: ${error.message}`);
  }

  return data;
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    const legacy = legacyBlogPosts.find((post) => post.slug === slug);
    return legacy
      ? {
          ...legacy,
          content_html: "",
          seo_title: null,
          seo_description: null,
          published_at: null,
        }
      : null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("title, slug, category, summary, read_minutes, content_html, seo_title, seo_description, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo cargar el artículo: ${error.message}`);
  }

  return data;
}
