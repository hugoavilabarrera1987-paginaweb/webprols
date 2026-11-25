"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

const publicAdminPages = [
  "/admin/login",
  "/admin/recuperar-contrasena",
  "/admin/cambiar-contrasena",
];

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="admin-state-screen"><LoaderCircle className="spin" size={28} /><p>Cargando administración…</p></main>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "config">(
    () => isSupabaseConfigured() ? "loading" : "config",
  );
  const isPublicPage = publicAdminPages.includes(pathname);

  useEffect(() => {
    if (isPublicPage) return;
    if (!isSupabaseConfigured() || !supabase) return;

    let active = true;

    async function verifyAdmin() {
      const { data: userData, error: userError } = await supabase!.auth.getUser();
      if (!active) return;
      if (userError || !userData.user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase!
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setStatus("denied");
        return;
      }
      if (!data) {
        await supabase!.auth.signOut();
        setStatus("denied");
        return;
      }
      setStatus("ready");
    }

    void verifyAdmin();
    return () => {
      active = false;
    };
  }, [isPublicPage, pathname, router, supabase]);

  if (isPublicPage) return <>{children}</>;

  if (status === "loading") {
    return (
      <main className="admin-state-screen">
        <LoaderCircle className="spin" size={28} />
        <p>Verificando acceso seguro…</p>
      </main>
    );
  }

  if (status === "config") {
    return (
      <main className="admin-state-screen">
        <ShieldAlert size={32} />
        <h1>Configuración pendiente</h1>
        <p>Configura las variables públicas de Supabase para habilitar el panel.</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="admin-state-screen">
        <ShieldAlert size={32} />
        <h1>Acceso restringido</h1>
        <p>Esta cuenta no está autorizada para administrar el portafolio.</p>
        <Link className="btn btn-primary" href="/admin/login">Volver al inicio de sesión</Link>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="brand-mark">
            <Image
              src="/icons/brand-symbol.png"
              alt=""
              aria-hidden="true"
              width={249}
              height={249}
              unoptimized
            />
          </span>
          <span>WEB <strong>PRO LS</strong><small>ADMINISTRACIÓN</small></span>
        </Link>
        <span className="admin-nav-label">GESTIÓN</span>
        <nav className="admin-nav" aria-label="Administración">
          <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
            <LayoutDashboard size={18} /> Resumen
          </Link>
          <Link href="/admin" className={pathname.startsWith("/admin/proyectos") ? "active" : ""}>
            <FolderKanban size={18} /> Proyectos
          </Link>
          <div className="admin-nav-group">
            <Link href="/admin/blog" className={pathname.startsWith("/admin/blog") ? "active" : ""}>
              <BookOpen size={18} /> Blog
            </Link>
            {pathname.startsWith("/admin/blog") && (
              <div className="admin-subnav" aria-label="Gestión del blog">
                <Link href="/admin/blog" className={pathname === "/admin/blog" ? "active" : ""}>Artículos</Link>
                <Link href="/admin/blog/nuevo" className={pathname === "/admin/blog/nuevo" ? "active" : ""}>Nuevo artículo</Link>
              </div>
            )}
          </div>
          <Link href="/portafolio" target="_blank">
            <ArrowUpRight size={18} /> Sitio público
          </Link>
        </nav>
        <button
          className="admin-signout"
          onClick={async () => {
            const { error } = await supabase!.auth.signOut();
            if (error) {
              window.alert(`No se pudo cerrar la sesión: ${error.message}`);
              return;
            }
            router.replace("/admin/login");
          }}
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>Web Pro LS <span aria-hidden="true">/</span> Administración</span>
          <span className="admin-secure"><span /> Panel seguro</span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
