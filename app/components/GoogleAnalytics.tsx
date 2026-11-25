"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const GA_MEASUREMENT_ID = "G-MZD19EGP7C";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const latestPathname = useRef(pathname);

  const trackPageView = useCallback((path: string) => {
    if (isAdminPath(path)) {
      lastTrackedPath.current = null;
      return;
    }
    if (!window.gtag || lastTrackedPath.current === path) return;

    lastTrackedPath.current = path;
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, []);

  useEffect(() => {
    latestPathname.current = pathname;
    trackPageView(pathname);
  }, [pathname, trackPageView]);

  if (isAdminPath(pathname)) return null;

  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onReady={() => trackPageView(latestPathname.current)}
        onError={(error) => console.error("No se pudo cargar Google Analytics.", error)}
      />
    </>
  );
}
