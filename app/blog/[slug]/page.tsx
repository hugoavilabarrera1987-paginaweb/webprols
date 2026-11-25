import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { getPublishedBlogPostBySlug } from "@/lib/supabase/blog";
import { sanitizeProjectDescription } from "@/lib/supabase/sanitize";

type Props = PageProps<"/blog/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado | Web Pro LS" };

  return {
    title: post.seo_title || `${post.title} | Blog Web Pro LS`,
    description: post.seo_description || post.summary,
    alternates: { canonical: `https://webprols.com/blog/${post.slug}` },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary,
      type: "article",
    },
  };
}

export default function BlogArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<main className="blog-detail-page"><div className="admin-empty">Cargando artículo…</div></main>}>
      <ResolvedBlogArticle params={params} />
    </Suspense>
  );
}

async function ResolvedBlogArticle({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const content = sanitizeProjectDescription(post.content_html);
  return (
    <main className="blog-detail-page">
      <section className="blog-detail-hero">
        <div className="container">
          <Link className="blog-back-link" href="/blog"><ArrowLeft size={16} /> Volver al blog</Link>
          <span className="blog-detail-category">{post.category}</span>
          <h1>{post.title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container blog-detail-layout">
          <article className="blog-detail-article">
            <p className="blog-detail-summary">{post.summary}</p>
            <div className="blog-detail-meta">
              <span><Clock3 size={15} /> {post.read_minutes} min de lectura</span>
              {post.published_at && <span><CalendarDays size={15} /> {new Date(post.published_at).toLocaleDateString("es-CL")}</span>}
            </div>
            {content && <div className="project-rich-content blog-detail-content" dangerouslySetInnerHTML={{ __html: content }} />}
          </article>
          <aside className="blog-detail-aside">
            <span className="section-kicker">Web Pro LS</span>
            <h2>¿Quieres llevar esta idea a tu negocio?</h2>
            <p>Conversemos sobre tu proyecto y encontremos una solución digital a tu medida.</p>
            <Link href="/contacto" className="btn btn-primary">Hablemos <ArrowRight size={17} /></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
