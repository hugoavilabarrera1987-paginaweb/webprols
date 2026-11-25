import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Compass,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import ContactForm from "@/app/components/ContactForm";
import ServicesPage from "@/app/components/ServicesPage";
import SolutionLandingPage from "@/app/components/SolutionLandingPage";
import editorialStyles from "@/app/components/EditorialPages.module.css";
import { getPublishedBlogPosts, legacyBlogPosts } from "@/lib/supabase/blog";
import { getPublishedProjects } from "@/lib/supabase/portfolio";

const seo: Record<string, { title: string; description: string }> = {
  servicios: { title: "Diseño Web, Sistemas Personalizados y Tiendas Online | Web Pro LS", description: "Servicios de diseño web, sistemas personalizados, tiendas online, integraciones y mantenimiento." },
  "sitios-web": { title: "Sitios Web Profesionales a Medida para Empresas | Web Pro LS", description: "Creamos sitios web profesionales, rápidos y personalizados para empresas en Chile." },
  "sistemas-web": { title: "Desarrollo de Sistemas Web Personalizados | Web Pro LS", description: "Desarrollamos sistemas web para automatizar procesos y administrar tu empresa." },
  nosotros: { title: "Web Pro LS | Desarrollo Web y Sistemas a Medida", description: "Conoce a Web Pro LS y nuestra forma de desarrollar soluciones digitales personalizadas." },
  metodologia: { title: "Metodología de Desarrollo Web | Web Pro LS", description: "Conoce las etapas de descubrimiento, planificación, desarrollo y lanzamiento de nuestros proyectos." },
  portafolio: { title: "Portafolio de Sitios y Sistemas Web | Web Pro LS", description: "Explora proyectos de sitios web, sistemas y soluciones digitales desarrollados por Web Pro LS." },
  blog: { title: "Blog de Diseño Web, Desarrollo y Tecnología", description: "Artículos sobre diseño web, SEO, desarrollo, tiendas online y sistemas personalizados." },
  contacto: { title: "Solicita una Cotización para tu Sitio o Sistema Web", description: "Cuéntanos tu proyecto y solicita una cotización a Web Pro LS." },
  privacidad: { title: "Política de Privacidad | Web Pro LS", description: "Conoce qué información recopilamos, cómo la utilizamos, el uso de cookies y cómo ejercer tus derechos de privacidad." },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return seo[slug] ?? seo.servicios;
}

export function generateStaticParams() {
  return Object.keys(seo).map((slug) => ({ slug }));
}

export default function InnerPage({ params }: Props) {
  return (
    <Suspense fallback={<PageFallback />}>
      <ResolvedPage params={params} />
    </Suspense>
  );
}

async function ResolvedPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "contacto") return <ContactPage />;
  if (slug === "portafolio") return <PortfolioPage />;
  if (slug === "blog") return <BlogPage />;
  if (slug === "metodologia") return <MethodologyPage />;
  if (slug === "privacidad") return <PrivacyPage />;
  if (slug === "nosotros") return <AboutPage />;
  if (slug === "sistemas-web") return <SolutionLandingPage type="systems" />;
  if (slug === "sitios-web") return <SolutionLandingPage type="web" />;
  return <ServicesPage />;
}

function PageFallback() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <div className="container" aria-busy="true">
          <div className="breadcrumbs">Web Pro LS</div>
          <h1>Preparando tu solución web</h1>
          <p>Estamos cargando la información de esta página.</p>
        </div>
      </section>
    </main>
  );
}

function PageHero({ title, text, crumb }: { title: string; text: string; crumb: string }) {
  return <section className="page-hero"><div className="container"><div className="breadcrumbs">Inicio / {crumb}</div><h1>{title}</h1><p>{text}</p></div></section>;
}

