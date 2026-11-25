import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { PublicFooter, PublicHeader, PublicWhatsApp } from "./components/SiteChrome";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { PwaFeatures } from "./components/PwaFeatures";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webprols.com"),
  title: "Sitios y Sistemas Web a Medida en Chile | Web Pro LS",
  description:
    "Web Pro LS desarrolla sitios web profesionales, sistemas web personalizados, tiendas online y soluciones digitales a medida para empresas y emprendedores en Chile.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Web Pro LS",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Sitios y Sistemas Web a Medida | Web Pro LS",
    description:
      "Soluciones digitales profesionales y personalizadas para hacer crecer tu negocio.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07182f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <Script id="webprols-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("webprols-theme");if(t==="dark"||t==="light"){var r=document.documentElement;r.setAttribute("data-theme",t);r.classList.toggle("dark",t==="dark")}}catch(e){}})()`}
        </Script>
      </head>
      <body className="min-h-full">
        <Suspense fallback={null}>
          <PwaFeatures />
        </Suspense>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <PublicHeader />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <PublicWhatsApp />
        </Suspense>
        <Suspense fallback={null}>
          <PublicFooter />
        </Suspense>
      </body>
    </html>
  );
}
