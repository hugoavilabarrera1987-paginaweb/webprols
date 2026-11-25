import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Code2,
  Database,
  Gauge,
  LayoutDashboard,
  Layers3,
  MessageCircle,
  Plug,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import styles from "./SolutionLandingPage.module.css";

type PageType = "web" | "systems";

type SolutionCard = {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
};

type Feature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

type PageContent = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  cards: SolutionCard[];
  featuresEyebrow: string;
  featuresTitle: string;
  features: Feature[];
  visualTitle: string;
  visualSubtitle: string;
};

const pageContent: Record<PageType, PageContent> = {
  web: {
    breadcrumb: "Sitios web",
    eyebrow: "Diseño y desarrollo web",
    title: "Una web que representa el valor de tu negocio",
    description:
      "Creamos sitios profesionales, adaptables y fáciles de explorar para presentar tus servicios y facilitar el contacto con tus clientes.",
    primaryAction: "Cuéntanos tu idea",
    sectionEyebrow: "Soluciones web",
    sectionTitle: "El formato indicado para cada objetivo",
    sectionDescription:
      "Desde una presencia corporativa hasta una tienda online, elige el tipo de proyecto que mejor se ajusta a lo que necesitas.",
    cards: [
      {
        title: "Sitios corporativos",
        description:
          "Presenta tu empresa, servicios y propuesta de valor con una estructura clara y una imagen profesional.",
        href: "/soluciones/sitios-web-corporativos",
        Icon: LayoutDashboard,
      },
      {
        title: "Landing pages",
        description:
          "Enfoca la atención en una campaña, producto o servicio con un recorrido directo hacia la consulta.",
        href: "/soluciones/landing-pages-express",
        Icon: MessageCircle,
      },
      {
        title: "Tiendas online",
        description:
          "Organiza tu catálogo y ofrece a tus clientes una forma sencilla de conocer tus productos y comprar.",
        href: "/soluciones/tiendas-online-ecommerce",
        Icon: ShoppingBag,
      },
      {
        title: "Rediseño web",
        description:
          "Actualiza el diseño, contenido y navegación de tu sitio para que siga el ritmo de tu negocio.",
        href: "/contacto",
        Icon: Layers3,
      },
    ],
    featuresEyebrow: "Una base completa",
    featuresTitle: "Cada detalle pensado para tus visitantes",
    features: [
      {
        title: "Adaptable a móviles",
        description: "Navegación y contenido preparados para distintos tamaños de pantalla.",
        Icon: Smartphone,
      },
      {
        title: "Navegación intuitiva",
        description: "Secciones organizadas para que tus clientes encuentren lo importante.",
        Icon: Users,
      },
      {
        title: "SEO técnico",
        description: "Estructura y metadatos claros para facilitar la indexación del sitio.",
        Icon: Search,
      },
      {
        title: "Integraciones útiles",
        description: "Formularios, WhatsApp y herramientas conectadas según tu proyecto.",
        Icon: Plug,
      },
    ],
    visualTitle: "Tu marca, en línea",
    visualSubtitle: "Una experiencia clara en cada pantalla",
  },
  systems: {
    breadcrumb: "Sistemas web",
    eyebrow: "Software a medida",
    title: "Un sistema web alineado con tu manera de trabajar",
    description:
      "Diseñamos plataformas para organizar información, automatizar tareas y acompañar los procesos reales de tu empresa.",
    primaryAction: "Conversemos sobre tu sistema",
    sectionEyebrow: "Soluciones para tu operación",
    sectionTitle: "Herramientas que conectan tus procesos",
    sectionDescription:
      "Selecciona un área para conocer algunas de las funcionalidades que podemos adaptar a las necesidades de tu equipo.",
    cards: [
      {
        title: "ERP y CRM a medida",
        description:
          "Centraliza la gestión de clientes, ventas y tareas internas en una plataforma creada para tu operación.",
        href: "/soluciones/erp-crm-medida",
        Icon: LayoutDashboard,
      },
      {
        title: "Reservas y citas",
        description:
          "Facilita la coordinación de horas, servicios y disponibilidad para tu equipo y tus clientes.",
        href: "/soluciones/reservas-citas",
        Icon: CalendarDays,
      },
      {
        title: "Integraciones y pagos",
        description:
          "Conecta APIs, pasarelas de pago y herramientas externas para que los sistemas compartan información.",
        href: "/soluciones/integraciones-api-pasarelas",
        Icon: Plug,
      },
      {
        title: "Paneles personalizados",
        description:
          "Visualiza registros y reportes con vistas organizadas de acuerdo con las necesidades de cada usuario.",
        href: "/contacto",
        Icon: BarChart3,
      },
    ],
    featuresEyebrow: "Funcionalidades a medida",
    featuresTitle: "Diseñado para tus datos y tus procesos",
    features: [
      {
        title: "Gestión centralizada",
        description: "Administra clientes, productos, servicios y registros desde un solo lugar.",
        Icon: Database,
      },
      {
        title: "Roles y permisos",
        description: "Define accesos según las responsabilidades de cada integrante del equipo.",
        Icon: ShieldCheck,
      },
      {
        title: "Automatización",
        description: "Reduce tareas repetitivas mediante flujos y acciones conectadas.",
        Icon: Workflow,
      },
      {
        title: "Evolución planificada",
        description: "Agrega nuevas funciones a medida que cambian las necesidades del negocio.",
        Icon: Code2,
      },
    ],
    visualTitle: "Panel de gestión",
    visualSubtitle: "Información organizada para tu equipo",
  },
};

