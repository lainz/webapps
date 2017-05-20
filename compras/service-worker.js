var dataCacheName = 'comprasData-v1.6.1';
var cacheName = 'comprasPWA-final-1.6.1';
var filesToCache = [
  '/webapps/compras/',
  '/webapps/compras/index.html',
  '/webapps/compras/app.js',
  '/webapps/compras/icon.css',
  '/webapps/compras/material.indigo-pink.min.css',
  '/webapps/compras/material.min.js',
  '/webapps/compras/icon.woff2',
  '/webapps/compras/angular.min.js'
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
