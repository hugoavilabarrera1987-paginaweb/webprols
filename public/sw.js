const CACHE_VERSION = "v1";
const STATIC_CACHE = `webprols-static-${CACHE_VERSION}`;
const PAGE_CACHE = `webprols-pages-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];
const STATIC_PUBLIC_PAGES = new Set([
  "/",
  "/servicios",
  "/sitios-web",
  "/sistemas-web",
  "/nosotros",
  "/metodologia",
  "/blog",
  "/contacto",
  "/privacidad",
]);
const CACHE_PREFIX = "webprols-";

function isPublicPage(url) {
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  return (
    !url.search &&
    (STATIC_PUBLIC_PAGES.has(pathname) ||
      /^\/soluciones\/[a-z0-9-]+$/i.test(pathname))
  );
}

function canCacheResponse(response) {
  const cacheControl = response.headers.get("cache-control") ?? "";
  return (
    !/(?:^|,)\s*(?:private|no-store)\b/i.test(cacheControl) &&
    !response.headers.has("set-cookie")
  );
}

async function cacheNextAssetsFromHome() {
  const homeResponse = await fetch("/", { cache: "reload" });
  if (!homeResponse.ok || !homeResponse.headers.get("content-type")?.includes("text/html")) {
    throw new Error(`No se pudo precargar la página principal: ${homeResponse.status}`);
  }

  await storeResponse(PAGE_CACHE, "/", homeResponse, 30);
  const html = await homeResponse.text();
  const assetUrls = new Set();
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const asset = new URL(match[1], self.location.origin);
    if (asset.origin === self.location.origin && asset.pathname.startsWith("/_next/static/")) {
      assetUrls.add(asset.href);
    }
  }

  if (self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1") {
    return;
  }

  const staticCache = await caches.open(STATIC_CACHE);
  const results = await Promise.allSettled(
    [...assetUrls].map(async (url) => {
      const response = await fetch(url, { cache: "reload" });
      if (!response.ok) throw new Error(`No se pudo precargar ${url}: ${response.status}`);
      await staticCache.put(url, response);
    }),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      console.warn("No se pudo guardar un recurso estático para uso sin conexión.", result.reason);
    }
  }
}

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  while (keys.length > limit) {
    await cache.delete(keys.shift());
  }
}

async function storeResponse(cacheName, request, response, limit) {
  if (!canCacheResponse(response)) return;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    await trimCache(cacheName, limit);
  } catch (error) {
    console.warn("No se pudo actualizar la caché local de Web Pro LS.", error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(PRECACHE_ASSETS);
      try {
        await cacheNextAssetsFromHome();
      } catch (error) {
        console.warn("No se pudo precargar la página inicial para uso sin conexión.", error);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, PAGE_CACHE].includes(name))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (/^\/(?:admin|api|auth)(?:\/|$)/.test(url.pathname)) {
    if (request.mode !== "navigate") return;
    event.respondWith(
      fetch(request).catch(async (error) => {
        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) return offlinePage;
        throw error;
      }),
    );
    return;
  }
  if (request.headers.has("authorization") || request.cache === "no-store") return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok && isPublicPage(url) && response.headers.get("content-type")?.includes("text/html")) {
            await storeResponse(PAGE_CACHE, url.href, response, 30);
          }
          return response;
        } catch (error) {
          if (isPublicPage(url) && self.navigator.onLine === false) {
            const cachedPage = await caches.match(url.href);
            if (cachedPage) return cachedPage;
          }
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
          throw error;
        }
      })(),
    );
    return;
  }

  if (url.search) return;
  const isNextStaticAsset = url.pathname.startsWith("/_next/static/");
  const isLocalDevelopment =
    self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";
  if (isNextStaticAsset && isLocalDevelopment) return;
  const isPublicAsset =
    isNextStaticAsset ||
    /\.(?:avif|css|gif|ico|jpe?g|js|png|svg|webp|woff2?)$/i.test(url.pathname);
  if (!isPublicAsset) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResponse = await cache.match(url.href);
      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);
      if (response.ok) await storeResponse(STATIC_CACHE, url.href, response, 100);
      return response;
    })(),
  );
});
