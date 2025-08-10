const CACHE = 'bw-landing-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css?v=4',
  '/script.js?v=4',
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
  const url = new URL(req.url);
  const isStatic = url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || req.mode === 'navigate';
  if (isStatic) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
