"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpRight,
  CalendarDays,
  Eye,
  EyeOff,
  Filter,
  FolderKanban,
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import type { Project, ProjectImage } from "@/lib/supabase/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type DashboardImage = ProjectImage & { previewUrl: string };
type DashboardProject = Project & { images: DashboardImage[] };
type StatusFilter = "all" | "published" | "draft";
type SortOption = "updated_at" | "created_at" | "category" | "priority" | "is_published";

const sortLabels: Record<SortOption, string> = {
  updated_at: "Última actualización",
  created_at: "Más recientes",
  category: "Categoría",
  priority: "Prioridad",
  is_published: "Estado",
};

export default function AdminDashboardContent() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated_at");
  const [busyProject, setBusyProject] = useState("");

  const loadProjects = useCallback(async () => {
    if (!supabase) {
      setError("Configura las variables públicas de Supabase para gestionar proyectos.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (loadError) {
      setError(`No se pudieron cargar los proyectos: ${loadError.message}`);
      setLoading(false);
      return;
    }

    if (!data.length) {
      setProjects([]);
      setError("");
      setLoading(false);
      return;
    }

    const { data: images, error: imageError } = await supabase
      .from("project_images")
      .select("*")
      .in("project_id", data.map((project) => project.id))
      .order("sort_order", { ascending: true });

    if (imageError) {
      setError(`No se pudieron cargar las imágenes: ${imageError.message}`);
      setLoading(false);
      return;
    }

    const signedImages = await Promise.all(
      (images ?? []).map(async (image) => {
        const { data: signed, error: signedError } = await supabase.storage
          .from("portfolio-images")
          .createSignedUrl(image.storage_path, 3600);
        if (signedError) {
          setError(`No se pudo generar el enlace de una imagen: ${signedError.message}`);
          return null;
        }
        return { ...image, previewUrl: signed.signedUrl };
      }),
    );
    if (signedImages.some((image) => image === null)) {
      setLoading(false);
      return;
    }
    const availableImages = signedImages.filter(
      (image): image is DashboardImage => image !== null,
    );

    setProjects(data.map((project) => ({
      ...project,
      images: availableImages.filter((image) => image.project_id === project.id),
    })));
    setError("");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadProjects);
  }, [loadProjects]);

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category))].sort(),
    [projects],
  );
  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    const filtered = projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [project.title, project.slug, project.category, project.summary]
          .some((value) => value.toLocaleLowerCase("es").includes(normalizedQuery));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && project.is_published) ||
        (statusFilter === "draft" && !project.is_published);
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "category") return a.category.localeCompare(b.category, "es");
      if (sortBy === "priority") return a.priority - b.priority;
      if (sortBy === "is_published") return Number(b.is_published) - Number(a.is_published);
      return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
    });
  }, [categoryFilter, projects, query, sortBy, statusFilter]);

  async function toggleProject(project: DashboardProject, field: "is_published" | "is_featured") {
    if (!supabase) return;
    setBusyProject(project.id);
    setError("");
    const nextValue = !project[field];
    const update = field === "is_published"
      ? {
          is_published: nextValue,
          published_at: nextValue ? project.published_at ?? new Date().toISOString() : null,
        }
      : { is_featured: nextValue };
    const { error: updateError } = await supabase
      .from("projects")
      .update(update)
      .eq("id", project.id);

    if (updateError) {
      setError(`No se pudo actualizar "${project.title}": ${updateError.message}`);
    } else {
      setProjects((current) => current.map((item) => item.id === project.id ? { ...item, ...update } : item));
    }
    setBusyProject("");
  }

  async function deleteProject(project: DashboardProject) {
    if (!supabase || !window.confirm(`¿Eliminar "${project.title}" y todas sus imágenes? Esta acción no se puede deshacer.`)) return;
    setBusyProject(project.id);
    setError("");

    const paths = project.images.map((image) => image.storage_path);
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", project.id);
    if (deleteError) {
      setError(`No se pudo eliminar el proyecto: ${deleteError.message}`);
      setBusyProject("");
      return;
    }

    setProjects((current) => current.filter((item) => item.id !== project.id));
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from("portfolio-images").remove(paths);
      if (storageError) {
        setError(`El proyecto fue eliminado, pero no se pudieron limpiar algunas imágenes: ${storageError.message}`);
      }
    }
    setBusyProject("");
  }

  const publishedCount = projects.filter((project) => project.is_published).length;
  const featuredCount = projects.filter((project) => project.is_featured).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">PORTAFOLIO · WEB PRO LS</span>
          <h1>Proyectos</h1>
          <p>Administra, organiza y publica los trabajos de tu sitio.</p>
        </div>
        <Link href="/admin/proyectos/nuevo" className="admin-primary-button"><Plus size={18} /> Nuevo proyecto</Link>
      </div>

      <div className="admin-metrics">
        <article><span className="metric-icon blue"><FolderKanban size={18} /></span><div><small>Proyectos totales</small><strong>{projects.length}</strong></div></article>
        <article><span className="metric-icon green"><Eye size={18} /></span><div><small>Publicados</small><strong>{publishedCount}</strong></div></article>
        <article><span className="metric-icon gold"><Sparkles size={18} /></span><div><small>Destacados</small><strong>{featuredCount}</strong></div></article>
      </div>

      <section className="admin-projects-panel">
        <div className="admin-panel-heading">
          <div><h2>Todos los proyectos</h2><p>{filteredProjects.length} {filteredProjects.length === 1 ? "proyecto" : "proyectos"} encontrados</p></div>
        </div>
        <div className="admin-filters">
          <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, categoría o slug" /></label>
          <label className="admin-select"><Filter size={16} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="all">Todos los estados</option><option value="published">Publicados</option><option value="draft">Borradores</option></select></label>
          <label className="admin-select"><FolderKanban size={16} /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas las categorías</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <label className="admin-select"><ArrowDownWideNarrow size={16} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>

        {error && <div className="admin-alert" role="alert">{error}</div>}
        {loading ? (
          <div className="admin-empty"><LoaderCircle className="spin" size={24} /><span>Cargando proyectos…</span></div>
        ) : filteredProjects.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon"><FolderKanban size={24} /></span>
            <h3>{projects.length ? "No hay resultados" : "Aún no tienes proyectos"}</h3>
            <p>{projects.length ? "Prueba con otros filtros o términos de búsqueda." : "Crea tu primer proyecto para comenzar a completar el portafolio."}</p>
            {!projects.length && <Link href="/admin/proyectos/nuevo" className="admin-primary-button"><Plus size={17} /> Crear proyecto</Link>}
          </div>
        ) : (
          <div className="admin-project-table-wrap">
            <table className="admin-project-table">
              <thead><tr><th>Proyecto</th><th>Categoría</th><th>Estado</th><th>Prioridad</th><th>Actualizado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const cover = project.images.find((image) => image.is_cover) ?? project.images[0];
                  return (
                    <tr key={project.id}>
                      <td><div className="project-table-title">
                        {cover?.previewUrl ? <Image src={cover.previewUrl} alt={cover.alt_text || project.title} width={68} height={52} unoptimized /> : <span className="project-table-placeholder"><FolderKanban size={18} /></span>}
                        <div><strong>{project.title}</strong><small>/{project.slug}</small></div>
                      </div></td>
                      <td><span className="category-chip">{project.category}</span></td>
                      <td><span className={`status-chip ${project.is_published ? "published" : "draft"}`}><i />{project.is_published ? "Publicado" : "Borrador"}</span></td>
                      <td><span className="priority-label">{project.is_featured && <Star size={14} fill="currentColor" />} {project.priority}</span></td>
                      <td><span className="date-label"><CalendarDays size={14} />{new Date(project.updated_at).toLocaleDateString("es-CL")}</span></td>
                      <td>
                        <div className="project-actions">
                          <button type="button" className={project.is_featured ? "is-featured" : ""} title={project.is_featured ? "Quitar destacado" : "Marcar destacado"} aria-label={project.is_featured ? "Quitar destacado" : "Marcar destacado"} onClick={() => void toggleProject(project, "is_featured")} disabled={busyProject === project.id}><Star size={16} fill={project.is_featured ? "currentColor" : "none"} /></button>
                          <button type="button" title={project.is_published ? "Despublicar" : "Publicar"} aria-label={project.is_published ? "Despublicar" : "Publicar"} onClick={() => void toggleProject(project, "is_published")} disabled={busyProject === project.id}>{project.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                          {project.is_published && <Link href={`/portafolio/${project.slug}`} target="_blank" title="Ver página pública" aria-label="Ver página pública"><ArrowUpRight size={16} /></Link>}
                          <Link href={`/admin/proyectos/${project.id}/editar`} title="Editar proyecto" aria-label="Editar proyecto"><span className="edit-action">Editar</span></Link>
                          <button type="button" className="delete-action" title="Eliminar proyecto" aria-label="Eliminar proyecto" onClick={() => void deleteProject(project)} disabled={busyProject === project.id}>{busyProject === project.id ? <LoaderCircle className="spin" size={16} /> : <Trash2 size={16} />}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
