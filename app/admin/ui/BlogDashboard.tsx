"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { BlogPost } from "@/lib/supabase/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function BlogDashboard() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPost, setBusyPost] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!supabase) {
      setError("Configura las variables públicas de Supabase para gestionar el blog.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (loadError) {
      setError(`No se pudieron cargar los artículos: ${loadError.message}`);
      setLoading(false);
      return;
    }

    setPosts(data);
    setError("");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadPosts);
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    if (!normalizedQuery) return posts;
    return posts.filter((post) =>
      [post.title, post.slug, post.category, post.summary]
        .some((value) => value.toLocaleLowerCase("es").includes(normalizedQuery)),
    );
  }, [posts, query]);

  async function togglePublished(post: BlogPost) {
    if (!supabase) return;
    setBusyPost(post.id);
    setError("");
    const isPublished = !post.is_published;
    const update = {
      is_published: isPublished,
      published_at: isPublished ? post.published_at ?? new Date().toISOString() : null,
    };
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update(update)
      .eq("id", post.id);

    if (updateError) {
      setError(`No se pudo actualizar "${post.title}": ${updateError.message}`);
    } else {
      setPosts((current) => current.map((item) => item.id === post.id ? { ...item, ...update } : item));
    }
    setBusyPost("");
  }

  async function deletePost(post: BlogPost) {
    if (!supabase || !window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setBusyPost(post.id);
    setError("");
    const { error: deleteError } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id);

    if (deleteError) {
      setError(`No se pudo eliminar el artículo: ${deleteError.message}`);
    } else {
      setPosts((current) => current.filter((item) => item.id !== post.id));
    }
    setBusyPost("");
  }

  const publishedCount = posts.filter((post) => post.is_published).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONTENIDO · WEB PRO LS</span>
          <h1>Blog</h1>
          <p>Administra artículos, edítalos y publícalos en el sitio.</p>
        </div>
        <Link href="/admin/blog/nuevo" className="admin-primary-button"><Plus size={18} /> Nuevo artículo</Link>
      </div>

      <div className="admin-metrics">
        <article><span className="metric-icon blue"><BookOpen size={18} /></span><div><small>Artículos totales</small><strong>{posts.length}</strong></div></article>
        <article><span className="metric-icon green"><Eye size={18} /></span><div><small>Publicados</small><strong>{publishedCount}</strong></div></article>
        <article><span className="metric-icon gold"><EyeOff size={18} /></span><div><small>Borradores</small><strong>{posts.length - publishedCount}</strong></div></article>
      </div>

      <section className="admin-projects-panel">
        <div className="admin-panel-heading">
          <div><h2>Todos los artículos</h2><p>{filteredPosts.length} {filteredPosts.length === 1 ? "artículo" : "artículos"} encontrados</p></div>
        </div>
        <div className="admin-filters">
          <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, categoría o slug" /></label>
        </div>

        {error && <div className="admin-alert" role="alert">{error}</div>}
        {loading ? (
          <div className="admin-empty"><LoaderCircle className="spin" size={24} /><span>Cargando artículos…</span></div>
        ) : filteredPosts.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon"><BookOpen size={24} /></span>
            <h3>{posts.length ? "No hay resultados" : "Aún no tienes artículos"}</h3>
            <p>{posts.length ? "Prueba con otros términos de búsqueda." : "Crea tu primer artículo para publicarlo en el blog."}</p>
            {!posts.length && <Link href="/admin/blog/nuevo" className="admin-primary-button"><Plus size={17} /> Crear artículo</Link>}
          </div>
        ) : (
          <div className="admin-project-table-wrap">
            <table className="admin-project-table">
              <thead><tr><th>Artículo</th><th>Categoría</th><th>Estado</th><th>Lectura</th><th>Actualizado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td><div className="project-table-title">
                      <span className="project-table-placeholder"><BookOpen size={18} /></span>
                      <div><strong>{post.title}</strong><small>/blog/{post.slug}</small></div>
                    </div></td>
                    <td><span className="category-chip">{post.category}</span></td>
                    <td><span className={`status-chip ${post.is_published ? "published" : "draft"}`}><i />{post.is_published ? "Publicado" : "Borrador"}</span></td>
                    <td>{post.read_minutes} min</td>
                    <td><span className="date-label"><CalendarDays size={14} />{new Date(post.updated_at).toLocaleDateString("es-CL")}</span></td>
                    <td>
                      <div className="project-actions">
                        {post.is_published && <Link href={`/blog/${post.slug}`} target="_blank" title="Ver artículo en el sitio" aria-label="Ver artículo en el sitio"><ArrowUpRight size={16} /></Link>}
                        <Link href={`/admin/blog/${post.id}/editar`} title="Editar artículo" aria-label="Editar artículo"><span className="edit-action">Editar</span></Link>
                        <button type="button" title={post.is_published ? "Despublicar" : "Publicar"} aria-label={post.is_published ? "Despublicar" : "Publicar"} onClick={() => void togglePublished(post)} disabled={busyPost === post.id}>
                          {busyPost === post.id ? <LoaderCircle className="spin" size={16} /> : post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button type="button" className="delete-action" title="Eliminar artículo" aria-label="Eliminar artículo" onClick={() => void deletePost(post)} disabled={busyPost === post.id}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
