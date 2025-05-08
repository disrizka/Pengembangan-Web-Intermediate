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

// ✅ Install: Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ✅ Activate: Bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedRes) =>
      cachedRes || fetch(event.request).catch(() => caches.match('./'))
    )
  );
});

// ✅ Push Notification dari server Dicoding
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
