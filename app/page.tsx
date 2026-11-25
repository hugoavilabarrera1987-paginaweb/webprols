import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Gauge,
  LayoutTemplate,
  Layers3,
  LineChart,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  ["Diseño personalizado", "Creamos una experiencia visual alineada con la identidad, los objetivos y el público de tu negocio.", LayoutTemplate],
  ["Desarrollo a medida", "Construimos funcionalidades específicas según los procesos y necesidades de cada empresa.", Code2],
  ["Rendimiento y velocidad", "Optimizamos cada sitio para ofrecer una experiencia rápida y eficiente en todos los dispositivos.", Gauge],
  ["Soluciones escalables", "Desarrollamos plataformas que pueden crecer junto con tu negocio y agregar nuevas funciones.", Layers3],
] as const;

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Diseño, desarrollo, SEO y tecnología</div>
            <h1>Creamos sitios y sistemas web a medida para hacer crecer tu negocio</h1>
            <p>Diseñamos y desarrollamos soluciones digitales personalizadas, profesionales y escalables, adaptadas a los objetivos reales de cada empresa.</p>
            <div className="hero-actions">
              <Link href="/contacto" className="btn btn-primary">Solicitar cotización <ArrowRight size={18} /></Link>
              <Link href="/servicios" className="btn btn-ghost">Ver nuestros servicios</Link>
            </div>
            <div className="hero-note"><ShieldCheck size={18} /> Desde una página profesional hasta un sistema completo.</div>
          </div>

          <div className="hero-visual" aria-label="Ejemplo de interfaz web y panel administrativo">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="browser-mockup">
              <div className="browser-bar"><i /><i /><i /><span>webprols.cl</span></div>
              <div className="browser-content">
                <div className="mock-nav"><strong>tu marca</strong><span /><span /><span /></div>
                <div className="mock-hero">
                  <div><small>PROYECTO DIGITAL</small><b>Impulsa tu negocio</b><em /></div>
                  <div className="mock-art"><span /><span /><span /></div>
                </div>
                <div className="mock-cards"><i /><i /><i /></div>
              </div>
            </div>
            <div className="dashboard-mockup">
              <div className="dashboard-head"><b>Panel administrativo</b><span /></div>
              <div className="dashboard-body">
                <div className="dash-side"><i /><i /><i /><i /></div>
                <div className="dash-main">
                  <div className="dash-metrics"><i /><i /><i /></div>
                  <div className="dash-chart"><span /><span /><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
            <div className="floating-card growth"><LineChart size={20} /><div><small>Crecimiento</small><b>+32%</b></div></div>
            <div className="floating-card code"><Code2 size={19} /><span>Solución a medida</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div>
            <span className="section-kicker">Una solución diferente</span>
            <h2>Tu negocio necesita una solución web, no una plantilla genérica</h2>
          </div>
          <div className="split-copy">
            <p>Cada negocio funciona de una manera diferente. Por eso en Web Pro LS desarrollamos sitios y sistemas web a medida, con el diseño, las funciones y la estructura que realmente necesitas.</p>
            <p>Transformamos ideas y procesos de negocio en plataformas digitales modernas, rápidas, seguras y preparadas para crecer.</p>
            <Link href="/contacto" className="text-link">Cuéntanos tu proyecto <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker">Por qué elegirnos</span>
            <h2>Construimos valor en cada línea de tu proyecto</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map(([title, text, Icon]) => (
              <article className="benefit-card" key={title}>
                <div className="icon-box"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Soluciones web</span>
            <h2>Todo lo que necesitas para tener presencia digital</h2>
          </div>
          <div className="service-grid">
            <article className="service-card featured">
              <span className="service-number">01</span><MonitorSmartphone size={28} />
              <h3>Sitios web a medida</h3><p>Presencia profesional diseñada para comunicar tu propuesta y convertir visitas en consultas.</p>
              <Link href="/sitios-web">Crear mi sitio web <ArrowRight size={16} /></Link>
            </article>
            <article className="service-card">
              <span className="service-number">02</span><Layers3 size={28} />
              <h3>Sistemas personalizados</h3><p>Software web adaptado a tus procesos para automatizar tareas y administrar información.</p>
              <Link href="/sistemas-web">Desarrollar mi sistema <ArrowRight size={16} /></Link>
            </article>
            <article className="service-card">
              <span className="service-number">03</span><Sparkles size={28} />
              <h3>Tiendas y landing pages</h3><p>Experiencias enfocadas en vender productos, captar clientes y potenciar campañas.</p>
              <Link href="/servicios">Ver soluciones <ArrowRight size={16} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div><span className="section-kicker">Iniciemos tu proyecto</span><h2>¿Tienes una idea para tu negocio?</h2><p>Cuéntanos qué necesitas y te ayudaremos a definir la mejor solución web.</p></div>
          <Link href="/contacto" className="btn btn-primary">Solicitar cotización <ArrowRight size={18} /></Link>
        </div>
      </section>

    </main>
  );
}
