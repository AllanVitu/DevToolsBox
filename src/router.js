import { createRouter, createWebHashHistory } from 'vue-router';
import { TOOLS, getTool } from '@/data/tools';
import { getLesson } from '@/data/lessons';
import { getCheatsheet } from '@/data/cheatsheets';
import { getFamily } from '@/data/families';
import { addRecent } from '@/composables/useFavorites';

// Routage par hash (#/json, #/apprendre/git…) : GitHub Pages ne sait pas rediriger les
// URL inconnues vers index.html, le hash garantit que tout lien profond fonctionne.
const routes = [
  { path: '/', name: 'landing', component: () => import('@/pages/Landing.vue'), meta: { title: '', section: 'home' } },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard.vue'), meta: { title: 'Tableau de bord', section: 'dashboard' } },
  { path: '/outils', name: 'tools', component: () => import('@/pages/ToolsIndex.vue'), meta: { title: 'Outils', section: 'tools' } },
  {
    path: '/outils/:family',
    name: 'family',
    component: () => import('@/pages/ToolsIndex.vue'),
    meta: { section: 'tools' },
    beforeEnter: (to) => (getFamily(to.params.family) ? true : { name: 'tools' }),
  },
  // Anciennes sections (v1/v2) : les liens existants restent valides.
  { path: '/code', redirect: '/outils' },
  { path: '/web', redirect: '/outils' },
  { path: '/database', redirect: '/outils/data' },
  { path: '/ai', name: 'ai', component: () => import('@/pages/AiAssistant.vue'), meta: { title: 'Assistant IA', section: 'ai' } },
  { path: '/apprendre', name: 'lessons', component: () => import('@/pages/LessonsIndex.vue'), meta: { title: 'Apprendre', section: 'learn' } },
  { path: '/apprendre/:id', name: 'lesson', component: () => import('@/pages/LessonView.vue'), meta: { section: 'learn' } },
  { path: '/aide-memoire', name: 'cheatsheets', component: () => import('@/pages/CheatsheetsIndex.vue'), meta: { title: 'Aide-mémoire', section: 'cheats' } },
  { path: '/aide-memoire/:id', name: 'cheatsheet', component: () => import('@/pages/CheatsheetView.vue'), meta: { section: 'cheats' } },
  { path: '/snippets', name: 'snippets', component: () => import('@/pages/Snippets.vue'), meta: { title: 'Snippets', section: 'snippets' } },
  { path: '/confidentialite', name: 'privacy', component: () => import('@/pages/Privacy.vue'), meta: { title: 'Confidentialité & mentions', section: 'about' } },
  ...TOOLS.map((tool) => ({
    path: `/${tool.id}`,
    name: tool.id,
    component: tool.component,
    meta: { title: tool.name, section: 'tools', tool: tool.id },
  })),
  { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('@/pages/NotFound.vue'), meta: { title: 'Page introuvable' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash && to.hash.startsWith('#') && !to.hash.startsWith('#/')) return { el: to.hash, top: 90 };
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});

router.afterEach((to) => {
  let title = to.meta.title;
  if (to.meta.tool) addRecent('tool', to.meta.tool);
  if (to.name === 'lesson') {
    const lesson = getLesson(to.params.id);
    if (lesson) addRecent('lesson', lesson.id);
    title = lesson ? lesson.title : 'Leçon introuvable';
  } else if (to.name === 'cheatsheet') {
    const sheet = getCheatsheet(to.params.id);
    if (sheet) addRecent('cheatsheet', sheet.id);
    title = sheet ? `Aide-mémoire · ${sheet.title}` : 'Fiche introuvable';
  } else if (to.name === 'family') {
    title = getFamily(to.params.family)?.name ?? 'Outils';
  }
  document.title = title ? `${title} · DevToolbox` : 'DevToolbox — boîte à outils développeur';
});

export { getTool };
export default router;
