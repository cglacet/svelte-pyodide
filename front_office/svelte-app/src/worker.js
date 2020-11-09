const CACHE_VERSION = "0.0.1" + new Date();
const CACHE_NAME = `py-svelte-v${CACHE_VERSION}`;
const urlsToCache = [
  "/",
  "/index.html",
  "/global.css",
  "/build/bundle.css",
  "/build/bundle.js",
  "/ace-builds/src-noconflict/ace.js",
  "https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js",
  "https://pyodide-cdn2.iodide.io/v0.15.0/full/pandas.js",
  "https://pyodide-cdn2.iodide.io/v0.15.0/full/pytz.js",
  "https://pyodide-cdn2.iodide.io/v0.15.0/full/python-dateutil.js",
  "https://pyodide-cdn2.iodide.io/v0.15.0/full/numpy.js",
  "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700",
  "https://fonts.googleapis.com/css?family=Roboto+Mono",
];

self.addEventListener('install', function (event) {
    console.log(`Installing cache version ${CACHE_VERSION}`);
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
    self.skipWaiting();

    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {

    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Cache invalidation https://stackoverflow.com/a/33263837/1720199
                        console.log(`Deleting old cache ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    const url = new URL(event.request.url);
    const originDomain = event.target.location.origin;
    const cacheUrl = (url.hostname == CDN_DOMAIN)? new URL(originDomain + url.pathname): url;
    event.respondWith(
        caches.match(cacheUrl)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(cacheUrl)
                    .then(function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});