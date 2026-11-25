import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Gauge,
  LayoutTemplate,
  MonitorSmartphone,
  Plug,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import styles from "./ServicesPage.module.css";

type Service = {
  title: string;
  description: string;
  includes: string[];
  href: string;
  Icon: LucideIcon;
};

const serviceGroups: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  services: Service[];
}[] = [
  {
    id: "web",
    eyebrow: "Presencia digital",
    title: "Haz que tu negocio destaque en internet",
    description:
      "Experiencias web profesionales para presentar tu marca, atraer clientes y vender tus productos.",
    services: [
      {
        title: "Sitios web a medida",
        description:
          "Una web profesional, diseñada para comunicar el valor de tu negocio y facilitar el contacto.",
        includes: ["Diseño responsive", "Contenido claro", "SEO técnico"],
        href: "/sitios-web",
        Icon: MonitorSmartphone,
      },
      {
        title: "Tiendas online",
        description:
          "Muestra tus productos y administra pedidos con una experiencia de compra sencilla.",
        includes: ["Catálogo", "Carrito", "Pagos y pedidos"],
        href: "/soluciones/tiendas-online-ecommerce",
        Icon: ShoppingCart,
      },
      {
        title: "Landing pages",
        description:
          "Páginas enfocadas en una oferta, campaña o servicio con una acción clara para tus visitantes.",
        includes: ["Mensaje enfocado", "Captación", "Diseño adaptable"],
        href: "/soluciones/landing-pages-express",
        Icon: LayoutTemplate,
      },
      {
        title: "Rediseño web",
        description:
          "Actualizamos la imagen, estructura y navegación de tu sitio para alinearlo con tu negocio actual.",
        includes: ["Diseño actualizado", "Mejor navegación", "Optimización"],
        href: "/contacto",
        Icon: RefreshCw,
      },
    ],
  },
  {
    id: "sistemas",
    eyebrow: "Procesos conectados",
    title: "Simplifica tareas y conecta tus herramientas",
    description:
      "Soluciones digitales que ayudan a organizar información y adaptar la tecnología a tu forma de trabajar.",
    services: [
      {
        title: "Sistemas web personalizados",
        description:
          "Plataformas creadas alrededor de los procesos y necesidades concretas de tu empresa.",
        includes: ["Paneles", "Roles y permisos", "Reportes"],
        href: "/sistemas-web",
        Icon: Code2,
      },
      {
        title: "Integraciones",
        description:
          "Conectamos tu sitio o sistema con herramientas externas para reducir tareas manuales.",
        includes: ["APIs", "Pagos", "CRM y correo"],
        href: "/soluciones/integraciones-api-pasarelas",
        Icon: Plug,
      },
    ],
  },
  {
    id: "crecimiento",
    eyebrow: "Crecimiento y continuidad",
    title: "Mantén tu plataforma útil y actualizada",
    description:
      "Mejoras técnicas y acompañamiento para cuidar la experiencia y evolución de tu sitio.",
    services: [
      {
        title: "SEO y optimización",
        description:
          "Mejoramos la estructura y el rendimiento técnico para facilitar la navegación y el rastreo.",
        includes: ["SEO técnico", "Rendimiento", "Analítica"],
        href: "/soluciones/seo-tecnico-velocidad",
        Icon: Search,
      },
      {
        title: "Mantenimiento",
        description:
          "Revisiones y actualizaciones para mantener tu plataforma en buenas condiciones.",
        includes: ["Actualizaciones", "Copias de seguridad", "Revisión técnica"],
        href: "/soluciones/hosting-cloud-soporte",
        Icon: ShieldCheck,
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Servicios</span>
          </nav>

          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Diseño, desarrollo y tecnología</span>
              <h1>La solución digital adecuada para cada etapa de tu negocio</h1>
              <p>
                Desde tu primera página web hasta sistemas a medida: explora los
                servicios y encuentra por dónde empezar.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/contacto">
                  Hablemos de tu proyecto <ArrowRight size={18} />
                </Link>
                <a className={styles.secondaryButton} href="#catalogo">
                  Explorar servicios <ArrowDown size={17} />
                </a>
              </div>
              <div className={styles.heroNote}>
                <span aria-hidden="true" />
                Soluciones pensadas para las necesidades reales de tu empresa
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.visualGlow} />
              <div className={styles.visualPanel}>
                <div className={styles.visualPanelHeader}>
                  <span className={styles.windowDots}><i /><i /><i /></span>
                  <span>webprols.com</span>
                  <span className={styles.panelMenu}>•••</span>
                </div>
                <div className={styles.visualMain}>
                  <div className={styles.visualIcon}><Gauge size={24} /></div>
                  <div>
                    <strong>Tu próximo proyecto</strong>
                    <span>Una solución hecha para ti</span>
                  </div>
                  <ArrowUpRight className={styles.visualArrow} size={19} />
                </div>
                <div className={styles.visualBars}>
                  <span /><span /><span />
                </div>
                <div className={styles.visualTags}>
                  <span>Diseño web</span>
                  <span>Sistemas</span>
                  <span>E-commerce</span>
                </div>
              </div>
              <div className={styles.visualBadge}>
                <span><ShieldCheck size={17} /></span>
                Tecnología a tu medida
              </div>
              <div className={styles.visualOrbit} />
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.categoryNav} aria-label="Explorar servicios por categoría">
        <div className={`${styles.container} ${styles.categoryNavInner}`}>
          <span className={styles.categoryLabel}>Explora por necesidad</span>
          {serviceGroups.map((group) => (
            <a key={group.id} href={`#${group.id}`} className={styles.categoryLink}>
              {group.eyebrow} <ArrowDown size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.catalog} id="catalogo">
        <div className={styles.container}>
          {serviceGroups.map((group, groupIndex) => (
            <section
              className={styles.serviceGroup}
              id={group.id}
              key={group.id}
              aria-labelledby={`${group.id}-heading`}
            >
              <div className={styles.groupIntro}>
                <span className={styles.groupEyebrow}>
                  <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                  {group.eyebrow}
                </span>
                <h2 id={`${group.id}-heading`}>{group.title}</h2>
                <p>{group.description}</p>
              </div>

              <div className={styles.serviceGrid}>
                {group.services.map((service, serviceIndex) => {
                  const Icon = service.Icon;
                  return (
                    <article className={styles.serviceCard} key={service.title}>
                      <div className={styles.cardTop}>
                        <span className={styles.serviceIcon}><Icon size={22} /></span>
                        <span className={styles.serviceNumber}>
                          {String(serviceIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3>{service.title}</h3>
                      <p className={styles.serviceDescription}>{service.description}</p>
                      <ul className={styles.includedList}>
                        {service.includes.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      <Link className={styles.cardLink} href={service.href}>
                        {service.href === "/contacto" ? "Consultar servicio" : "Conocer solución"}
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className={styles.finalCta}>
        <div className={`${styles.container} ${styles.finalCtaInner}`}>
          <div>
            <span className={styles.ctaEyebrow}>¿Tienes una idea en mente?</span>
            <h2>Cuéntanos qué necesita tu negocio</h2>
            <p>Te ayudaremos a encontrar el mejor punto de partida para tu proyecto.</p>
          </div>
          <Link className={styles.ctaButton} href="/contacto">
            Solicitar cotización <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
