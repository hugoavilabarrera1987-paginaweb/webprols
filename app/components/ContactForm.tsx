"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

type FormStatus =
  | { type: "success" | "warning"; message: string }
  | { type: "error"; message: string }
  | null;

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>(null);
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSending(true);

    const form = event.currentTarget;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const description = form.elements.namedItem("description") as HTMLTextAreaElement;
    name.setCustomValidity(name.value.trim() ? "" : "Ingresa tu nombre.");
    description.setCustomValidity(
      description.value.trim().length >= 20
        ? ""
        : "Cuéntanos un poco más sobre tu proyecto (mínimo 20 caracteres).",
    );

    if (!form.reportValidity()) {
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result: { message?: string; delivery?: "partial" } = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: result.message ?? "No pudimos enviar tu solicitud. Inténtalo de nuevo más tarde.",
        });
        return;
      }

      setStatus({
        type: result.delivery === "partial" ? "warning" : "success",
        message:
          result.message ??
          "Te enviamos una copia de tu solicitud. Nos pondremos en contacto contigo a la brevedad.",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message: "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Nombre *<input name="name" required maxLength={120} placeholder="Tu nombre" autoComplete="name" onChange={(event) => event.currentTarget.setCustomValidity("")} /></label>
      <label>Empresa<input name="company" maxLength={160} placeholder="Nombre de tu empresa" autoComplete="organization" /></label>
      <label>Correo electrónico *<input type="email" name="email" required maxLength={254} placeholder="tu@correo.com" autoComplete="email" /></label>
      <label>Teléfono<input type="tel" name="phone" maxLength={50} placeholder="+56 9..." autoComplete="tel" /></label>
      <label className="full">Tipo de proyecto *<select name="project" required defaultValue="">
        <option value="" disabled>Selecciona el tipo de proyecto</option>
        <option>Sitio web profesional</option>
        <option>Sistema web personalizado</option>
        <option>Tienda online</option>
        <option>Landing page</option>
        <option>Rediseño de sitio web</option>
        <option>Integración o automatización</option>
        <option>SEO y optimización</option>
        <option>Mantenimiento web</option>
        <option>Otro</option>
      </select></label>
      <label className="full">Descripción del proyecto *<textarea name="description" required minLength={20} maxLength={5000} placeholder="Cuéntanos tu idea, objetivos y necesidades (mínimo 20 caracteres)" onChange={(event) => event.currentTarget.setCustomValidity("")} /></label>
      <label>Funcionalidades necesarias<input name="features" maxLength={500} placeholder="Reservas, pagos, panel..." /></label>
      <label>Presupuesto aproximado, opcional<input name="budget" maxLength={120} placeholder="Rango orientativo" /></label>
      <label>Plazo estimado, opcional<input name="timeline" maxLength={120} placeholder="Fecha objetivo" /></label>
      <label className="full">
        <button className="btn btn-primary" type="submit" disabled={isSending}>
          {isSending ? "Enviando…" : "Solicitar cotización"} <ArrowRight size={17} />
        </button>
      </label>
      {status && (
        <div
          className={`full contact-feedback contact-feedback--${status.type}`}
          role={status.type === "error" ? "alert" : "status"}
          aria-live={status.type === "error" ? "assertive" : "polite"}
        >
          <span className="contact-feedback-icon" aria-hidden="true">
            {status.type === "success" ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          </span>
          <div className="contact-feedback-copy">
            <strong>
              {status.type === "success"
                ? "¡Solicitud enviada!"
                : status.type === "warning"
                  ? "Solicitud recibida"
                  : "No pudimos enviar tu solicitud"}
            </strong>
            <p>{status.message}</p>
          </div>
        </div>
      )}
    </form>
  );
}
