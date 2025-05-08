const CACHE_NAME = 'story-app-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.bundle.js',
  './app.css',
  './images/logo.png',
  './images/favicon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      return fetch(event.request).then((response) => {
        const clone = response.clone();

        // Cache gambar story dari server Dicoding
        if (event.request.url.includes('/images/stories/')) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }

        return response;
      }).catch(() => caches.match('./'));
    })
  );
});

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || 'Notifikasi Baru';
  const options = payload.options || {
    body: 'Isi notifikasi tidak tersedia',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
