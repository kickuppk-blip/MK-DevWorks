/* MK DevWorks — Service Worker / PWA */
const CACHE = 'mkdw-v3';
const ASSETS = ['/', '/index.html', '/css/style.css', '/js/main.js', '/assets/favicon.svg'];
self.addEventListener('install',  e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))));
