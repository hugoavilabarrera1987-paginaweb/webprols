"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Brand } from "@/app/components/SiteChrome";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

type FormKind = "login" | "recovery" | "update";

function AuthCard({
  kind,
  title,
  description,
  children,
}: {
  kind: FormKind;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className="auth-grid" aria-hidden="true" />
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />
      <section className="auth-card">
        <Brand />
        <div className="auth-heading">
          <span className="auth-icon"><ShieldCheck size={23} /></span>
          <span className="auth-overline">ÁREA PRIVADA · WEB PRO LS</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
        <Link className="auth-back" href={kind === "login" ? "/" : "/admin/login"}>
          <ArrowLeft size={15} /> {kind === "login" ? "Volver al sitio" : "Volver al inicio de sesión"}
        </Link>
        <span className="auth-privacy"><LockKeyhole size={13} /> Conexión protegida por Supabase Auth</span>
      </section>
      <div className="auth-caption">GESTIÓN SEGURA DEL PORTAFOLIO</div>
    </main>
  );
}

export function LoginForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured() || !supabase) {
      setError("Falta configurar Supabase. Revisa las variables de entorno del servidor.");
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) {
        setError("No pudimos iniciar sesión. Revisa tu correo y contraseña.");
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const safePath = requestedPath === "/admin" || requestedPath?.startsWith("/admin/")
        ? requestedPath
        : "/admin";
      router.replace(safePath);
    } catch {
      setError("No se pudo conectar con el servicio de autenticación. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard kind="login" title="Bienvenido de nuevo" description="Inicia sesión para administrar los proyectos de tu portafolio.">
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="admin-email">Correo electrónico</label>
        <div className="auth-input-wrap"><Mail size={18} /><input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@webprols.com" /></div>
        <div className="auth-label-row"><label htmlFor="admin-password">Contraseña</label><Link href="/admin/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></div>
        <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ingresa tu contraseña" /><button type="button" className="auth-reveal" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Verificando…</> : <>Iniciar sesión <ArrowRight size={17} /></>}</button>
      </form>
    </AuthCard>
  );
}

export function RecoveryForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!isSupabaseConfigured() || !supabase) {
      setError("Falta configurar Supabase. Revisa las variables de entorno del servidor.");
      return;
    }
    setLoading(true);
    try {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/cambiar-contrasena`,
      });
      if (recoveryError) {
        setError("No pudimos enviar el correo. Verifica la configuración de recuperación en Supabase.");
        return;
      }
      setMessage("Si el correo está registrado, recibirás un enlace para cambiar tu contraseña.");
    } catch {
      setError("No se pudo conectar con el servicio de autenticación. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard kind="recovery" title="Recupera tu acceso" description="Te enviaremos un enlace seguro para restablecer tu contraseña.">
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="recovery-email">Correo electrónico</label>
        <div className="auth-input-wrap"><Mail size={18} /><input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@webprols.com" /></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Enviando…</> : <>Enviar enlace <ArrowRight size={17} /></>}</button>
      </form>
    </AuthCard>
  );
}

export function PasswordUpdateForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured() || !supabase) {
      setError("Falta configurar Supabase. Revisa las variables de entorno del servidor.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("El enlace expiró o ya no es válido. Solicita uno nuevo.");
        return;
      }
      router.replace("/admin");
    } catch {
      setError("No se pudo conectar con el servicio de autenticación. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard kind="update" title="Crea una nueva contraseña" description="Elige una contraseña segura para proteger tu panel.">
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="new-password">Nueva contraseña</label>
        <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" /></div>
        <label htmlFor="confirm-password">Confirma la contraseña</label>
        <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite tu contraseña" /></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Guardando…</> : <>Cambiar contraseña <ArrowRight size={17} /></>}</button>
      </form>
    </AuthCard>
  );
}
