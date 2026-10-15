// Aide-mémoire : fichiers YAML (src/content/cheatsheets) convertis au build.

export const CHEAT_CATEGORIES = [
  { id: 'cli', name: 'Terminal & Git', icon: 'terminal', accent: 'indigo' },
  { id: 'web', name: 'Web & CSS', icon: 'globe', accent: 'violet' },
  { id: 'data', name: 'Données & back-end', icon: 'database', accent: 'sky' },
  { id: 'devops', name: 'DevOps & serveurs', icon: 'server', accent: 'teal' },
  { id: 'prod', name: 'Outillage & productivité', icon: 'zap', accent: 'amber' },
  { id: 'jeu', name: 'Jeu', icon: 'gamepad-2', accent: 'lime' },
];

const metaModules = import.meta.glob('../content/cheatsheets/*.yaml', { eager: true, query: '?meta', import: 'default' });
const loaders = import.meta.glob('../content/cheatsheets/*.yaml', { import: 'default' });

const catIndex = (id) => CHEAT_CATEGORIES.findIndex((c) => c.id === id);

export const CHEATSHEETS = Object.values(metaModules).sort(
  (a, b) => catIndex(a.category) - catIndex(b.category) || a.title.localeCompare(b.title, 'fr'),
);

export function getCheatsheet(id) {
  return CHEATSHEETS.find((c) => c.id === id) || null;
}

export function loadCheatsheet(id) {
  const loader = loaders[`../content/cheatsheets/${id}.yaml`];
  return loader ? loader() : Promise.resolve(null);
}
