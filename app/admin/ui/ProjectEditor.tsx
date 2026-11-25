"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  ImagePlus,
  LoaderCircle,
  Save,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { ProjectImage } from "@/lib/supabase/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { RichTextEditor } from "./RichTextEditor";

type ProjectForm = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  description_html: string;
  client_name: string;
  project_url: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  is_featured: boolean;
  priority: string;
};

type EditorImage = {
  key: string;
  id?: string;
  storagePath?: string;
  file?: File;
  previewUrl: string;
  altText: string;
  isCover: boolean;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  category: "Sitios web",
  summary: "",
  description_html: "",
  client_name: "",
  project_url: "",
  seo_title: "",
  seo_description: "",
  is_published: false,
  is_featured: false,
  priority: "0",
};

const categories = ["Sitios web", "Sistemas web", "Tiendas online", "Landing pages", "Aplicaciones web", "Otros"];

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProjectEditor({ projectId }: { projectId?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [images, setImages] = useState<EditorImage[]>([]);
  const [initialImages, setInitialImages] = useState<ProjectImage[]>([]);
  const [loadedPublishedAt, setLoadedPublishedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(!projectId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(projectId));
  const [activeId, setActiveId] = useState(projectId ?? "");
  const imagesRef = useRef<EditorImage[]>([]);

  useEffect(() => {
    if (!projectId || !supabase) {
      return;
    }

    const editId = projectId;
    let active = true;
    async function loadProject() {
      const { data: project, error: projectError } = await supabase!
        .from("projects")
        .select("*")
        .eq("id", editId)
        .maybeSingle();

      if (!active) return;
      if (projectError || !project) {
        setError(projectError ? `No se pudo cargar el proyecto: ${projectError.message}` : "No se encontró el proyecto solicitado.");
        setLoaded(true);
        return;
      }

      const { data: projectImages, error: imagesError } = await supabase!
        .from("project_images")
        .select("*")
        .eq("project_id", editId)
        .order("sort_order", { ascending: true });

      if (!active) return;
      if (imagesError) {
        setError(`No se pudieron cargar las imágenes: ${imagesError.message}`);
        setLoaded(true);
        return;
      }

      setForm({
        title: project.title,
        slug: project.slug,
        category: project.category,
        summary: project.summary,
        description_html: project.description_html,
        client_name: project.client_name ?? "",
        project_url: project.project_url ?? "",
        seo_title: project.seo_title ?? "",
        seo_description: project.seo_description ?? "",
        is_published: project.is_published,
        is_featured: project.is_featured,
        priority: String(project.priority),
      });
      setLoadedPublishedAt(project.published_at);
      setInitialImages(projectImages ?? []);
      const signedImages = await Promise.all((projectImages ?? []).map(async (image) => {
        const { data: signed, error: signedError } = await supabase!.storage
          .from("portfolio-images")
          .createSignedUrl(image.storage_path, 3600);
        if (signedError) {
          setError(`No se pudo generar el enlace de una imagen: ${signedError.message}`);
          return null;
        }
        return { ...image, previewUrl: signed.signedUrl };
      }));
      if (!active) return;
      if (signedImages.some((image) => image === null)) {
        setLoaded(true);
        return;
      }
      setImages(signedImages.filter((image): image is ProjectImage & { previewUrl: string } => image !== null).map((image) => ({
        key: image.id,
        id: image.id,
        storagePath: image.storage_path,
        previewUrl: image.previewUrl,
        altText: image.alt_text,
        isCover: image.is_cover,
      })));
      setLoaded(true);
    }

    void Promise.resolve().then(loadProject);
    return () => {
      active = false;
    };
  }, [projectId, supabase]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => {
    for (const image of imagesRef.current) {
      if (image.file) URL.revokeObjectURL(image.previewUrl);
    }
  }, []);

  function updateField<K extends keyof ProjectForm>(field: K, value: ProjectForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;
    const invalid = selected.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024);
    if (invalid) {
      setError("Usa imágenes JPG, PNG o WebP de hasta 8 MB cada una.");
      return;
    }
    setError("");
    setImages((current) => [
      ...current,
      ...selected.map((file, index) => ({
        key: `new-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        altText: form.title,
        isCover: current.length === 0 && index === 0,
      })),
    ]);
  }

  function replaceImage(key: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setError("Usa imágenes JPG, PNG o WebP de hasta 8 MB.");
      return;
    }
    setError("");
    setImages((current) => current.map((image) => {
      if (image.key !== key) return image;
      if (image.file) URL.revokeObjectURL(image.previewUrl);
      return { ...image, file, previewUrl: URL.createObjectURL(file) };
    }));
  }

  function removeImage(key: string) {
    setImages((current) => {
      const next = current.filter((image) => image.key !== key);
      const removed = current.find((image) => image.key === key);
      if (removed?.file) URL.revokeObjectURL(removed.previewUrl);
      if (removed?.isCover && next.length) next[0] = { ...next[0], isCover: true };
      return next;
    });
  }

  function setCover(key: string) {
    setImages((current) => current.map((image) => ({ ...image, isCover: image.key === key })));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!supabase) {
      setError("Configura las variables públicas de Supabase para guardar cambios.");
      return;
    }

    const normalizedSlug = toSlug(form.slug);
    if (!normalizedSlug) {
      setError("Agrega un título para generar el slug del proyecto.");
      return;
    }
    if (!form.summary.trim()) {
      setError("Agrega un resumen breve para mostrar en el portafolio.");
      return;
    }
    if (!form.description_html.replace(/<[^>]*>/g, "").trim()) {
      setError("Completa la descripción del proyecto.");
      return;
    }
    if (form.project_url && !/^https?:\/\//i.test(form.project_url)) {
      setError("El enlace del proyecto debe comenzar con https:// o http://.");
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

    const publishedAt = form.is_published
      ? loadedPublishedAt ?? new Date().toISOString()
      : null;
    const record = {
      title: form.title.trim(),
      slug: normalizedSlug,
      category: form.category,
      summary: form.summary.trim(),
      description_html: form.description_html,
      client_name: form.client_name.trim() || null,
      project_url: form.project_url.trim() || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      priority: Number.parseInt(form.priority, 10) || 0,
      published_at: form.is_published ? publishedAt : null,
    };

    let targetId = activeId;
    if (targetId) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(record)
        .eq("id", targetId);
      if (updateError) {
        setError(`No se pudo guardar el proyecto: ${updateError.message}`);
        setLoading(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert(record)
        .select("id")
        .single();
      if (insertError || !data) {
        setError(`No se pudo crear el proyecto: ${insertError?.message ?? "Respuesta vacía de Supabase."}`);
        setLoading(false);
        return;
      }
      targetId = data.id;
      setActiveId(data.id);
      setLoadedPublishedAt(publishedAt);
    }

    const uploadedPaths: string[] = [];
    const finalRows: {
      id?: string;
      project_id: string;
      storage_path: string;
      alt_text: string;
      sort_order: number;
      is_cover: boolean;
    }[] = [];

    for (const [index, image] of images.entries()) {
      let storagePath = image.storagePath;
      if (image.file) {
        const extension = image.file.type === "image/png" ? "png" : image.file.type === "image/webp" ? "webp" : "jpg";
        storagePath = `${userData.user.id}/${targetId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(storagePath, image.file, { contentType: image.file.type, upsert: false });
        if (uploadError) {
          if (uploadedPaths.length) await supabase.storage.from("portfolio-images").remove(uploadedPaths);
          setError(`No se pudo subir la imagen "${image.file.name}": ${uploadError.message}`);
          setLoading(false);
          return;
        }
        uploadedPaths.push(storagePath);
      }
      if (!storagePath) {
        setError("Una imagen no tiene un archivo válido. Elimina esa imagen y vuelve a agregarla.");
        setLoading(false);
        return;
      }
      finalRows.push({
        ...(image.id ? { id: image.id } : {}),
        project_id: targetId,
        storage_path: storagePath,
        alt_text: image.altText.trim() || form.title.trim(),
        sort_order: index,
        is_cover: image.isCover || (index === 0 && !images.some((item) => item.isCover)),
      });
    }

    const { error: imageSaveError } = finalRows.length
      ? await supabase.from("project_images").upsert(finalRows)
      : { error: null };
    if (imageSaveError) {
      if (uploadedPaths.length) await supabase.storage.from("portfolio-images").remove(uploadedPaths);
      setError(`No se pudieron guardar las imágenes: ${imageSaveError.message}`);
      setLoading(false);
      return;
    }

    const currentIds = new Set(images.flatMap((image) => image.id ? [image.id] : []));
    const removedImages = initialImages.filter((image) => !currentIds.has(image.id));
    if (removedImages.length) {
      const { error: removeError } = await supabase
        .from("project_images")
        .delete()
        .in("id", removedImages.map((image) => image.id));
      if (removeError) {
        setError(`El proyecto se guardó, pero no se pudieron quitar algunas imágenes: ${removeError.message}`);
        setLoading(false);
        return;
      }
    }

    const obsoletePaths = new Set(removedImages.map((image) => image.storage_path));
    for (const image of images) {
      if (!image.id || !image.file) continue;
      const previous = initialImages.find((item) => item.id === image.id);
      if (previous?.storage_path && previous.storage_path !== finalRows.find((row) => row.id === image.id)?.storage_path) {
        obsoletePaths.add(previous.storage_path);
      }
    }
    if (obsoletePaths.size) {
      const { error: storageError } = await supabase.storage.from("portfolio-images").remove([...obsoletePaths]);
      if (storageError) {
        setError(`Los cambios se guardaron, pero algunas imágenes antiguas no se pudieron eliminar: ${storageError.message}`);
        setLoading(false);
        return;
      }
    }

    const { data: savedImages, error: reloadImagesError } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", targetId)
      .order("sort_order", { ascending: true });
    if (reloadImagesError) {
      setError(`El proyecto se guardó, pero no se pudo actualizar la galería: ${reloadImagesError.message}`);
      setLoading(false);
      return;
    }

    const refreshedImages = await Promise.all((savedImages ?? []).map(async (image) => {
      const { data: signed, error: signedError } = await supabase.storage
        .from("portfolio-images")
        .createSignedUrl(image.storage_path, 3600);
      if (signedError) {
        setError(`El proyecto se guardó, pero no se pudo generar la vista previa de una imagen: ${signedError.message}`);
        return null;
      }
      return {
        key: image.id,
        id: image.id,
        storagePath: image.storage_path,
        previewUrl: signed.signedUrl,
        altText: image.alt_text,
        isCover: image.is_cover,
      };
    }));
    if (refreshedImages.some((image) => image === null)) {
      setLoading(false);
      return;
    }

    setInitialImages(savedImages ?? []);
    setImages(refreshedImages.filter((image): image is NonNullable<typeof image> => image !== null));
    setLoading(false);
    setNotice("Proyecto guardado correctamente.");
    router.replace(`/admin/proyectos/${targetId}/editar`);
    router.refresh();
  }

  if (!loaded) {
    if (projectId && !supabase) {
      return <div className="admin-alert" role="alert">Configura las variables públicas de Supabase para gestionar proyectos.</div>;
    }
    return <div className="admin-empty"><LoaderCircle className="spin" size={24} /><span>Cargando proyecto…</span></div>;
  }

  const previewText = form.description_html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const cover = images.find((image) => image.isCover) ?? images[0];

  return (
    <div className="project-editor-page">
      <div className="admin-page-heading editor-heading">
        <div>
          <Link className="admin-back-link" href="/admin"><ArrowLeft size={16} /> Volver a proyectos</Link>
          <span className="admin-eyebrow">CONTENIDO DEL PORTAFOLIO</span>
          <h1>{projectId ? "Editar proyecto" : "Nuevo proyecto"}</h1>
          <p>{projectId ? "Actualiza el contenido, las imágenes y la publicación." : "Completa la información para sumar un proyecto al portafolio."}</p>
        </div>
        <div className="editor-top-actions">
          {activeId && <button type="button" className="admin-secondary-button" onClick={() => setPreviewOpen(true)}><Eye size={17} /> Vista previa</button>}
          <button type="submit" form="project-form" className="admin-primary-button" disabled={loading}><Save size={17} /> {loading ? "Guardando…" : "Guardar proyecto"}</button>
        </div>
      </div>

      {error && <div className="admin-alert" role="alert">{error}</div>}
      {notice && <div className="admin-success" role="status"><Check size={17} />{notice}</div>}

      <form id="project-form" className="project-editor-grid" onSubmit={(event) => void saveProject(event)}>
        <div className="editor-main-column">
          <section className="editor-card">
            <div className="editor-card-heading"><span>01</span><div><h2>Información del proyecto</h2><p>Los campos con * son obligatorios.</p></div></div>
            <div className="editor-fields">
              <label className="field-full">Nombre del proyecto *<input required maxLength={120} value={form.title} onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({ ...current, title, ...(slugTouched ? {} : { slug: toSlug(title) }) }));
              }} placeholder="Ej. Sitio web de RoofFix" /></label>
              <label>Slug público *<div className="slug-input"><span>/portafolio/</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugTouched(true); updateField("slug", toSlug(event.target.value)); }} placeholder="sitio-web-rooffix" /></div><small>Solo letras minúsculas, números y guiones.</small></label>
              <label>Categoría *<select value={form.category} onChange={(event) => updateField("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="field-full">Resumen *<textarea required maxLength={240} rows={3} value={form.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Describe brevemente el objetivo y el resultado del proyecto." /><small>{form.summary.length}/240 caracteres</small></label>
              <label>Cliente<input maxLength={120} value={form.client_name} onChange={(event) => updateField("client_name", event.target.value)} placeholder="Nombre del cliente" /></label>
              <label>Enlace del proyecto<input type="url" value={form.project_url} onChange={(event) => updateField("project_url", event.target.value)} placeholder="https://ejemplo.cl" /></label>
              <label className="field-full">Descripción del proyecto *<RichTextEditor initialContent={form.description_html} onChange={(html) => updateField("description_html", html)} /></label>
            </div>
          </section>

          <section className="editor-card">
            <div className="editor-card-heading"><span>02</span><div><h2>Galería de imágenes</h2><p>JPG, PNG o WebP. Máximo 8 MB por archivo.</p></div></div>
            <div className="image-upload-area">
              <input id="project-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseImages} />
              <label htmlFor="project-images"><ImagePlus size={22} /><strong>Agregar imágenes</strong><span>Selecciona uno o varios archivos</span><span className="upload-cta"><Upload size={15} /> Seleccionar archivos</span></label>
            </div>
            {images.length > 0 && <div className="image-order-note">Arrastra la prioridad con las flechas. La primera imagen se usa como principal si no eliges otra.</div>}
            <div className="editor-image-list">
              {images.map((image, index) => (
                <article className={`editor-image-row ${image.isCover ? "cover-image" : ""}`} key={image.key}>
                  <div className="editor-image-preview"><Image src={image.previewUrl} alt={image.altText || form.title} width={142} height={104} unoptimized /></div>
                  <div className="editor-image-details">
                    <div className="image-row-title"><strong>{image.isCover ? <><Star size={14} fill="currentColor" /> Imagen principal</> : `Imagen ${index + 1}`}</strong>{image.file && <span className="new-image-badge">Nueva</span>}</div>
                    <label className="alt-text-input">Texto alternativo<input value={image.altText} onChange={(event) => setImages((current) => current.map((item) => item.key === image.key ? { ...item, altText: event.target.value } : item))} placeholder="Describe brevemente la imagen" maxLength={160} /></label>
                    <div className="image-row-actions">
                      {!image.isCover && <button type="button" onClick={() => setCover(image.key)}><Star size={14} /> Hacer principal</button>}
                      <label className="replace-image-button"><Upload size={14} /> Reemplazar<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => replaceImage(image.key, event)} /></label>
                      <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Mover arriba"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label="Mover abajo"><ArrowDown size={14} /></button>
                      <button type="button" className="remove-image-button" onClick={() => removeImage(image.key)} aria-label="Eliminar imagen"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </article>
              ))}
              {images.length === 0 && <div className="no-images"><ImagePlus size={21} /><span>Aún no agregas imágenes a este proyecto.</span></div>}
            </div>
          </section>

          <section className="editor-card">
            <div className="editor-card-heading"><span>03</span><div><h2>SEO del proyecto</h2><p>Optimiza cómo aparece esta página en los buscadores.</p></div></div>
            <div className="editor-fields">
              <label className="field-full">Título SEO<input maxLength={70} value={form.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} placeholder={form.title || "Título para los resultados de búsqueda"} /><small>{form.seo_title.length}/70 caracteres · Si lo dejas vacío se usará el nombre del proyecto.</small></label>
              <label className="field-full">Descripción SEO<textarea rows={3} maxLength={170} value={form.seo_description} onChange={(event) => updateField("seo_description", event.target.value)} placeholder="Describe la página en una o dos frases." /><small>{form.seo_description.length}/170 caracteres</small></label>
            </div>
          </section>
        </div>

        <aside className="editor-side-column">
          <section className="editor-card publish-card">
            <div className="editor-card-heading"><span>04</span><div><h2>Publicación</h2><p>Controla la visibilidad del proyecto.</p></div></div>
            <label className="toggle-row"><span><strong>Publicado</strong><small>Visible en el portafolio público</small></span><input type="checkbox" checked={form.is_published} onChange={(event) => {
              const published = event.target.checked;
              updateField("is_published", published);
              setLoadedPublishedAt(published ? loadedPublishedAt ?? new Date().toISOString() : null);
            }} /><i /></label>
            <label className="toggle-row"><span><strong>Destacado</strong><small>Prioriza este proyecto en el sitio</small></span><input type="checkbox" checked={form.is_featured} onChange={(event) => updateField("is_featured", event.target.checked)} /><i /></label>
            <label className="field-full priority-field">Prioridad de orden<input type="number" min={0} step={1} value={form.priority} onChange={(event) => updateField("priority", event.target.value)} /><small>Los números más bajos aparecen primero.</small></label>
            {form.is_published && form.slug && <div className="public-url"><span>Página pública</span><Link href={`/portafolio/${toSlug(form.slug)}`} target="_blank">/portafolio/{toSlug(form.slug)} <Eye size={14} /></Link></div>}
          </section>
          <section className="editor-card preview-card">
            <div className="editor-card-heading"><span>↗</span><div><h2>Vista previa</h2><p>Resumen del contenido que se publicará.</p></div></div>
            <div className="preview-mini">
              {cover ? <Image src={cover.previewUrl} alt={cover.altText || form.title} width={420} height={220} unoptimized /> : <div className="preview-no-image"><ImagePlus size={24} /></div>}
              <div><span>{form.category}</span><strong>{form.title || "Nombre del proyecto"}</strong><p>{form.summary || "El resumen de tu proyecto aparecerá aquí."}</p></div>
            </div>
          </section>
          <div className="editor-save-mobile"><button type="submit" form="project-form" className="admin-primary-button" disabled={loading}><Save size={17} /> {loading ? "Guardando…" : "Guardar proyecto"}</button></div>
        </aside>
      </form>

      {previewOpen && <div className="preview-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false); }}>
        <section className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <button className="preview-close" type="button" onClick={() => setPreviewOpen(false)} aria-label="Cerrar vista previa"><X size={20} /></button>
          <span className="admin-eyebrow">VISTA PREVIA · PORTAFOLIO</span>
          {cover && <Image src={cover.previewUrl} alt={cover.altText || form.title} width={900} height={420} unoptimized className="preview-dialog-image" />}
          <span className="preview-dialog-category">{form.category}</span>
          <h2 id="preview-title">{form.title || "Nombre del proyecto"}</h2>
          <p className="preview-dialog-summary">{form.summary || "El resumen del proyecto aparecerá aquí."}</p>
          {form.client_name && <p className="preview-dialog-client">Cliente · {form.client_name}</p>}
          <div className="preview-dialog-description">{previewText || "La descripción completa del proyecto aparecerá aquí."}</div>
          {form.project_url && <a className="text-link" href={form.project_url} target="_blank" rel="noreferrer">Visitar proyecto <Eye size={15} /></a>}
        </section>
      </div>}
    </div>
  );
}
