const CACHE_NAME = "rotadireta-v4";

const ARQUIVOS_PARA_CACHE = [
  "index.html",
  "resultado.html",
  "style.css",
  "index.js",
  "resultado.js",
  "manifest.json",
  "logo.png",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves.map((chave) => {
          if (chave !== CACHE_NAME) {
            return caches.delete(chave);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      return respostaCache || fetch(evento.request);
    })
  );
});