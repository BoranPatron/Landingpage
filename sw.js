const CACHE = 'bw-landing-v6';
const ORIGIN = self.location.origin;
const ASSETS = [
  '/',
  '/index.html',
  '/thanks.html',
  '/styles.css',
  '/script.js',
  '/config.js',
  '/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first für HTML/CSS/JS in Dev
self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Cache nur für GET; niemals POST/PUT/etc. cachen
  if (req.method !== 'GET') {
    return; // Browser übernimmt
  }

  const url = new URL(req.url);
  const isSameOrigin = url.origin === ORIGIN;
  const isNavigate = req.mode === 'navigate';
  const isStaticAsset = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico'].some(ext => url.pathname.endsWith(ext));

  // Navigationsanfragen: Network-first, Fallback auf Cache/Index
  if (isNavigate) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('/index.html', copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Statische Same-Origin Assets: Stale-while-revalidate
  if (isSameOrigin && isStaticAsset) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          const copy = networkRes.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Für alles andere: einfach durchreichen (keine Cache-Manipulation), um MIME-Mismatches zu vermeiden
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
