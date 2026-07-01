const CACHE_NAME = 'range-camera-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
  './favicon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forces the SW to install immediately
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()); // Forces the SW to take control of the page immediately
  
  // This deletes any old, broken caches (like v1)
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
