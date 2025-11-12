self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('bh-portfolio-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/assets/css/styles.css',
        '/assets/js/main.js',
        '/manifest.webmanifest',
        '/assets/icons/icon-192.svg',
        '/assets/icons/icon-512.svg',
        '/blog.html'
      ]).catch(() => null)
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== 'bh-portfolio-v1').map((k) => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Don't cache non-GET requests
  if (req.method !== 'GET') {
    return;
  }

  // Network-first for HTML navigation
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open('bh-portfolio-v1').then((cache) => cache.put(req, clone)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((res) => res || caches.match('/index.html')).catch(() => {}))
    );
    return;
  }

  // Cache-first for static assets
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const clone = res.clone();
        caches.open('bh-portfolio-v1').then((cache) => cache.put(req, clone)).catch(() => {});
        return res;
      }))
    );
  }
});
