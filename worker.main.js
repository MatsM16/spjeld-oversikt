const preCacheName = "precache-v1";
const preCache = [
    // Pages
    "./", "index.html",
    "auth.html",

    // Styles
    "styles/common.css",
    "styles/page.auth.css",
    "styles/page.index.css",

    // Scripts
    "scripts/app.js",
    "scripts/event.app.js",
    "scripts/page.auth.js",
    "scripts/page.index.js",
    "scripts/service.database.js",
    "scripts/service.person.js",
    "scripts/service.servicecollection.js",
    "scripts/service.slots.js",
    "scripts/service.user.js",
    "scripts/shared.action.js",
    
    // Google
    // "https://fonts.googleapis.com/css2?family=Rubik&display=swap",
    // "https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js",
    // "https://www.gstatic.com/firebasejs/8.5.0/firebase-database.js"
]

self.addEventListener("install", event =>
{
    event.waitUntil(
        caches.open(preCacheName)
            .then(cache => cache.addAll(preCache))
            .then(self.skipWaiting())
    )
})

self.addEventListener("activate", event =>
{
    event.waitUntil(
        caches.keys()
        .then(names => names.filter(name => name !== preCacheName))
        .then(toDelete => toDelete.map(name => caches.delete(name)))
        .then(deletion => Promise.all(deletion))
        .then(self.clients.claim())
    )
})

self.addEventListener("fetch", event => 
{
    event.respondWith(fetch(event.request))
    // event.respondWith(
    //     caches.match(event.request)
    //     .then(found => found ? found : fetch(event.request))
    // )
})