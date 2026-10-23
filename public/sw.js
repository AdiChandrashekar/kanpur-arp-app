// Offline support. Network first, so new data always shows when there is signal;
// the saved copy is used when there isn't. Covers this app's own files and the
// Kanpur Nagar data it reads from the ARP dashboard's site.
// Prefix differs from the Basti app (same web address), so neither deletes the other's cache.
const CACHE = 'arp-kanpur-v1'
const DATA = /\/arp-ssp-dashboard\/data\/(index\.json|districts\/kanpur-nagar\.json)$/

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('arp-kanpur-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  const ours = req.url.startsWith(self.registration.scope)
  if (req.method !== 'GET' || !(ours || DATA.test(url.pathname))) return
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
      // ignoreSearch/ignoreVary: the page asks for data with cache: 'no-cache'
      .catch(() => caches.match(req, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || Promise.reject(new Error('offline')))),
  )
})
