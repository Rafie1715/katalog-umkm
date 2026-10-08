const CACHE_NAME = "katalog-umkm-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Hanya tangani request HTTP/HTTPS GET dari domain yang sama
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // 2. JANGAN PERNAH cache rute admin, autentikasi, Server Actions, atau API
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api") ||
    request.headers.get("x-action") ||
    request.headers.get("next-action")
  ) {
    return;
  }

  // 3. Untuk navigasi halaman (HTML document) seperti katalog / dan detail produk:
  // Selalu ambil dari jaringan agar harga dan produk selalu terkini (tidak tertahan cache).
  // Jika offline, berikan halaman fallback offline generik.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (
          (await cache.match(OFFLINE_URL)) ||
          new Response("Anda sedang offline.", {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          })
        );
      })
    );
    return;
  }

  // 4. Untuk aset statis pre-cache (ikon, halaman offline)
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/offline.html"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

