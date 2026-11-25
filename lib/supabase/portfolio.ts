import type { Database, Project, ProjectImage } from "./database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabasePublicClient } from "./public";

export type PublicProject = Project & {
  images: (ProjectImage & { url: string })[];
};

type PortfolioCardProject = Pick<
  Project,
  "id" | "title" | "slug" | "category" | "summary" | "is_featured"
> & {
  images: (ProjectImage & { url: string })[];
};

async function createSignedProjectImages(
  supabase: SupabaseClient<Database>,
  images: ProjectImage[],
): Promise<(ProjectImage & { url: string })[]> {
  if (!images.length) return [];

  const { data, error } = await supabase.storage
    .from("portfolio-images")
    .createSignedUrls(
      images.map((image) => image.storage_path),
      3600,
    );

  if (error) {
    throw new Error(`No se pudieron generar los enlaces de las imágenes: ${error.message}`);
  }

  const signedUrls = new Map<string, string>();
  for (const image of data) {
    if (image.error || !image.path || !image.signedUrl) {
      throw new Error(`No se pudo generar el enlace de una imagen: ${image.error ?? "respuesta incompleta"}`);
    }
    signedUrls.set(image.path, image.signedUrl);
  }

  return images.map((image) => {
    const url = signedUrls.get(image.storage_path);
    if (!url) {
      throw new Error("No se pudo generar el enlace de una imagen: respuesta incompleta.");
    }
    return { ...image, url };
  });
}

export async function getPublishedProjects(): Promise<PortfolioCardProject[] | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, title, slug, category, summary, is_featured")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("priority", { ascending: true })
    .order("published_at", { ascending: false });

  if (projectError) {
    throw new Error(`No se pudieron cargar los proyectos: ${projectError.message}`);
  }

  if (!projects.length) return [];

  const { data: images, error: imageError } = await supabase
    .from("project_images")
    .select("*")
    .in(
      "project_id",
      projects.map((project) => project.id),
    )
    .order("sort_order", { ascending: true });

  if (imageError) {
    throw new Error(`No se pudieron cargar las imágenes: ${imageError.message}`);
  }

  const coverByProjectId = new Map<string, ProjectImage>();
  for (const image of images ?? []) {
    const currentCover = coverByProjectId.get(image.project_id);
    if (!currentCover || (image.is_cover && !currentCover.is_cover)) {
      coverByProjectId.set(image.project_id, image);
    }
  }

  const covers = projects
    .map((project) => coverByProjectId.get(project.id))
    .filter((image): image is ProjectImage => image !== undefined);
  const signedCovers = await createSignedProjectImages(supabase, covers);
  const signedCoverByProjectId = new Map(
    signedCovers.map((image) => [image.project_id, image]),
  );

  return projects.map((project) => {
    const cover = signedCoverByProjectId.get(project.id);
    return { ...project, images: cover ? [cover] : [] };
  });
}

export async function getPublishedProjectSlugs(): Promise<
  Pick<Project, "slug" | "updated_at">[] | null
> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("priority", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los proyectos: ${error.message}`);
  }

  return data;
}

export async function getPublishedProjectBySlug(slug: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (projectError) {
    throw new Error(`No se pudo cargar el proyecto: ${projectError.message}`);
  }

  if (!project) return null;

  const { data: images, error: imageError } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  if (imageError) {
    throw new Error(`No se pudieron cargar las imágenes: ${imageError.message}`);
  }

  const projectImages = await createSignedProjectImages(supabase, images ?? []);

  return {
    ...project,
    images: projectImages,
  } satisfies PublicProject;
}
