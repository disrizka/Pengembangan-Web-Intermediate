const CACHE_NAME = 'story-app-cache-v2';
const FALLBACK_IMAGE = './images/logo.png';

const STATIC_ASSETS = [
  './',
  './index.html',
  './app.bundle.js',
  './app.css',
  FALLBACK_IMAGE,
  './images/favicon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
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
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      return fetch(event.request).then((res) => {
        const resClone = res.clone();

        // Cache gambar story
        if (event.request.url.includes('/images/stories/')) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }

        return res;
      }).catch(() => {
        if (event.request.destination === 'image') {
          return caches.match(FALLBACK_IMAGE);
        }

        return caches.match('./');
      });
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
