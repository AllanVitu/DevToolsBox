// Les leçons sont des fichiers Markdown (src/content/lessons). Le plugin de build
// (build/content.js) les convertit : ici on importe leurs seules métadonnées, et le
// contenu complet de chaque leçon devient un petit fichier chargé à l'ouverture.

export const TRACKS = [
  { id: 'bases', name: 'Les bases du code', icon: 'code', accent: 'indigo', desc: 'Structurer, écrire, versionner et tester son code.' },
  { id: 'front', name: 'Front-end', icon: 'layout-grid', accent: 'violet', desc: 'Vue 3, CSS moderne, thèmes, performance et PWA.' },
  { id: 'back', name: 'Back-end & données', icon: 'database', accent: 'sky', desc: 'PHP, API REST, SQL, PostgreSQL et Laravel.' },
  { id: 'securite', name: 'Sécurité', icon: 'shield', accent: 'rose', desc: 'Protéger une application, ses comptes et les données.' },
  { id: 'devops', name: 'DevOps & systèmes', icon: 'server', accent: 'teal', desc: 'Terminal, réseau, Docker, Nginx, déploiement, scripts.' },
  { id: 'creatif', name: 'Créatif : 3D, bureau & jeu', icon: 'box', accent: 'amber', desc: 'Three.js, Electron, Unity et Minecraft.' },
];

const metaModules = import.meta.glob('../content/lessons/*.md', { eager: true, query: '?meta', import: 'default' });
const loaders = import.meta.glob('../content/lessons/*.md', { import: 'default' });

const trackIndex = (id) => TRACKS.findIndex((t) => t.id === id);

export const LESSONS = Object.values(metaModules)
  .sort((a, b) => trackIndex(a.track) - trackIndex(b.track) || a.order - b.order || a.title.localeCompare(b.title))
  .map((lesson, index) => ({ ...lesson, number: index + 1 }));

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

export function loadLesson(id) {
  const loader = loaders[`../content/lessons/${id}.md`];
  return loader ? loader() : Promise.resolve(null);
}

export function lessonsOfTrack(trackId) {
  return LESSONS.filter((l) => l.track === trackId);
}

/** Leçons qui renvoient vers un outil donné (champ `tools` du front matter). */
export function lessonsForTool(toolId) {
  return LESSONS.filter((l) => l.tools.includes(toolId));
}
