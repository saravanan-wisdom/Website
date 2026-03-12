const CACHE_NAME = 'offline-cache-v2';
const OFFLINE_URL = 'offline.html';

// 1. Install & Force Update
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Fetches a fresh copy of offline.html from the server
      return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })
  );
  // Activates the new version immediately
  self.skipWaiting();
});

// 2. Cleanup: Delete old 'v1' cache folders
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Logic (Works with /contact, /support, etc.)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Only shows the cache if the network is completely down
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
