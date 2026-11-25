import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

type SolutionPage = {
  title: string;
  description: string;
  category: string;
  categoryHref: string;
  categoryLabel: string;
  heading: string;
  overview: string;
  audience: string;
  benefits: { title: string; description: string }[];
};

const solutionPages: Record<string, SolutionPage> = {
  "diseno-ui-ux-branding": {
    title: "Diseño UI/UX & Branding",
    description:
      "Construimos una identidad visual coherente y una experiencia digital clara para que tus clientes entiendan y recuerden tu marca.",
    category: "Servicios",
    categoryHref: "/servicios",
    categoryLabel: "servicios",
    heading: "Diseño que conecta tu marca con las personas ",
    overview:
      "Definimos una presencia visual consistente y organizamos cada pantalla pensando en cómo las personas descubren, entienden y usan tu sitio.",
    audience:
      "Ideal para marcas nuevas o negocios que necesitan modernizar su imagen y hacer más simple la navegación de sus clientes.",
    benefits: [
      { title: "Identidad consistente", description: "Colores, tipografía y componentes alineados con tu marca." },
      { title: "Navegación clara", description: "Contenido y recorridos organizados para encontrar lo importante." },
      { title: "Diseño adaptable", description: "Una experiencia cuidada en computadores, tablets y móviles." },
    ],
  },
  "seo-tecnico-velocidad": {
    title: "SEO Técnico & Velocidad",
    description:
      "Mejoramos la base técnica de tu sitio para facilitar su rastreo, optimizar tiempos de carga y ofrecer una experiencia fluida.",
    category: "Servicios",
    categoryHref: "/servicios",
    categoryLabel: "servicios",
    heading: "Una web rápida y preparada para buscadores",
    overview:
      "Revisamos rendimiento, estructura y elementos técnicos que ayudan a los buscadores a interpretar tus páginas y a las personas a navegar sin fricción.",
    audience:
      "Recomendado para sitios nuevos o existentes que necesitan mejorar su rendimiento y visibilidad orgánica.",
    benefits: [
      { title: "Rendimiento", description: "Revisión de recursos, imágenes y carga de páginas." },
      { title: "SEO técnico", description: "Estructura, metadatos e indexación correctamente organizados." },
      { title: "Seguimiento", description: "Configuración de herramientas para observar el comportamiento del sitio." },
    ],
  },
  "hosting-cloud-soporte": {
    title: "Hosting Cloud & Soporte",
    description:
      "Publicamos tu solución en un entorno cloud adecuado y te ayudamos a mantenerla actualizada y disponible.",
    category: "Servicios",
    categoryHref: "/servicios",
    categoryLabel: "servicios",
    heading: "Alojamiento y acompañamiento para tu proyecto",
    overview:
      "Te orientamos en la configuración del despliegue, dominio y certificados, además de tareas de mantenimiento y revisión según las necesidades del proyecto.",
    audience:
      "Para empresas que buscan apoyo técnico al publicar su sitio o que necesitan continuidad después del lanzamiento.",
    benefits: [
      { title: "Puesta en marcha", description: "Configuración del entorno y publicación del proyecto." },
      { title: "Mantenimiento", description: "Actualizaciones y revisiones técnicas planificadas." },
      { title: "Acompañamiento", description: "Soporte para resolver dudas y priorizar mejoras." },
    ],
  },
  "landing-pages-express": {
    title: "Landing Pages Express",
    description:
      "Creamos páginas enfocadas en una oferta o campaña, con un mensaje directo y llamados a la acción visibles.",
    category: "Sitios web",
    categoryHref: "/sitios-web",
    categoryLabel: "sitios web",
    heading: "Una página enfocada en convertir visitas en consultas",
    overview:
      "Organizamos la propuesta de valor, beneficios y prueba social en un recorrido corto que facilita a tus visitantes dar el siguiente paso.",
    audience:
      "Útil para campañas, lanzamiento de productos, captación de prospectos y promoción de servicios específicos.",
    benefits: [
      { title: "Mensaje enfocado", description: "Una oferta clara y contenido organizado por prioridad." },
      { title: "Acción visible", description: "Formularios o enlaces de contacto ubicados en momentos clave." },
      { title: "Lista para campañas", description: "Diseño adaptable y estructura preparada para medir resultados." },
    ],
  },
  "sitios-web-corporativos": {
    title: "Sitios Web Corporativos",
    description:
      "Presentamos tu empresa con una web profesional que explica tus servicios, fortalece tu marca y facilita el contacto.",
    category: "Sitios web",
    categoryHref: "/sitios-web",
    categoryLabel: "sitios web",
    heading: "Una presencia digital que representa a tu empresa",
    overview:
      "Diseñamos la arquitectura de páginas y contenidos para mostrar quién eres, qué soluciones entregas y cómo pueden contactarte tus clientes.",
    audience:
      "Pensado para empresas que necesitan una presencia institucional clara y escalable, en lugar de depender solo de redes sociales.",
    benefits: [
      { title: "Páginas a medida", description: "Secciones organizadas para empresa, servicios y contacto." },
      { title: "Imagen profesional", description: "Diseño coherente con la identidad y objetivos del negocio." },
      { title: "Fácil de ampliar", description: "Una base preparada para incorporar nuevas páginas y funciones." },
    ],
  },
  "tiendas-online-ecommerce": {
    title: "Tiendas Online E-Commerce",
    description:
      "Creamos una experiencia de compra online para mostrar tus productos, recibir pedidos y administrar tu catálogo.",
    category: "Sitios web",
    categoryHref: "/servicios",
    categoryLabel: "servicios",
    heading: "Vende tus productos desde una tienda propia",
    overview:
      "Organizamos el catálogo, las fichas de producto y el proceso de compra para que tus clientes puedan encontrar lo que buscan y completar sus pedidos.",
    audience:
      "Para negocios que quieren comenzar a vender online o mejorar la experiencia de una tienda existente.",
    benefits: [
      { title: "Catálogo organizado", description: "Categorías y fichas de producto claras para tus clientes." },
      { title: "Proceso de compra", description: "Carrito y pasos de pedido simples y adaptables." },
      { title: "Gestión centralizada", description: "Herramientas para administrar productos y pedidos." },
    ],
  },
  "erp-crm-medida": {
    title: "Sistemas ERP / CRM a Medida",
    description:
      "Centralizamos información y procesos internos en un sistema adaptado a la forma de trabajar de tu empresa.",
    category: "Sistemas web",
    categoryHref: "/sistemas-web",
    categoryLabel: "sistemas web",
    heading: "Controla tus procesos en una plataforma propia",
    overview:
      "Definimos módulos y permisos según tus flujos de trabajo para gestionar clientes, operaciones, equipos e información desde un solo lugar.",
    audience:
      "Adecuado para empresas que usan planillas o herramientas desconectadas y necesitan ordenar su operación.",
    benefits: [
      { title: "Procesos conectados", description: "Módulos pensados para tus tareas y responsabilidades." },
      { title: "Acceso por roles", description: "Vistas y permisos ajustados a los perfiles de usuario." },
      { title: "Información útil", description: "Paneles y reportes para revisar el estado de la operación." },
    ],
  },
  "reservas-citas": {
    title: "Plataformas de Reservas & Citas",
    description:
      "Facilitamos la reserva de horas o servicios con disponibilidad visible y un flujo de solicitud claro.",
    category: "Sistemas web",
    categoryHref: "/sistemas-web",
    categoryLabel: "sistemas web",
    heading: "Haz más simple la coordinación de tus reservas",
    overview:
      "Creamos una plataforma donde tus clientes puedan consultar horarios y solicitar una reserva, mientras tu equipo administra la agenda.",
    audience:
      "Para centros de atención, profesionales y negocios que coordinan citas, servicios o recursos.",
    benefits: [
      { title: "Disponibilidad visible", description: "Horarios y servicios presentados de forma sencilla." },
      { title: "Gestión de agenda", description: "Herramientas para revisar y organizar solicitudes." },
      { title: "Menos coordinación manual", description: "Un flujo digital claro para clientes y equipo." },
    ],
  },
  "integraciones-api-pasarelas": {
    title: "Integraciones API & Pasarelas",
    description:
      "Conectamos tu sitio o sistema con servicios externos para intercambiar información y reducir tareas repetitivas.",
    category: "Sistemas web",
    categoryHref: "/sistemas-web",
    categoryLabel: "sistemas web",
    heading: "Conecta las herramientas que usa tu negocio",
    overview:
      "Analizamos qué datos deben circular entre tus plataformas y definimos una integración clara, segura y adecuada a tus procesos.",
    audience:
      "Para empresas que necesitan conectar pagos, formularios, inventario, CRM u otros servicios con su plataforma.",
    benefits: [
      { title: "Flujos conectados", description: "Intercambio de información entre plataformas compatibles." },
      { title: "Pagos integrados", description: "Conexión con pasarelas de pago según los requisitos del proyecto." },
      { title: "Menos tareas manuales", description: "Automatización de pasos repetitivos donde sea posible." },
    ],
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(solutionPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = solutionPages[slug];
  if (!page) return { title: "Solución web | Web Pro LS" };
  return {
    title: `${page.title} | Web Pro LS`,
    description: page.description,
  };
}

export default function SolutionDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<SolutionFallback />}>
      <ResolvedSolutionPage params={params} />
    </Suspense>
  );
}

