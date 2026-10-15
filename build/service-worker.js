// Plugin Vite : écrit docs/sw.js après le build.
//
// Le nom du cache contient une empreinte du build : chaque déploiement crée un cache neuf
// et l'activation supprime les anciens. Tous les fichiers du build sont pré-cachés à
// l'installation, si bien que l'application entière (outils, leçons, fiches) fonctionne
// hors-ligne dès la première visite, et pas seulement les pages déjà ouvertes.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SKIP = new Set(['sw.js', '.nojekyll', 'robots.txt']);

function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full, base) : [path.relative(base, full).replace(/\\/g, '/')];
  });
}

function template(version, files) {
  return `// Généré par build/service-worker.js — ne pas modifier à la main.
const CACHE = 'devtoolbox-${version}';
const PRECACHE = ${JSON.stringify(files, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))),
  );
});

// Pas d'activation automatique : la page affiche « Nouvelle version disponible » et
// envoie SKIP_WAITING quand l'utilisateur choisit de recharger. Les anciens fichiers
// restent ainsi disponibles tant qu'une page de l'ancienne version est ouverte.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('devtoolbox') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // API Anthropic & co : jamais interceptées

  if (request.mode === 'navigate') {
    // Routage par hash : toute navigation sert le même index.html, pris dans le cache.
    event.respondWith(
      caches
        .match('./index.html')
        .then((cached) => cached || fetch(request))
        .catch(() => Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.ok && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => Response.error()),
    ),
  );
});
`;
}

export default function serviceWorker() {
  let outDir;
  return {
    name: 'devtoolbox-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files = walk(outDir)
        .filter((f) => !SKIP.has(f) && !f.endsWith('.map'))
        .sort();
      const hash = crypto.createHash('sha256');
      for (const f of files) {
        hash.update(f);
        hash.update(fs.readFileSync(path.join(outDir, f)));
      }
      const version = hash.digest('hex').slice(0, 12);
      fs.writeFileSync(path.join(outDir, 'sw.js'), template(version, files.map((f) => `./${f}`)));
      this.info?.(`sw.js : ${files.length} fichiers pré-cachés, version ${version}`);
    },
  };
}
