// Construction d'une Content-Security-Policy et des en-têtes de sécurité associés.

export const DIRECTIVES = [
  { id: 'default-src', desc: 'Repli pour toutes les ressources non précisées.' },
  { id: 'script-src', desc: 'Scripts JavaScript.' },
  { id: 'style-src', desc: 'Feuilles de style et styles inline.' },
  { id: 'img-src', desc: 'Images.' },
  { id: 'font-src', desc: 'Polices.' },
  { id: 'connect-src', desc: 'fetch, XHR, WebSocket (appels d’API).' },
  { id: 'media-src', desc: 'Audio et vidéo.' },
  { id: 'frame-src', desc: 'Iframes chargées par la page.' },
  { id: 'worker-src', desc: 'Service workers et Web Workers.' },
  { id: 'manifest-src', desc: 'Manifeste PWA.' },
  { id: 'object-src', desc: '<object>, <embed> — à mettre à \'none\'.' },
  { id: 'base-uri', desc: 'Valeurs autorisées pour <base>.' },
  { id: 'form-action', desc: 'Cibles des formulaires.' },
  { id: 'frame-ancestors', desc: 'Qui peut afficher ta page dans une iframe (anti-clickjacking).', headerOnly: true },
];

export const PRESETS = {
  spa: {
    name: 'SPA statique (Vue, React…)',
    policy: {
      'default-src': "'self'",
      'script-src': "'self'",
      'style-src': "'self'",
      'img-src': "'self' data:",
      'font-src': "'self'",
      'connect-src': "'self'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'none'",
    },
  },
  api: {
    name: 'SPA + API sur un autre domaine',
    policy: {
      'default-src': "'self'",
      'script-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data: https:",
      'font-src': "'self'",
      'connect-src': "'self' https://api.exemple.fr",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'none'",
    },
  },
  strict: {
    name: 'Stricte avec nonce (rendu serveur)',
    policy: {
      'default-src': "'none'",
      'script-src': "'nonce-{RANDOM}' 'strict-dynamic'",
      'style-src': "'self'",
      'img-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'object-src': "'none'",
      'base-uri': "'none'",
      'form-action': "'self'",
      'frame-ancestors': "'none'",
    },
  },
};

export function buildPolicy(policy, { upgradeInsecure = false } = {}) {
  const parts = DIRECTIVES.filter((d) => (policy[d.id] || '').trim()).map((d) => `${d.id} ${policy[d.id].trim().replace(/\s+/g, ' ')}`);
  if (upgradeInsecure) parts.push('upgrade-insecure-requests');
  return parts.join('; ');
}

/** Remarques de sécurité sur la politique saisie. */
export function auditPolicy(policy) {
  const notes = [];
  const all = Object.values(policy).join(' ');
  if (/'unsafe-inline'/.test(policy['script-src'] || policy['default-src'] || '')) {
    notes.push({ level: 'error', text: "'unsafe-inline' dans script-src annule l’essentiel de la protection contre les XSS : préfère un nonce ou un hash." });
  }
  if (/'unsafe-eval'/.test(all)) notes.push({ level: 'warn', text: "'unsafe-eval' autorise eval() et new Function() : à éviter." });
  if (/(^|\s)\*(\s|$)/.test(policy['script-src'] || '') || /(^|\s)(https?:|\*)(\s|$)/.test(policy['script-src'] || '')) {
    notes.push({ level: 'error', text: 'script-src accepte n’importe quelle origine : un script injecté pourrait être chargé depuis un domaine malveillant.' });
  }
  if (!(policy['object-src'] || '').includes("'none'")) notes.push({ level: 'warn', text: "object-src devrait valoir 'none' (plugins obsolètes)." });
  if (!policy['base-uri']) notes.push({ level: 'warn', text: 'base-uri absent : une balise <base> injectée pourrait détourner les URL relatives.' });
  if (!policy['frame-ancestors']) notes.push({ level: 'info', text: "frame-ancestors absent : la page peut être affichée dans l'iframe d'un autre site (clickjacking)." });
  if (/'unsafe-inline'/.test(policy['style-src'] || '')) notes.push({ level: 'info', text: "'unsafe-inline' dans style-src est un compromis courant, beaucoup moins risqué que dans script-src." });
  return notes;
}

export const SECURITY_HEADERS = [
  { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains', desc: 'Impose HTTPS pendant un an (HSTS).' },
  { name: 'X-Content-Type-Options', value: 'nosniff', desc: 'Interdit au navigateur de deviner le type d’un fichier.' },
  { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', desc: 'Limite ce qui fuit dans l’en-tête Referer.' },
  { name: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()', desc: 'Coupe les API sensibles que le site n’utilise pas.' },
  { name: 'Cross-Origin-Opener-Policy', value: 'same-origin', desc: 'Isole la fenêtre des pages ouvertes par d’autres origines.' },
];

export function formatOutput(target, csp, extraHeaders) {
  const headers = [['Content-Security-Policy', csp], ...extraHeaders.map((h) => [h.name, h.value])];
  switch (target) {
    case 'nginx':
      return headers.map(([n, v]) => `add_header ${n} "${v}" always;`).join('\n');
    case 'apache':
      return ['<IfModule mod_headers.c>', ...headers.map(([n, v]) => `  Header always set ${n} "${v}"`), '</IfModule>'].join('\n');
    case 'netlify':
      return ['/*', ...headers.map(([n, v]) => `  ${n}: ${v}`)].join('\n');
    case 'meta': {
      // frame-ancestors, report-uri et sandbox sont ignorés dans une balise <meta>.
      const metaCsp = csp
        .split('; ')
        .filter((p) => !/^(frame-ancestors|report-uri|report-to|sandbox)\b/.test(p))
        .join('; ');
      return `<meta http-equiv="Content-Security-Policy" content="${metaCsp.replace(/"/g, '&quot;')}">`;
    }
    default:
      return headers.map(([n, v]) => `${n}: ${v}`).join('\n');
  }
}