async function ResolvedSolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const page = solutionPages[slug];
  if (!page) notFound();

  return (
    <main className="inner-page">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link> /{" "}
            <Link href={page.categoryHref}>{page.category}</Link> / {page.title}
          </div>
          <span className="section-kicker">{page.category}</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions" style={{ marginTop: 28 }}>
            <Link href="/contacto" className="btn btn-primary">
              Solicitar cotización <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href={page.categoryHref} className="btn btn-ghost">
              Explorar {page.categoryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div>
            <span className="section-kicker">La solución</span>
            <h2>{page.heading}</h2>
          </div>
          <div className="split-copy">
            <p>{page.overview}</p>
            <p>{page.audience}</p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Qué incluye</span>
            <h2>Una solución enfocada en tus necesidades</h2>
          </div>
          <div className="page-grid">
            {page.benefits.map((benefit) => (
              <article className="page-card" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="page-card">
            <span className="section-kicker">Siguiente paso</span>
            <h2>¿Quieres revisar esta solución para tu negocio?</h2>
            <p>
              Cuéntanos qué necesitas y te ayudaremos a definir el alcance y las
              siguientes etapas del proyecto.
            </p>
            <div className="hero-actions">
              <Link href="/contacto" className="text-link">
                Hablemos de tu proyecto <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={page.categoryHref} className="text-link">
                Volver a {page.categoryLabel} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SolutionFallback() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <div className="container" aria-busy="true">
          <div className="breadcrumbs">Web Pro LS / Soluciones</div>
          <h1>Preparando la información</h1>
          <p>Estamos cargando los detalles de esta solución.</p>
        </div>
      </section>
    </main>
  );
}
