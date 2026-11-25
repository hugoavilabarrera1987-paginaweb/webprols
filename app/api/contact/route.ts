import nodemailer from "nodemailer";

const recipient = "contacto@webprols.com";
const fieldLimits = {
  name: 120,
  company: 160,
  email: 254,
  phone: 50,
  project: 120,
  description: 5000,
  features: 500,
  budget: 120,
  timeline: 120,
} as const;

const projectTypes = [
  "Sitio web profesional",
  "Sistema web personalizado",
  "Tienda online",
  "Landing page",
  "Rediseño de sitio web",
  "Integración o automatización",
  "SEO y optimización",
  "Mantenimiento web",
  "Otro",
] as const;

type ContactField = keyof typeof fieldLimits;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readField(value: unknown, maxLength: number): string | null {
  if (value === undefined) return "";
  if (typeof value !== "string" || value.length > maxLength) return null;
  return value.trim();
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "La solicitud no tiene un formato válido." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return Response.json({ message: "La solicitud no tiene un formato válido." }, { status: 400 });
  }

  const fields = {} as Record<ContactField, string>;
  for (const field of Object.keys(fieldLimits) as ContactField[]) {
    const value = readField(payload[field], fieldLimits[field]);
    if (value === null) {
      return Response.json({ message: "Revisa los datos ingresados e inténtalo nuevamente." }, { status: 400 });
    }
    fields[field] = value;
  }

  if (!fields.name || !fields.email || !fields.project || !fields.description) {
    return Response.json({ message: "Completa tu nombre, correo, tipo de proyecto y descripción." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)) {
    return Response.json({ message: "Ingresa un correo electrónico válido." }, { status: 400 });
  }

  if (fields.description.length < 20) {
    return Response.json({ message: "Describe tu proyecto con al menos 20 caracteres." }, { status: 400 });
  }

  if (!(projectTypes as readonly string[]).includes(fields.project)) {
    return Response.json({ message: "Selecciona un tipo de proyecto válido." }, { status: 400 });
  }

  if (
    fields.phone &&
    (!/^\+?[\d\s().-]{7,20}$/.test(fields.phone) ||
      fields.phone.replace(/\D/g, "").length < 7 ||
      fields.phone.replace(/\D/g, "").length > 15)
  ) {
    return Response.json({ message: "Ingresa un teléfono válido o deja el campo vacío." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password) {
    console.error("Contact form SMTP configuration is incomplete or invalid.");
    return Response.json({ message: "El formulario no está disponible en este momento. Inténtalo más tarde." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const message = [
    "Nueva solicitud de cotización desde el formulario de Web Pro LS",
    "",
    `Nombre: ${fields.name}`,
    `Empresa: ${fields.company || "No informada"}`,
    `Correo: ${fields.email}`,
    `Teléfono: ${fields.phone || "No informado"}`,
    `Tipo de proyecto: ${fields.project || "No informado"}`,
    `Descripción: ${fields.description || "No informada"}`,
    `Funcionalidades: ${fields.features || "No informadas"}`,
    `Presupuesto: ${fields.budget || "No informado"}`,
    `Plazo: ${fields.timeline || "No informado"}`,
  ].join("\n");

  const details = [
    ["Nombre", fields.name],
    ["Empresa", fields.company || "No informada"],
    ["Correo electrónico", fields.email],
    ["Teléfono", fields.phone || "No informado"],
    ["Tipo de proyecto", fields.project],
    ["Descripción", fields.description],
    ["Funcionalidades", fields.features || "No informadas"],
    ["Presupuesto", fields.budget || "No informado"],
    ["Plazo", fields.timeline || "No informado"],
  ] as const;

  const confirmationText = [
    `Hola ${fields.name},`,
    "",
    "Recibimos tu solicitud de cotización. Nos pondremos en contacto contigo a la brevedad.",
    "",
    "Copia de los datos enviados:",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    "Web Pro LS",
    "contacto@webprols.com",
    "WhatsApp: +56 9 7971 7705",
  ].join("\n");

  const detailRows = details
    .map(
      ([label, value]) => `<tr>
        <td style="padding:11px 14px;border-bottom:1px solid #e8edf4;color:#667085;font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #e8edf4;color:#172a43;font-size:13px;line-height:1.6;vertical-align:top;">${escapeHtml(value).replace(/\r?\n/g, "<br>")}</td>
      </tr>`,
    )
    .join("");

  const confirmationHtml = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f2f5fa;font-family:Arial,Helvetica,sans-serif;color:#172a43;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f2f5fa;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-radius:14px;overflow:hidden;background:#ffffff;">
            <tr><td height="4" style="height:4px;background:#48b9d1;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:27px 32px;background:#07182f;">
                <div style="font-size:20px;font-weight:800;letter-spacing:1.5px;color:#ffffff;">WEB <span style="color:#67c6df;">PRO LS</span></div>
                <div style="margin-top:7px;color:#a9bdd4;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">Diseño y desarrollo web a medida</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 30px;">
                <div style="display:inline-block;padding:7px 10px;border-radius:20px;background:#edf7fb;color:#1871a3;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Solicitud recibida</div>
                <h1 style="margin:18px 0 10px;color:#10243f;font-size:28px;line-height:1.25;">¡Gracias, ${escapeHtml(fields.name)}!</h1>
                <p style="margin:0;color:#58677b;font-size:15px;line-height:1.7;">Recibimos tu solicitud de cotización. Nos pondremos en contacto contigo a la brevedad.</p>
                <h2 style="margin:29px 0 12px;color:#10243f;font-size:15px;">Copia de tu solicitud</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #e8edf4;border-radius:9px;border-collapse:separate;border-spacing:0;">
                  ${detailRows}
                </table>
                <p style="margin:25px 0 0;color:#667085;font-size:13px;line-height:1.7;">Si necesitas agregar información, responde a este correo o escríbenos por WhatsApp.</p>
                <p style="margin:17px 0 0;">
                  <a href="https://wa.me/56979717705" style="display:inline-block;padding:12px 18px;border-radius:7px;background:#1265df;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;">Contactar por WhatsApp</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:21px 32px;background:#f7f9fc;border-top:1px solid #e8edf4;color:#718096;font-size:11px;line-height:1.7;">
                <strong style="color:#34445a;">Web Pro LS</strong><br>
                contacto@webprols.com · Quinta Normal, Santiago, Chile<br>
                Diseño y desarrollo de soluciones digitales a medida.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Web Pro LS" <${user}>`,
      to: recipient,
      replyTo: fields.email,
      subject: "Nueva solicitud de cotización desde Web Pro LS",
      text: message,
    });
  } catch (error) {
    console.error(
      "Contact form email delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
    return Response.json({ message: "No pudimos enviar tu solicitud. Inténtalo de nuevo más tarde." }, { status: 502 });
  }

  try {
    await transporter.sendMail({
      from: `"Web Pro LS" <${user}>`,
      to: fields.email,
      replyTo: recipient,
      subject: "Recibimos tu solicitud | Web Pro LS",
      text: confirmationText,
      html: confirmationHtml,
    });
  } catch (error) {
    console.error(
      "Contact form customer confirmation email failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
    return Response.json({
      delivery: "partial",
      message: "Recibimos tu solicitud, pero no pudimos enviar la copia a tu correo. Nos pondremos en contacto contigo a la brevedad.",
    });
  }

  return Response.json({
    message: "Te enviamos una copia de tu solicitud. Nos pondremos en contacto contigo a la brevedad.",
  });
}
