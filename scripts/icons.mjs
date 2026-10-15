// Régénère src/lib/icons.js à partir de lucide-static (licence ISC).
//
//   npm run icons
//
// Le script parcourt src/ pour trouver les icônes utilisées (`icon: 'nom'` en JS,
// `icon: nom` en YAML / front matter, `<Icon name="nom">` dans les templates) et
// n'embarque que celles-là. Ajouter une icône = l'utiliser quelque part, puis relancer.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'src');
const lucide = path.join(root, 'node_modules/lucide-static/icons');

// Icônes utilisées par des noms construits dynamiquement.
const EXTRA = ['sun', 'moon', 'check', 'copy', 'x', 'chevron-down', 'circle-check', 'circle-x', 'triangle-alert', 'info', 'lightbulb'];

// Marques (absentes de Lucide) : tracé plein, viewBox 24×24.
const BRANDS = {
  github:
    '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
};

const PATTERNS = [
  /\bicon:\s*['"]([a-z0-9-]+)['"]/g,
  /^\s*icon:\s*([a-z0-9-]+)\s*$/gm,
  /<Icon[^>]*?\sname="([a-z0-9-]+)"/g,
  /\bicon="([a-z0-9-]+)"/g,
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return /\.(vue|js|md|ya?ml)$/.test(e.name) && e.name !== 'icons.js' ? [full] : [];
  });
}

const names = new Set(EXTRA);
for (const file of walk(src)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of PATTERNS) for (const m of text.matchAll(pattern)) names.add(m[1]);
}

const icons = {};
const missing = [];
for (const name of [...names].sort()) {
  if (BRANDS[name]) {
    icons[name] = BRANDS[name];
    continue;
  }
  const file = path.join(lucide, `${name}.svg`);
  if (!fs.existsSync(file)) {
    missing.push(name);
    continue;
  }
  const svg = fs.readFileSync(file, 'utf8');
  icons[name] = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/\s*\n\s*/g, '')
    .trim();
}

const body = Object.entries(icons)
  .map(([name, markup]) => `  ${JSON.stringify(name)}: ${JSON.stringify(markup)},`)
  .join('\n');
fs.writeFileSync(
  path.join(src, 'lib/icons.js'),
  `// Généré par scripts/icons.mjs depuis lucide-static (ISC) — ne pas modifier à la main.\n// Contenu intérieur de chaque icône 24×24 ; les marques (github) sont des tracés pleins.\nexport const FILLED = new Set(${JSON.stringify(Object.keys(BRANDS))});\n\nexport default {\n${body}\n};\n`,
);
console.log(`${Object.keys(icons).length} icônes écrites dans src/lib/icons.js`);
if (missing.length) {
  console.error(`Icônes introuvables dans lucide-static : ${missing.join(', ')}`);
  process.exitCode = 1;
}
