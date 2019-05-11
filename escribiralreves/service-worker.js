var dataCacheName = 'revesData-v1.0.0';
var cacheName = 'revesPWA-v1.0.0';
var filesToCache = [
  '/webapps/escribiralreves/',
  '/webapps/escribiralreves/index.html',
  '/webapps/escribiralreves/css/app.css',
  '/webapps/escribiralreves/css/materialize.min.css',
  '/webapps/escribiralreves/js/app.js',
  '/webapps/escribiralreves/js/materialize.min.js',
  '/webapps/escribiralreves/js/vue.min.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
});
