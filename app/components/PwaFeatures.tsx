"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Download, Share, WifiOff, X } from "lucide-react";
import styles from "./PwaFeatures.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "webprols-pwa-install-dismissed";
const DISMISSED_EVENT = "webprols-pwa-install-dismissed";
let dismissedPreference: boolean | null = null;
let installedDuringSession = false;

function subscribeToNetwork(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function subscribeToPwaEnvironment(callback: () => void) {
  const displayMode = window.matchMedia("(display-mode: standalone)");
  const handleInstalled = () => {
    installedDuringSession = true;
    callback();
  };
  displayMode.addEventListener("change", callback);
  window.addEventListener("appinstalled", handleInstalled);
  return () => {
    displayMode.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", handleInstalled);
  };
}

function subscribeToDismissedPreference(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== DISMISSED_KEY && event.key !== null) return;
    dismissedPreference = event.key === null ? false : event.newValue === "true";
    callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(DISMISSED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DISMISSED_EVENT, callback);
  };
}

function isOnline() {
  return navigator.onLine;
}

function getPwaEnvironment() {
  if (installedDuringSession || isStandalone()) return "installed";
  return isIosSafari() ? "ios-safari" : "other";
}

function getDismissedPreference() {
  if (dismissedPreference !== null) return dismissedPreference;
  try {
    dismissedPreference = window.localStorage.getItem(DISMISSED_KEY) === "true";
  } catch (error) {
    console.warn("No se pudo leer la preferencia del aviso de instalación.", error);
    dismissedPreference = false;
  }
  return dismissedPreference;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

function isIosSafari() {
  const userAgent = navigator.userAgent;
  const isIos =
    /iPhone|iPad|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIos && /Safari/.test(userAgent) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/.test(userAgent);
}

export function PwaFeatures() {
  const pathname = usePathname();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const online = useSyncExternalStore(subscribeToNetwork, isOnline, () => true);
  const pwaEnvironment = useSyncExternalStore(
    subscribeToPwaEnvironment,
    getPwaEnvironment,
    () => "other",
  );
  const dismissed = useSyncExternalStore(
    subscribeToDismissedPreference,
    getDismissedPreference,
    () => false,
  );
  const installed = pwaEnvironment === "installed";
  const iosInstallAvailable = pwaEnvironment === "ios-safari";
  const iosTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if ("serviceWorker" in navigator) {
      const register = () => {
        void navigator.serviceWorker
          .register("/sw.js", { scope: "/", updateViaCache: "none" })
          .catch((error: unknown) => {
            console.error("No se pudo registrar el service worker de Web Pro LS.", error);
          });
      };

      if (document.readyState === "complete") {
        register();
      } else {
        window.addEventListener("load", register, { once: true });
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
        window.removeEventListener("appinstalled", handleInstalled);
        window.removeEventListener("load", register);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!showIosInstructions) return;
    const iosTrigger = iosTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowIosInstructions(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      iosTrigger?.focus();
    };
  }, [showIosInstructions]);

  useEffect(() => {
    if (online) return;
    const navigateToCachedPage = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        return;
      }
      event.preventDefault();
      window.location.assign(destination.href);
    };

    document.addEventListener("click", navigateToCachedPage, true);
    return () => document.removeEventListener("click", navigateToCachedPage, true);
  }, [online]);

  function dismissInstallPrompt() {
    dismissedPreference = true;
    try {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch (error) {
      console.warn("No se pudo guardar la preferencia del aviso de instalación.", error);
    }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  async function promptInstall() {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        installedDuringSession = true;
        window.dispatchEvent(new Event("appinstalled"));
      } else {
        dismissInstallPrompt();
      }
    } catch (error) {
      console.error("No se pudo iniciar la instalación de Web Pro LS.", error);
    }
  }

  const isPublicPage = !pathname.startsWith("/admin");
  const canInstall = Boolean(installPrompt || iosInstallAvailable);

  return (
    <>
      {!online && (
        <div className={styles.offlineNotice} role="status" aria-live="polite">
          <WifiOff size={18} aria-hidden="true" />
          <span>
            Sin conexión. El contenido guardado puede estar desactualizado; el portafolio, el panel
            y los envíos requieren Internet.
          </span>
        </div>
      )}
      {isPublicPage && online && !installed && canInstall && !dismissed && (
        <aside className={styles.installPrompt} aria-label="Instalar Web Pro LS">
          <div className={styles.installCopy}>
            <Download size={19} aria-hidden="true" />
            <span>Instala Web Pro LS en tu dispositivo.</span>
          </div>
          {installPrompt ? (
            <button type="button" className={styles.installButton} onClick={() => void promptInstall()}>
              Instalar
            </button>
          ) : (
            <button
              ref={iosTriggerRef}
              type="button"
              className={styles.installButton}
              onClick={() => setShowIosInstructions(true)}
            >
              Cómo instalar
            </button>
          )}
          <button
            type="button"
            className={styles.dismissButton}
            aria-label="Ocultar aviso de instalación"
            onClick={dismissInstallPrompt}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </aside>
      )}
      {showIosInstructions && (
        <div
          className={styles.dialogBackdrop}
          role="presentation"
          onClick={() => setShowIosInstructions(false)}
        >
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-ios-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={dialogCloseRef}
              type="button"
              className={styles.dismissButton}
              aria-label="Cerrar instrucciones"
              onClick={() => setShowIosInstructions(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h2 id="pwa-ios-title">Añadir Web Pro LS a inicio</h2>
            <p>
              En Safari, toca <Share size={16} aria-label="Compartir" /> <strong>Compartir</strong>,
              selecciona <strong>Añadir a pantalla de inicio</strong> y confirma con{" "}
              <strong>Añadir</strong>.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
