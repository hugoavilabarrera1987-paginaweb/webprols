"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Eye, LoaderCircle, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { RichTextEditor } from "./RichTextEditor";

type BlogPostForm = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  content_html: string;
  read_minutes: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
};

const emptyForm: BlogPostForm = {
  title: "",
  slug: "",
  category: "Diseño web",
  summary: "",
  content_html: "",
  read_minutes: "5",
  seo_title: "",
  seo_description: "",
  is_published: false,
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditor({ postId }: { postId?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [form, setForm] = useState<BlogPostForm>(emptyForm);
  const [loadedPublishedAt, setLoadedPublishedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(!postId);
  const [slugTouched, setSlugTouched] = useState(Boolean(postId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!postId || !supabase) return;
    const editId = postId;
    let active = true;

    async function loadPost() {
      const { data: post, error: loadError } = await supabase!
        .from("blog_posts")
        .select("*")
        .eq("id", editId)
        .maybeSingle();

      if (!active) return;
      if (loadError || !post) {
        setError(loadError ? `No se pudo cargar el artículo: ${loadError.message}` : "No se encontró el artículo solicitado.");
        setLoaded(true);
        return;
      }

      setForm({
        title: post.title,
        slug: post.slug,
        category: post.category,
        summary: post.summary,
        content_html: post.content_html,
        read_minutes: String(post.read_minutes),
        seo_title: post.seo_title ?? "",
        seo_description: post.seo_description ?? "",
        is_published: post.is_published,
      });
      setLoadedPublishedAt(post.published_at);
      setLoaded(true);
    }

    void Promise.resolve().then(loadPost);
    return () => {
      active = false;
    };
  }, [postId, supabase]);

  function updateField<K extends keyof BlogPostForm>(field: K, value: BlogPostForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const slug = toSlug(form.slug);
    const readingMinutes = Number.parseInt(form.read_minutes, 10);
    const plainContent = form.content_html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

    if (!supabase) {
      setError("Configura las variables públicas de Supabase para guardar artículos.");
      return;
    }
    if (!form.title.trim() || !slug || !form.category.trim() || !form.summary.trim()) {
      setError("Completa el título, slug, categoría y resumen del artículo.");
      return;
    }
    if (!plainContent) {
      setError("Agrega el contenido del artículo.");
      return;
    }
    if (!Number.isInteger(readingMinutes) || readingMinutes < 1 || readingMinutes > 60) {
      setError("El tiempo de lectura debe estar entre 1 y 60 minutos.");
      return;
    }
    if (form.seo_title.length > 70 || form.seo_description.length > 170) {
      setError("El título SEO admite 70 caracteres y la descripción SEO 170.");
      return;
    }

    setLoading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError("Tu sesión expiró. Vuelve a iniciar sesión.");
      setLoading(false);
      router.replace("/admin/login");
      return;
    }

    const isPublished = form.is_published;
    const record = {
      title: form.title.trim(),
      slug,
      category: form.category.trim(),
      summary: form.summary.trim(),
      content_html: form.content_html,
      read_minutes: readingMinutes,
      is_published: isPublished,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published_at: isPublished ? loadedPublishedAt ?? new Date().toISOString() : null,
    };

    const result = postId
      ? await supabase.from("blog_posts").update(record).eq("id", postId).select("id").single()
      : await supabase.from("blog_posts").insert(record).select("id").single();

    if (result.error || !result.data) {
      const message = result.error?.code === "23505"
        ? "Ya existe otro artículo con ese slug."
        : result.error?.message ?? "Supabase no devolvió el artículo guardado.";
      setError(`No se pudo guardar el artículo: ${message}`);
      setLoading(false);
      return;
    }

    const savedId = result.data.id;
    setLoadedPublishedAt(record.published_at);
    setLoading(false);
    setNotice("Artículo guardado correctamente.");
    router.replace(`/admin/blog/${savedId}/editar`);
    router.refresh();
  }

  if (!loaded) {
    if (!supabase) {
      return <div className="admin-alert" role="alert">Configura las variables públicas de Supabase para gestionar artículos.</div>;
    }
    return <div className="admin-empty"><LoaderCircle className="spin" size={24} /><span>Cargando artículo…</span></div>;
  }

  return (
    <div className="blog-editor-page">
      <div className="admin-page-heading editor-heading">
        <div>
          <Link className="admin-back-link" href="/admin/blog"><ArrowLeft size={16} /> Volver al blog</Link>
          <span className="admin-eyebrow">CONTENIDO DEL BLOG</span>
          <h1>{postId ? "Editar artículo" : "Nuevo artículo"}</h1>
          <p>Prepara el contenido y controla cuándo se muestra en el sitio.</p>
        </div>
        <div className="editor-top-actions">
          {form.is_published && form.slug && <Link className="admin-secondary-button" href={`/blog/${toSlug(form.slug)}`} target="_blank"><Eye size={17} /> Ver artículo</Link>}
          <button type="submit" form="blog-post-form" className="admin-primary-button" disabled={loading}><Save size={17} /> {loading ? "Guardando…" : "Guardar artículo"}</button>
        </div>
      </div>

      {error && <div className="admin-alert" role="alert">{error}</div>}
      {notice && <div className="admin-success" role="status"><Check size={17} />{notice}</div>}

      <form id="blog-post-form" className="blog-editor-form" onSubmit={(event) => void savePost(event)}>
        <section className="editor-card">
          <div className="editor-card-heading"><span>01</span><div><h2>Información del artículo</h2><p>El título, resumen y categoría aparecen en la lista del blog.</p></div></div>
          <div className="editor-fields">
            <label className="field-full">Título del artículo *<input required maxLength={120} value={form.title} onChange={(event) => {
              const title = event.target.value;
              setForm((current) => ({ ...current, title, ...(slugTouched ? {} : { slug: toSlug(title) }) }));
            }} placeholder="Ej. Cómo mejorar la presencia digital de tu empresa" /></label>
            <label className="field-full">Slug público *<div className="slug-input"><span>/blog/</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} value={form.slug} onChange={(event) => { setSlugTouched(true); updateField("slug", toSlug(event.target.value)); }} placeholder="titulo-del-articulo" /></div><small>Solo letras minúsculas, números y guiones.</small></label>
            <label>Categoría *<input required maxLength={80} value={form.category} onChange={(event) => updateField("category", event.target.value)} placeholder="Diseño web, SEO, etc." /></label>
            <label>Tiempo de lectura *<span className="blog-reading-field"><input type="number" min={1} max={60} required value={form.read_minutes} onChange={(event) => updateField("read_minutes", event.target.value)} /><span>minutos</span></span></label>
            <label className="field-full">Resumen *<textarea required maxLength={240} rows={3} value={form.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Describe brevemente el tema del artículo." /><small>{form.summary.length}/240 caracteres</small></label>
            <label className="field-full">Contenido del artículo *<RichTextEditor initialContent={form.content_html} onChange={(html) => updateField("content_html", html)} /></label>
          </div>
        </section>

        <section className="editor-card">
          <div className="editor-card-heading"><span>02</span><div><h2>Publicación y SEO</h2><p>Los borradores no aparecen en el sitio público.</p></div></div>
          <div className="editor-fields">
            <label className="blog-publish-toggle"><input type="checkbox" checked={form.is_published} onChange={(event) => updateField("is_published", event.target.checked)} /><span><strong>Artículo publicado</strong><small>Visible en el blog y disponible mediante su enlace público.</small></span></label>
            <label className="field-full">Título SEO<input maxLength={70} value={form.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} placeholder="Título para buscadores (opcional)" /><small>{form.seo_title.length}/70 caracteres</small></label>
            <label className="field-full">Descripción SEO<textarea maxLength={170} rows={3} value={form.seo_description} onChange={(event) => updateField("seo_description", event.target.value)} placeholder="Descripción para buscadores (opcional)" /><small>{form.seo_description.length}/170 caracteres</small></label>
          </div>
        </section>
      </form>
    </div>
  );
}
