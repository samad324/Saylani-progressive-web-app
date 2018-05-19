let dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-final-1';
var filesToCache = [
  '/',  
  '/index.html',
  '/css/foot.css',
  '/css/center.css',
  '/css/head.css',
  '/images/Haj-button.jpg',
  '/images/ilme-tauqeet.jpg',
  '/images/logo.jpg',
  '/images/logo2.jpg',
  '/images/logo3.jpg',
  '/images/paypal.jpg',
  '/images/Slogo.jpg',
  '/images/service-1.jpg',
  '/images/service-2.jpg',
  '/images/service-3.jpg',
  '/images/service-4.jpg',
  '/images/service-5.jpg',
  '/images/slide-1.jpg',
  '/images/slide-2.jpg',
  '/images/slide-3.jpg',
  '/images/slide-4.jpg',
  '/images/slide-5.jpg',
  '/images/slide-6.jpg',
  '/images/slider-2-1.jpg',
  '/images/slider-2-2.jpg',
  '/images/spacer.png',
  '/images/sprite.png',
  '/images/uk-donors.jpg',
  '/images/visa-mastercard.jpg',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-192x192.png' 
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
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
