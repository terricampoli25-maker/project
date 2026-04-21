/* ---------------------------------------------------
   SERVICE WORKER — Habit Tracker PWA
--------------------------------------------------- */

const CACHE_NAME = "habit-tracker-v1";

const FILES_TO_CACHE = [
    "/habit_tracker_new.html",
    "/style_new_v2.css",
    "/app_new.js",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/chime.mp3",
    "/uncheck.mp3"
];

/* Install — cache all files */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

/* Activate — clean up old caches */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

/* Fetch — serve from cache, fall back to network */
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});