import { computed, ref } from 'vue';
import { readJSON, writeJSON } from '@/lib/storage';

// Tuiles du tableau de bord : l'utilisateur peut les masquer et les réordonner.
export const WIDGETS = [
  { id: 'stats', name: 'Chiffres clés' },
  { id: 'favorites', name: 'Favoris' },
  { id: 'recents', name: 'Récemment ouverts' },
  { id: 'progress', name: 'Progression' },
  { id: 'families', name: 'Familles d’outils' },
  { id: 'ai', name: 'Assistant IA' },
  { id: 'news', name: 'Nouveautés' },
  { id: 'tip', name: 'Astuce' },
];

// Identifiants des versions précédentes.
const LEGACY = { sections: 'families' };

function normalize(stored) {
  const byId = new Map();
  (Array.isArray(stored) ? stored : []).forEach((w) => {
    if (!w || !w.id) return;
    byId.set(LEGACY[w.id] || w.id, w);
  });
  return WIDGETS.map((w, index) => {
    const saved = byId.get(w.id);
    return { id: w.id, visible: saved ? saved.visible !== false : true, order: saved?.order ?? index + 0.5 };
  })
    .sort((a, b) => a.order - b.order)
    .map((w, index) => ({ ...w, order: index }));
}

const widgets = ref(normalize(readJSON('dash:widgets', [])));
const editMode = ref(false);

function save() {
  writeJSON('dash:widgets', widgets.value);
}

export function useDashboard() {
  const sorted = computed(() => [...widgets.value].sort((a, b) => a.order - b.order));
  const visible = computed(() => sorted.value.filter((w) => w.visible));
  const hidden = computed(() => sorted.value.filter((w) => !w.visible));

  function toggle(id) {
    const w = widgets.value.find((x) => x.id === id);
    if (!w) return;
    w.visible = !w.visible;
    save();
  }

  function move(id, step) {
    const list = sorted.value.filter((w) => w.visible);
    const from = list.findIndex((w) => w.id === id);
    const to = from + step;
    if (from === -1 || to < 0 || to >= list.length) return;
    const a = list[from];
    const b = list[to];
    [a.order, b.order] = [b.order, a.order];
    save();
  }

  function reset() {
    widgets.value = WIDGETS.map((w, index) => ({ id: w.id, visible: true, order: index }));
    save();
  }

  const nameOf = (id) => WIDGETS.find((w) => w.id === id)?.name ?? id;

  return { widgets, visible, hidden, editMode, toggle, move, reset, nameOf };
}