function AboutPage() {
  const values = [
    { title: "Escucha", text: "Entendemos el contexto y los objetivos antes de proponer una solución.", Icon: Users },
    { title: "Personalización", text: "Diseñamos cada proyecto en torno a las necesidades del negocio.", Icon: Sparkles },
    { title: "Transparencia", text: "Mantenemos claros los alcances, prioridades y próximos pasos.", Icon: ShieldCheck },
    { title: "Propósito", text: "Priorizamos funciones útiles para las personas que usarán la plataforma.", Icon: Target },
  ];

  return (
    <main className={editorialStyles.main}>
      <section className={`${editorialStyles.hero} ${editorialStyles.aboutHero}`}>
        <div className={editorialStyles.editorialContainer}>
          <nav className={editorialStyles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Nosotros</span>
          </nav>
          <div className={editorialStyles.heroGrid}>
            <div className={editorialStyles.heroCopy}>
              <span className={editorialStyles.eyebrow}>Quiénes somos</span>
              <h1>Convertimos ideas y procesos en soluciones digitales</h1>
              <p>
                Combinamos diseño, tecnología y estrategia para crear plataformas
                útiles, profesionales y adaptadas a cada negocio.
              </p>
              <Link className={editorialStyles.heroButton} href="/contacto">
                Conversemos sobre tu proyecto<ArrowRight size={18} />
              </Link>
            </div>
            <div className={editorialStyles.aboutArtwork} aria-hidden="true">
              <div className={editorialStyles.aboutOrbit} />
              <div className={editorialStyles.aboutArtCard}>
                <span className={editorialStyles.aboutMark}>W</span>
                <span className={editorialStyles.aboutBrand}>WEB PRO LS</span>
                <strong>Ideas que se convierten en soluciones</strong>
                <div className={editorialStyles.aboutArtLines}><i /><i /><i /></div>
              </div>
              <div className={editorialStyles.aboutArtBadge}>
                <Compass size={18} /> Tecnología con propósito
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={editorialStyles.missionSection}>
        <div className={editorialStyles.editorialContainer}>
          <div className={editorialStyles.statementGrid}>
            <article className={editorialStyles.statementCard}>
              <span className={editorialStyles.statementIcon}><Target size={21} /></span>
              <span className={editorialStyles.sectionEyebrow}>Nuestra misión</span>
              <h2>Crear soluciones que impulsen el crecimiento</h2>
              <p>
                Ayudamos a las empresas a presentar mejor sus servicios,
                simplificar procesos y ofrecer una experiencia digital clara.
              </p>
            </article>
            <article className={`${editorialStyles.statementCard} ${editorialStyles.visionCard}`}>
              <span className={editorialStyles.statementIcon}><Lightbulb size={21} /></span>
              <span className={editorialStyles.sectionEyebrow}>Nuestra visión</span>
              <h2>Hacer que la tecnología trabaje para cada negocio</h2>
              <p>
                Queremos ser un aliado cercano para crear sitios y sistemas
                web escalables, pensados para necesidades reales.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={editorialStyles.valuesSection}>
        <div className={editorialStyles.editorialContainer}>
          <div className={editorialStyles.sectionHeading}>
            <span className={editorialStyles.sectionEyebrow}>Lo que nos guía</span>
            <h2>Principios detrás de cada proyecto</h2>
            <p>Una buena solución comienza entendiendo a las personas y el trabajo que necesitan hacer.</p>
          </div>
          <div className={editorialStyles.valueGrid}>
            {values.map(({ title, text, Icon }) => (
              <article className={editorialStyles.valueCard} key={title}>
                <span className={editorialStyles.valueIcon}><Icon size={20} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <EditorialCallToAction
        eyebrow="Construyamos juntos"
        title="¿Tienes una idea para tu negocio?"
        description="Cuéntanos qué necesitas y conversemos sobre el siguiente paso."
      />
    </main>
  );
}

function MethodologyPage() {
  const stages = [
    ["01","Descubrimiento","Conocemos tu negocio, tus objetivos y los procesos que quieres mejorar.",["Reunión inicial","Análisis del negocio","Identificación de necesidades","Definición de objetivos","Análisis de la competencia"]],
    ["02","Planificación","Definimos la estructura, funcionalidades y estrategia del proyecto.",["Arquitectura","Organización de contenidos","Definición de funcionalidades","Plan de desarrollo","Priorización"]],
    ["03","Diseño y desarrollo","Diseñamos y construimos una solución atractiva, funcional y optimizada.",["Diseño UX/UI","Diseño responsive","Frontend","Backend","Integraciones","SEO","Velocidad"]],
    ["04","Pruebas y lanzamiento","Comprobamos que todo funcione correctamente antes de publicar.",["Pruebas móviles","Pruebas tablet","Pruebas computador","Revisión de formularios","Velocidad","Seguridad","Analítica","Publicación","Capacitación"]],
  ] as const;
  return <main className="inner-page"><PageHero title="Una metodología clara, desde la idea al lanzamiento" text="Trabajamos con etapas definidas para mantener el proyecto organizado, comprender tus necesidades y validar cada avance." crumb="Metodología" /><section className="section"><div className="container timeline">{stages.map(([n,title,text,items])=><article className="timeline-card" key={n}><span>{n}</span><h2>{title}</h2><p>{text}</p><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></article>)}</div></section><Conversion /></main>;
}

async function PortfolioPage() {
  const managedProjects = await getPublishedProjects();
  const projects = [
    ["RoofFix.cl","Sitios web","Transformación digital de una empresa tradicional de techado en una plataforma orientada a captar clientes potenciales y mejorar el proceso comercial."],
    ["Digiclinic.cl","Tiendas online","Plataforma e-commerce especializada en la distribución de ecógrafos de alta gama para clínicas y hospitales."],
    ["Sistema de gestión vehicular","Sistemas web","Sistema web desarrollado a medida para conectar clientes, técnicos y administración en tiempo real."],
  ] as const;
  const displayProjects = managedProjects === null
    ? projects.map(([title, category, summary]) => ({
        id: title,
        title,
        category,
        summary,
        isFeatured: false,
        image: null,
        href: "/contacto",
      }))
    : managedProjects.map((project) => ({
        id: project.id,
        title: project.title,
        category: project.category,
        summary: project.summary,
        isFeatured: project.is_featured,
        image: project.images[0] ?? null,
        href: `/portafolio/${project.slug}`,
      }));
  return (
    <main className={editorialStyles.main}>
      <section className={`${editorialStyles.hero} ${editorialStyles.portfolioHero}`}>
        <div className={editorialStyles.editorialContainer}>
          <nav className={editorialStyles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Portafolio</span>
          </nav>
          <div className={editorialStyles.portfolioHeroContent}>
            <div>
              <span className={editorialStyles.eyebrow}>Trabajo seleccionado</span>
              <h1>Proyectos digitales creados para resolver necesidades reales</h1>
              <p>
                Explora sitios, tiendas y sistemas desarrollados para ayudar a
                negocios a presentar sus servicios y organizar su operación.
              </p>
            </div>
            <Link className={editorialStyles.heroButton} href="/contacto">
              Cuéntanos qué quieres crear<ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className={editorialStyles.portfolioSection} id="proyectos">
        <div className={editorialStyles.editorialContainer}>
          <div className={editorialStyles.sectionHeading}>
            <span className={editorialStyles.sectionEyebrow}>Casos seleccionados</span>
            <h2>Ideas convertidas en experiencias digitales</h2>
            <p>Cada proyecto parte de un objetivo y se construye a la medida de sus usuarios.</p>
          </div>
          {displayProjects.length > 0 ? (
            <div className={editorialStyles.projectGrid}>
              {displayProjects.map((project) => (
                <article className={editorialStyles.projectCard} key={project.id}>
                  <Link className={editorialStyles.projectVisualLink} href={project.href} aria-label={`Ver ${project.title}`}>
                    {project.image ? (
                      <Image
                        className={editorialStyles.projectImage}
                        src={project.image.url}
                        alt={project.image.alt_text || project.title}
                        width={760}
                        height={440}
                        sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1212px) calc((100vw - 68px) / 3), 381px"
                        quality={75}
                      />
                    ) : (
                      <div className={editorialStyles.projectArtwork} aria-hidden="true">
                        <div className={editorialStyles.projectBrowser}>
                          <span><i /><i /><i /></span>
                          <b>{project.category}</b>
                          <div><i /><i /><i /></div>
                        </div>
                        <div className={editorialStyles.projectAbstract}>
                          <span /><span /><span />
                        </div>
                      </div>
                    )}
                    {project.isFeatured && <span className={editorialStyles.featuredBadge}>Destacado</span>}
                    <span className={editorialStyles.projectViewIcon}><ArrowUpRight size={19} /></span>
                  </Link>
                  <div className={editorialStyles.projectInfo}>
                    <span className={editorialStyles.projectCategory}>{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <Link className={editorialStyles.projectLink} href={project.href}>
                      {managedProjects === null ? "Consultar proyecto" : "Ver proyecto"}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={editorialStyles.emptyState}>
              <span><Sparkles size={22} /></span>
              <h3>Estamos preparando nuevos proyectos</h3>
              <p>Pronto podrás conocer más soluciones desarrolladas por Web Pro LS.</p>
              <Link href="/contacto">Cuéntanos sobre tu proyecto<ArrowRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>
      <EditorialCallToAction
        eyebrow="Tu proyecto puede ser el próximo"
        title="Diseñemos una solución para tu negocio"
        description="Conversemos sobre tus objetivos y las herramientas que necesitas."
      />
    </main>
  );
}

async function BlogPage() {
  await connection();
  const managedArticles = await getPublishedBlogPosts();
  const articles = managedArticles ?? legacyBlogPosts;
  return (
    <main className={editorialStyles.main}>
      <section className={`${editorialStyles.hero} ${editorialStyles.blogHero}`}>
        <div className={editorialStyles.editorialContainer}>
          <nav className={editorialStyles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Blog</span>
          </nav>
          <div className={editorialStyles.blogHeroContent}>
            <span className={editorialStyles.blogHeroIcon}><BookOpen size={25} /></span>
            <span className={editorialStyles.eyebrow}>Ideas para avanzar</span>
            <h1>Conocimiento práctico para tus próximos pasos digitales</h1>
            <p>
              Artículos sobre diseño web, SEO, desarrollo y sistemas para ayudarte
              a tomar mejores decisiones para tu negocio.
            </p>
            <a className={editorialStyles.heroButton} href="#articulos">
              Explorar artículos<ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className={editorialStyles.blogSection} id="articulos">
        <div className={editorialStyles.editorialContainer}>
          <div className={editorialStyles.sectionHeading}>
            <span className={editorialStyles.sectionEyebrow}>Lecturas recientes</span>
            <h2>Ideas claras, aplicables a tu negocio</h2>
            <p>Encuentra guías y recomendaciones para construir y mejorar tu presencia digital.</p>
          </div>
          {articles.length > 0 ? (
            <div className={editorialStyles.articleGrid}>
              {articles.map((article, index) => (
                <article className={editorialStyles.articleCard} key={article.slug}>
                  <Link
                    className={`${editorialStyles.articleArtwork} ${editorialStyles[`articleTone${index % 3}`]}`}
                    href={`/blog/${article.slug}`}
                    aria-label={`Leer ${article.title}`}
                  >
                    <span className={editorialStyles.articleArtworkLabel}>IDEAS & TECNOLOGÍA</span>
                    <span className={editorialStyles.articleArtworkIcon}><BookOpen size={26} /></span>
                    <span className={editorialStyles.articleArtworkLines}><i /><i /><i /></span>
                  </Link>
                  <div className={editorialStyles.articleInfo}>
                    <div className={editorialStyles.articleMeta}>
                      <span>{article.category}</span>
                      <span><Clock3 size={14} />{article.read_minutes} min</span>
                    </div>
                    <h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.summary}</p>
                    <Link className={editorialStyles.articleLink} href={`/blog/${article.slug}`}>
                      Leer artículo<ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={editorialStyles.emptyState}>
              <span><BookOpen size={22} /></span>
              <h3>Estamos preparando nuevos artículos</h3>
              <p>Vuelve pronto para encontrar ideas y guías sobre desarrollo digital.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className={editorialStyles.main}>
      <section className={`${editorialStyles.hero} ${editorialStyles.contactHero}`}>
        <div className={editorialStyles.editorialContainer}>
          <nav className={editorialStyles.breadcrumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Contacto</span>
          </nav>
          <div className={editorialStyles.contactHeroContent}>
            <span className={editorialStyles.eyebrow}>Hablemos de tu proyecto</span>
            <h1>Cuéntanos qué quieres construir</h1>
            <p>
              Completa el formulario o escríbenos directamente. Nos ayudará
              conocer tus objetivos y qué necesitas resolver.
            </p>
          </div>
        </div>
      </section>

      <section className={editorialStyles.contactSection}>
        <div className={`${editorialStyles.editorialContainer} ${editorialStyles.contactLayout}`}>
          <aside className={editorialStyles.contactAside}>
            <span className={editorialStyles.sectionEyebrow}>Contacto directo</span>
            <h2>Empecemos con una conversación</h2>
            <p>Elige el canal que te resulte más cómodo para contarnos sobre tu idea.</p>
            <div className={editorialStyles.contactMethods}>
              <a href="https://wa.me/56979717705" target="_blank" rel="noreferrer" className={editorialStyles.contactMethod}>
                <span className={editorialStyles.contactMethodIcon}><MessageCircle size={19} /></span>
                <span><small>WhatsApp</small><strong>+56 9 7971 7705</strong></span>
                <ArrowUpRight size={17} />
              </a>
              <a href="mailto:contacto@webprols.com" className={editorialStyles.contactMethod}>
                <span className={editorialStyles.contactMethodIcon}><Mail size={19} /></span>
                <span><small>Correo electrónico</small><strong>contacto@webprols.com</strong></span>
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className={editorialStyles.locationCard}>
              <MapPin size={18} />
              <span><small>Ubicación</small><strong>Quinta Normal, Santiago, Chile</strong></span>
            </div>
            <div className={editorialStyles.contactAsideNote}>
              <span aria-hidden="true" />
              Cuéntanos tu objetivo y te ayudaremos a definir el siguiente paso.
            </div>
          </aside>

          <div className={editorialStyles.contactFormPanel}>
            <div className={editorialStyles.formHeading}>
              <span className={editorialStyles.sectionEyebrow}>Formulario de contacto</span>
              <h2>Comparte los detalles de tu proyecto</h2>
              <p>Completa la información para que podamos entender mejor lo que necesitas.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function PrivacyPage() {
  return (
    <main className="inner-page">
      <PageHero
        title="Política de privacidad"
        text="Conoce qué información recopilamos, cómo la utilizamos y cuáles son tus derechos de privacidad."
        crumb="Privacidad"
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <article className="project-rich-content">
            <p><strong>Última actualización:</strong> 12 de mayo de 2026</p>
            <p>
              En <strong>Web Pro LS</strong>, accesible desde{" "}
              <a href="https://webprols.com/">webprols.com</a>, la privacidad de
              nuestros visitantes es una prioridad. Esta política describe la
              información que recopilamos y cómo la utilizamos para ofrecer
              nuestros servicios de diseño y desarrollo web.
            </p>

            <h2>1. Información que recopilamos</h2>
            <p>
              Recopilamos información que nos proporcionas voluntariamente al
              consultar sobre nuestros servicios. Esta puede incluir:
            </p>
            <ul>
              <li>
                <strong>Datos de contacto:</strong> nombre, empresa, dirección
                de correo electrónico y número de teléfono.
              </li>
              <li>
                <strong>Información del proyecto:</strong> detalles sobre tu
                negocio y necesidades de desarrollo, como preferencias de
                diseño, objetivos de SEO, requerimientos de hosting,
                funcionalidades, presupuesto o plazos que decidas compartir.
              </li>
              <li>
                <strong>Datos técnicos:</strong> dirección IP, tipo de navegador
                y páginas visitadas, mediante archivos de registro estándar.
              </li>
            </ul>

            <h2>2. Uso de la información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proveer, operar y mantener nuestro sitio web y servicios.</li>
              <li>
                Mejorar, personalizar y ampliar nuestros servicios de diseño
                web y estrategias digitales.
              </li>
              <li>
                Comprender y analizar cómo las personas interactúan con nuestro
                contenido y herramientas.
              </li>
              <li>
                Comunicarnos contigo para ofrecer actualizaciones, soporte
                técnico y material promocional relacionado con Web Pro LS.
              </li>
              <li>
                Optimizar el posicionamiento (SEO) y la funcionalidad técnica de
                las plataformas que gestionamos.
              </li>
            </ul>

            <h2>3. Cookies y tecnologías de seguimiento</h2>
            <p>
              Web Pro LS utiliza cookies para recordar las preferencias de las
              personas visitantes y las páginas del sitio que consultan. Esta
              información ayuda a mejorar la experiencia y adaptar el contenido
              según el navegador u otros datos disponibles. También utilizamos
              Google Analytics 4 para medir el uso de las páginas públicas y
              mejorar el sitio; la etiqueta no se carga en las rutas administrativas.
            </p>

            <h2>4. Terceros y enlaces externos</h2>
            <p>
              Esta política no se aplica a otros anunciantes ni a sitios web
              externos. Te recomendamos consultar las políticas de privacidad
              de esos terceros para conocer sus prácticas. Esto puede incluir
              servicios de análisis de datos o plataformas de gestión de
              contenido integradas en nuestros proyectos.
            </p>

            <h2>5. Protección de la información</h2>
            <p>
              Implementamos medidas de seguridad diseñadas para proteger tu
              información personal frente al acceso no autorizado, la
              alteración, divulgación o destrucción de datos.
            </p>

            <h2>6. Derechos de privacidad</h2>
            <p>
              Puedes solicitar acceso, rectificación o eliminación de tus datos
              personales almacenados en nuestros registros. Para ejercer estos
              derechos, contáctanos a través de los canales oficiales en{" "}
              <a href="https://webprols.com/">webprols.com</a> o escribe a{" "}
              <a href="mailto:contacto@webprols.com">contacto@webprols.com</a>.
            </p>

            <h2>7. Consentimiento</h2>
            <p>
              Al utilizar nuestro sitio web, aceptas esta Política de Privacidad
              y sus términos.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function EditorialCallToAction({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className={editorialStyles.editorialCta}>
      <div className={`${editorialStyles.editorialContainer} ${editorialStyles.editorialCtaInner}`}>
        <div>
          <span className={editorialStyles.ctaEyebrow}>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link className={editorialStyles.ctaButton} href="/contacto">
          Hablemos<ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function Conversion() {
  return <section className="cta-section"><div className="container cta-inner"><div><span className="section-kicker">Construyamos juntos tu próximo proyecto</span><h2>¿Qué solución necesita tu negocio?</h2></div><div className="hero-actions"><Link href="/contacto" className="btn btn-primary">Quiero un sitio web</Link><Link href="/contacto" className="btn btn-ghost">Quiero un sistema web</Link></div></div></section>;
}