const processSteps = [
  {
    number: "01",
    title: "Entendemos tu objetivo",
    description: "Revisamos tus necesidades, prioridades y la forma en que trabaja tu negocio.",
  },
  {
    number: "02",
    title: "Diseñamos la solución",
    description: "Definimos la estructura y las funciones que formarán parte del proyecto.",
  },
  {
    number: "03",
    title: "Desarrollamos y validamos",
    description: "Construimos, revisamos contigo y preparamos la puesta en marcha.",
  },
];

function ProductPreview({ type, content }: { type: PageType; content: PageContent }) {
  if (type === "web") {
    return (
      <div className={styles.browserWindow}>
        <div className={styles.browserTop}>
          <span className={styles.windowDots}><i /><i /><i /></span>
          <span>webprols.com</span>
          <span className={styles.windowMenu}>•••</span>
        </div>
        <div className={styles.siteNavigation}>
          <strong>tu marca</strong>
          <span>Inicio</span><span>Servicios</span><span>Contacto</span>
        </div>
        <div className={styles.sitePreview}>
          <div className={styles.previewCopy}>
            <span>BIENVENIDO A TU SITIO</span>
            <strong>{content.visualTitle}</strong>
            <i />
          </div>
          <div className={styles.previewArtwork}><span /><span /><span /></div>
        </div>
        <div className={styles.previewCards}><i /><i /><i /></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWindow}>
      <div className={styles.dashboardTop}>
        <span>{content.visualTitle}</span>
        <i />
      </div>
      <div className={styles.dashboardBody}>
        <div className={styles.dashboardSidebar}><i /><i /><i /><i /></div>
        <div className={styles.dashboardContent}>
          <div className={styles.dashboardHeading}>
            <strong>Resumen general</strong>
            <span>Vista de gestión</span>
          </div>
          <div className={styles.dashboardMetrics}><i /><i /><i /></div>
          <div className={styles.dashboardChart}>
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SolutionLandingPage({ type }: { type: PageType }) {
  const content = pageContent[type];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{content.breadcrumb}</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{content.eyebrow}</span>
              <h1>{content.title}</h1>
              <p>{content.description}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/contacto">
                  {content.primaryAction}<ArrowRight size={18} />
                </Link>
                <a className={styles.secondaryButton} href="#soluciones">
                  Explorar soluciones<ArrowDown size={16} />
                </a>
              </div>
              <div className={styles.heroNote}>
                <span aria-hidden="true" />
                Diseño y desarrollo adaptados a tu proyecto
              </div>
            </div>
            <div
              className={`${styles.heroVisual} ${type === "web" ? styles.webVisual : styles.systemsVisual}`}
              aria-hidden="true"
            >
              <div className={styles.visualGlow} />
              <ProductPreview type={type} content={content} />
              <div className={styles.visualBadge}>
                <span><Gauge size={17} /></span>
                {content.visualSubtitle}
              </div>
              <div className={styles.visualOrb} />
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.quickNav} aria-label="Secciones de la página">
        <div className={`${styles.container} ${styles.quickNavInner}`}>
          <span>Descubre</span>
          <a href="#soluciones">Soluciones<ArrowDown size={14} aria-hidden="true" /></a>
          <a href="#incluye">Qué incluye<ArrowDown size={14} aria-hidden="true" /></a>
          <a href="#proceso">Cómo trabajamos<ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <section className={styles.solutionsSection} id="soluciones" aria-labelledby="solutions-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>{content.sectionEyebrow}</span>
            <h2 id="solutions-heading">{content.sectionTitle}</h2>
            <p>{content.sectionDescription}</p>
          </div>
          <div className={styles.solutionGrid}>
            {content.cards.map(({ title, description, href, Icon }, index) => (
              <article className={styles.solutionCard} key={title}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}><Icon size={22} /></span>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link className={styles.cardLink} href={href}>
                  {href === "/contacto" ? "Consultar proyecto" : "Conocer solución"}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuresSection} id="incluye" aria-labelledby="features-heading">
        <div className={`${styles.container} ${styles.featuresLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>{content.featuresEyebrow}</span>
            <h2 id="features-heading">{content.featuresTitle}</h2>
            <p>
              Cada proyecto se define en conjunto para priorizar las funciones que realmente aportan a tu operación.
            </p>
            <Link className={styles.methodLink} href="/metodologia">
              Conoce nuestra metodología<ArrowRight size={17} />
            </Link>
          </div>
          <div className={styles.featureGrid}>
            {content.features.map(({ title, description, Icon }) => (
              <article className={styles.featureCard} key={title}>
                <span className={styles.featureIcon}><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection} id="proceso" aria-labelledby="process-heading">
        <div className={styles.container}>
          <div className={styles.processHeading}>
            <span className={styles.sectionEyebrow}>Un proceso claro</span>
            <h2 id="process-heading">De la idea a una solución lista para usar</h2>
          </div>
          <div className={styles.processGrid}>
            {processSteps.map((step) => (
              <article className={styles.processCard} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`${styles.container} ${styles.finalCtaInner}`}>
          <div>
            <span className={styles.ctaEyebrow}>Hablemos de tu proyecto</span>
            <h2>{type === "web" ? "Tu próxima web empieza con una buena conversación" : "Construyamos un sistema que se adapte a tu negocio"}</h2>
            <p>Cuéntanos qué necesitas y te ayudaremos a definir los siguientes pasos.</p>
          </div>
          <Link className={styles.ctaButton} href="/contacto">
            Solicitar cotización<ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
