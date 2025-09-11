// Service Worker para mejorar la experiencia offline
const CACHE_NAME = "clash-royale-tournament-v1"
const urlsToCache = [
  "/",
  "/admin",
  "/admin-dashboard",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@400;600&display=swap",
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})
