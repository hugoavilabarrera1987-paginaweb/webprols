import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublishedBlogSlugs, legacyBlogPosts } from "@/lib/supabase/blog";
import { getPublishedProjectSlugs } from "@/lib/supabase/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const routes = [
    "",
    "/servicios",
    "/sitios-web",
    "/sistemas-web",
    "/nosotros",
    "/metodologia",
    "/portafolio",
    "/blog",
    "/contacto",
    "/privacidad",
    "/soluciones/diseno-ui-ux-branding",
    "/soluciones/seo-tecnico-velocidad",
    "/soluciones/hosting-cloud-soporte",
    "/soluciones/landing-pages-express",
    "/soluciones/sitios-web-corporativos",
    "/soluciones/tiendas-online-ecommerce",
    "/soluciones/erp-crm-medida",
    "/soluciones/reservas-citas",
    "/soluciones/integraciones-api-pasarelas",
  ];
  const projects = await getPublishedProjectSlugs();
  const blogPosts = await getPublishedBlogSlugs();
  return [
    ...routes.map((route) => ({ url: `https://webprols.com${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...(projects ?? []).map((project) => ({
      url: `https://webprols.com/portafolio/${project.slug}`,
      lastModified: project.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...(blogPosts ?? legacyBlogPosts.map((post) => ({ slug: post.slug, updated_at: null }))).map((post) => ({
      url: `https://webprols.com/blog/${post.slug}`,
      ...(post.updated_at ? { lastModified: post.updated_at } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
