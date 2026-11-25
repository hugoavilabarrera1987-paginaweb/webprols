import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ImageOff } from "lucide-react";
import { getPublishedProjectBySlug } from "@/lib/supabase/portfolio";
import { sanitizeProjectDescription } from "@/lib/supabase/sanitize";

type Props = PageProps<"/portafolio/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Proyecto no encontrado | Web Pro LS" };

  return {
    title: project.seo_title || `${project.title} | Portafolio Web Pro LS`,
    description: project.seo_description || project.summary,
    alternates: { canonical: `https://webprols.com/portafolio/${project.slug}` },
    openGraph: {
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary,
      images: project.images.length ? [project.images.find((image) => image.is_cover)?.url ?? project.images[0].url] : [],
      type: "article",
    },
  };
}

export default function PortfolioProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<main className="portfolio-detail-page"><div className="admin-empty">Cargando proyecto…</div></main>}>
      <ResolvedPortfolioProject params={params} />
    </Suspense>
  );
}

async function ResolvedPortfolioProject({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const orderedImages = [...project.images].sort((a, b) => a.sort_order - b.sort_order);
  const description = sanitizeProjectDescription(project.description_html);

  return (
    <main className="portfolio-detail-page">
      <section className="portfolio-detail-hero">
        <div className="container">
          <Link className="portfolio-back-link" href="/portafolio"><ArrowLeft size={16} /> Volver al portafolio</Link>
          <span className="portfolio-detail-category">{project.category}{project.is_featured ? " · Proyecto destacado" : ""}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
      </section>
      <div className="container portfolio-detail-content">
        {orderedImages.length > 0 ? (
          <div className="portfolio-detail-gallery">
            {orderedImages.map((image, index) => (
              <figure className={index === 0 ? "gallery-cover" : ""} key={image.id}>
                <Image
                  src={image.url}
                  alt={image.alt_text || project.title}
                  width={1440}
                  height={900}
                  sizes={index === 0
                    ? "(max-width: 1212px) calc(100vw - 32px), 1180px"
                    : "(max-width: 760px) calc(100vw - 32px), (max-width: 1212px) calc((100vw - 47px) / 2), 582px"}
                  quality={75}
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="portfolio-no-gallery"><ImageOff size={28} /><span>Este proyecto no tiene imágenes disponibles.</span></div>
        )}
        <div className="portfolio-detail-columns">
          <article className="portfolio-rich-description">
            <span className="section-kicker">Sobre el proyecto</span>
            <div className="project-rich-content" dangerouslySetInnerHTML={{ __html: description }} />
          </article>
          <aside className="portfolio-detail-aside">
            <h2>Detalles</h2>
            <dl>
              <div><dt>Categoría</dt><dd>{project.category}</dd></div>
              {project.client_name && <div><dt>Cliente</dt><dd>{project.client_name}</dd></div>}
              <div><dt>Publicado</dt><dd>{project.published_at ? new Date(project.published_at).toLocaleDateString("es-CL") : "Recientemente"}</dd></div>
            </dl>
            {project.project_url && <a className="btn btn-primary" href={project.project_url} target="_blank" rel="noreferrer">Visitar proyecto <ArrowUpRight size={17} /></a>}
          </aside>
        </div>
      </div>
      <section className="portfolio-detail-cta">
        <div className="container"><div><span className="section-kicker">¿Tienes un proyecto similar?</span><h2>Hagamos crecer tu negocio en internet</h2></div><Link href="/contacto" className="btn btn-primary">Conversemos <ArrowUpRight size={17} /></Link></div>
      </section>
    </main>
  );
}
