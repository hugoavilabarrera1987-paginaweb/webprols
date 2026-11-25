"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Code2,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Server,
  Sun,
  Terminal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import styles from "./SiteHeader.module.css";

type SubmenuLink = { label: string; href: string };
type NavigationItem = {
  id: string;
  label: string;
  Icon: LucideIcon;
  activePaths: string[];
  href?: string;
  submenu?: SubmenuLink[];
};

const navigationItems: NavigationItem[] = [
  { id: "home", label: "Inicio", Icon: Terminal, href: "/", activePaths: ["/"] },
  {
    id: "services",
    label: "Servicios",
    Icon: Layers,
    href: "/servicios",
    activePaths: [
      "/servicios",
      "/soluciones/diseno-ui-ux-branding",
      "/soluciones/seo-tecnico-velocidad",
      "/soluciones/hosting-cloud-soporte",
    ],
    submenu: [
      { label: "Diseño UI/UX & Branding", href: "/soluciones/diseno-ui-ux-branding" },
      { label: "SEO Técnico & Velocidad", href: "/soluciones/seo-tecnico-velocidad" },
      { label: "Hosting Cloud & Soporte", href: "/soluciones/hosting-cloud-soporte" },
    ],
  },
  {
    id: "websites",
    label: "Sitios web",
    Icon: Globe,
    href: "/sitios-web",
    activePaths: [
      "/sitios-web",
      "/soluciones/landing-pages-express",
      "/soluciones/sitios-web-corporativos",
      "/soluciones/tiendas-online-ecommerce",
    ],
    submenu: [
      { label: "Landing Pages Express", href: "/soluciones/landing-pages-express" },
      { label: "Sitios Web Corporativos", href: "/soluciones/sitios-web-corporativos" },
      { label: "Tiendas Online E-Commerce", href: "/soluciones/tiendas-online-ecommerce" },
    ],
  },
  {
    id: "systems",
    label: "Sistemas web",
    Icon: Server,
    href: "/sistemas-web",
    activePaths: [
      "/sistemas-web",
      "/soluciones/erp-crm-medida",
      "/soluciones/reservas-citas",
      "/soluciones/integraciones-api-pasarelas",
    ],
    submenu: [
      { label: "Sistemas ERP / CRM a Medida", href: "/soluciones/erp-crm-medida" },
      { label: "Plataformas de Reservas & Citas", href: "/soluciones/reservas-citas" },
      {
        label: "Integraciones API & Pasarelas",
        href: "/soluciones/integraciones-api-pasarelas",
      },
    ],
  },
  { id: "about", label: "Nosotros", Icon: Users, href: "/nosotros", activePaths: ["/nosotros"] },
  {
    id: "portfolio",
    label: "Portafolio",
    Icon: LayoutGrid,
    href: "/portafolio",
    activePaths: ["/portafolio"],
  },
  { id: "blog", label: "Blog", Icon: Code2, href: "/blog", activePaths: ["/blog"] },
  {
    id: "contact",
    label: "Contacto",
    Icon: MessageCircle,
    href: "/contacto",
    activePaths: ["/contacto"],
  },
];

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand ${light ? "brand-light" : ""}`} aria-label="Web Pro LS, inicio">
      <Image
        className="brand-logo"
        src="/icons/brand-logo.png"
        alt=""
        aria-hidden="true"
        width={595}
        height={240}
        unoptimized
      />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const lastPathnameRef = useRef(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const navItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  const activeIndex = navigationItems.findIndex((item) =>
    item.activePaths.some(
      (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
    ),
  );
  const pillIndex = hoveredIndex ?? activeIndex;

  useEffect(() => {
    const updatePill = () => {
      if (pillIndex < 0) return;
      const nav = navLinksRef.current;
      const item = navItemRefs.current[pillIndex];
      if (!nav || !item) return;
      setPill({ left: item.offsetLeft, width: item.offsetWidth });
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [pathname, pillIndex]);

  useEffect(() => {
    let animationFrame = 0;
    const updateScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;

        const compact = window.scrollY > 24;
        setIsCompact((current) => current === compact ? current : compact);
        progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);
      });
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || window.matchMedia("(min-width: 1280px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setOpenDropdown(null);
        setHoveredIndex(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const shouldRestoreFocus =
        window.matchMedia("(max-width: 1279px)").matches &&
        menuButtonRef.current?.getAttribute("aria-expanded") === "true";
      setMenuOpen(false);
      setOpenDropdown(null);
      setHoveredIndex(null);
      if (shouldRestoreFocus) menuButtonRef.current?.focus();
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 1280px)");

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (lastPathnameRef.current === pathname) return;
    lastPathnameRef.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      setOpenDropdown(null);
      setMenuOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  function closeMenu() {
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isCompact ? styles.compact : ""}`}
    >
      <div className={`container ${styles.inner}`}>
        <Brand />
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => {
            setMenuOpen((current) => !current);
            setOpenDropdown(null);
          }}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <button
          type="button"
          className={`${styles.backdrop} ${menuOpen ? styles.backdropVisible : ""}`}
          aria-label="Cerrar menú"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <nav
          id="site-navigation"
          className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}
          aria-label="Navegación principal"
          onMouseLeave={() => {
            if (window.matchMedia("(hover: hover) and (min-width: 1280px)").matches) {
              setHoveredIndex(null);
              setOpenDropdown(null);
            }
          }}
        >
          <ul ref={navLinksRef} className={styles.linkList}>
            <span
              aria-hidden="true"
              className={styles.magicPill}
              style={{
                width: pill.width,
                transform: `translateX(${pill.left}px)`,
                opacity: pillIndex >= 0 ? 1 : 0,
              }}
            />
            {navigationItems.map((item, index) => {
              const isActive = index === activeIndex;
              const isOpen = item.id === openDropdown;
              const Icon = item.Icon;

              return (
                <li
                  key={item.id}
                  ref={(element) => {
                    navItemRefs.current[index] = element;
                  }}
                  className={styles.navItem}
                  onMouseEnter={() => {
                    if (window.matchMedia("(hover: hover) and (min-width: 1280px)").matches) {
                      setHoveredIndex(index);
                      if (item.submenu) setOpenDropdown(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (
                      item.submenu &&
                      window.matchMedia("(hover: hover) and (min-width: 1280px)").matches
                    ) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  {item.submenu && item.href ? (
                    <div className={styles.navControlGroup}>
                      <Link
                        href={item.href}
                        className={`${styles.navControl} ${isActive ? styles.active : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onFocus={() => setHoveredIndex(index)}
                        onClick={closeMenu}
                      >
                        <Icon className={styles.navIcon} size={16} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        className={`${styles.navControl} ${styles.dropdownToggle} ${isActive ? styles.active : ""}`}
                        aria-label={`${isOpen ? "Cerrar" : "Abrir"} submenú de ${item.label}`}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        onFocus={() => setHoveredIndex(index)}
                        onClick={() =>
                          setOpenDropdown((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                      >
                        <ChevronDown
                          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                          size={14}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ) : item.submenu ? (
                    <button
                      type="button"
                      className={`${styles.navControl} ${styles.dropdownTrigger} ${isActive ? styles.active : ""}`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-current={isActive ? "page" : undefined}
                      onFocus={() => setHoveredIndex(index)}
                      onClick={(event) => {
                        const pointerHover =
                          event.detail > 0 &&
                          window.matchMedia("(hover: hover) and (min-width: 1280px)").matches;
                        if (pointerHover) {
                          setOpenDropdown(item.id);
                          return;
                        }
                        setOpenDropdown((current) =>
                          current === item.id ? null : item.id,
                        );
                      }}
                    >
                      <Icon className={styles.navIcon} size={16} aria-hidden="true" />
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                        size={14}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href ?? "/"}
                      className={`${styles.navControl} ${isActive ? styles.active : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onFocus={() => setHoveredIndex(index)}
                      onClick={closeMenu}
                    >
                      <Icon className={styles.navIcon} size={16} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                  {item.submenu && (
                    <div
                      className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
                      aria-hidden={!isOpen}
                    >
                      {item.submenu.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={styles.dropdownLink}
                          tabIndex={isOpen ? 0 : -1}
                          onClick={closeMenu}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.actions}>
            <Link href="/contacto" className={styles.cta} onClick={closeMenu}>
              <span>Solicitar cotización</span>
              <ArrowUpRight className={styles.ctaArrow} size={17} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className={`theme-toggle ${styles.themeToggle}`}
              aria-label="Alternar tema claro u oscuro"
              title="Cambiar tema"
              onClick={() => {
                const root = document.documentElement;
                const nextTheme = root.classList.contains("dark") ? "light" : "dark";
                root.classList.toggle("dark", nextTheme === "dark");
                root.dataset.theme = nextTheme;
                try {
                  localStorage.setItem("webprols-theme", nextTheme);
                } catch (error) {
                  console.error("No se pudo guardar la preferencia de tema.", error);
                }
              }}
            >
              <Sun className="theme-icon-sun" size={18} aria-hidden="true" />
              <Moon className="theme-icon-moon" size={18} aria-hidden="true" />
            </button>
            <Link href="/admin/login" className={styles.panel} onClick={closeMenu}>
              <LayoutDashboard size={16} aria-hidden="true" />
              <span>Panel</span>
            </Link>
          </div>
        </nav>
      </div>
      <span ref={progressRef} aria-hidden="true" className={styles.progress} />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Brand light />
          <p>Diseño y desarrollo de sitios y sistemas web a medida para empresas que quieren crecer.</p>
        </div>
        <div>
          <h2>Explorar</h2>
          <Link href="/servicios">Servicios</Link>
          <Link href="/portafolio">Portafolio</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/metodologia">Metodología</Link>
        </div>
        <div>
          <h2>Soluciones</h2>
          <Link href="/sitios-web">Sitios web a medida</Link>
          <Link href="/sistemas-web">Sistemas web</Link>
          <Link href="/servicios">Tiendas online</Link>
          <Link href="/servicios">Integraciones</Link>
        </div>
        <div>
          <h2>Contacto</h2>
          <a href="https://wa.me/56979717705" target="_blank" rel="noreferrer"><MessageCircle size={16} /> +56 9 7971 7705</a>
          <a href="mailto:contacto@webprols.com"><Mail size={16} /> contacto@webprols.com</a>
          <span><MapPin size={16} /> Av. Mapocho, Quinta Normal, Santiago</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Web Pro LS. Todos los derechos reservados.</span>
        <Link href="/privacidad">Política de privacidad</Link>
      </div>
    </footer>
  );
}

export function PublicHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteHeader />;
}

export function PublicFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteFooter />;
}

export function PublicWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/56979717705"
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={27} />
    </a>
  );
}

