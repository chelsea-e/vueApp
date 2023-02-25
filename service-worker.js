var cacheName = "webstore-v1";
var cacheFiles = [
    "index.html",
    "app.js",
    "style.css",
    "images/english.jpg",
    "images/biology.jpg",
    "images/chemistry.jpg",
    "images/hospitality.jpg",
    "images/geography.jpg",
    "images/law.jpg",
    "images/math.jpg",
    "images/literature.jpg",
    "images/nutrition.jpg",
    "images/physics.jpg"
];

self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching all the files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondwith(
        caches.match(e.request).then(function (cachedFile) {
            //download the file if it is not in the cache 
            if (cachedFile) {
                console.log(" [Service Worker] Resource fetched from the cache for: " + e.request.url);

                return cachedFile;

            } else {
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for:" + e.request.url);

                        return response;
                    });
                });
            }
        })
    );
});