<script setup>
import { computed, nextTick, ref, toRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from './Icon.vue';
import { TOOLS, getTool } from '@/data/tools';
import { LESSONS } from '@/data/lessons';
import { CHEATSHEETS } from '@/data/cheatsheets';
import { FAMILIES } from '@/data/families';
import { useTheme } from '@/composables/useTheme';
import { useFavorites } from '@/composables/useFavorites';
import { useFocusTrap } from '@/composables/useFocusTrap';
import { rank } from '@/lib/search';
import { clearToolKeys } from '@/lib/storage';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close', 'open-settings']);

const router = useRouter();
const route = useRoute();
const { theme, toggle } = useTheme();
const { recents } = useFavorites();
const dialog = useFocusTrap(toRef(props, 'open'), () => emit('close'));

const query = ref('');
const active = ref(0);
const input = ref(null);
const list = ref(null);

const ITEMS = [
  ...TOOLS.map((t) => ({ key: `tool-${t.id}`, kind: 'Outil', icon: t.icon, name: t.name, desc: t.desc, keywords: t.keywords, path: `/${t.id}` })),
  ...LESSONS.map((l) => ({ key: `lesson-${l.id}`, kind: 'Leçon', icon: l.icon, name: l.title, desc: l.summary, keywords: l.keywords, path: `/apprendre/${l.id}` })),
  ...CHEATSHEETS.map((c) => ({ key: `sheet-${c.id}`, kind: 'Fiche', icon: c.icon, name: c.title, desc: c.summary, keywords: c.keywords, path: `/aide-memoire/${c.id}` })),
  ...FAMILIES.map((f) => ({ key: `family-${f.id}`, kind: 'Famille', icon: f.icon, name: f.name, desc: f.desc, keywords: ['outils', 'famille'], path: `/outils/${f.id}` })),
];

const PAGES = [
  { key: 'go-dashboard', kind: 'Page', icon: 'layout-dashboard', name: 'Tableau de bord', desc: 'Favoris, récents, progression', keywords: ['accueil', 'dashboard', 'home'], path: '/dashboard' },
  { key: 'go-tools', kind: 'Page', icon: 'wrench', name: 'Tous les outils', desc: `${TOOLS.length} outils par famille`, keywords: ['catalogue', 'outils'], path: '/outils' },
  { key: 'go-learn', kind: 'Page', icon: 'graduation-cap', name: 'Apprendre', desc: `${LESSONS.length} leçons et quiz`, keywords: ['leçons', 'cours', 'learn'], path: '/apprendre' },
  { key: 'go-cheats', kind: 'Page', icon: 'notebook-text', name: 'Aide-mémoire', desc: `${CHEATSHEETS.length} fiches`, keywords: ['fiches', 'cheatsheet'], path: '/aide-memoire' },
  { key: 'go-snippets', kind: 'Page', icon: 'bookmark', name: 'Snippets', desc: 'Ta bibliothèque de bouts de code', keywords: ['snippets', 'code'], path: '/snippets' },
  { key: 'go-ai', kind: 'Page', icon: 'sparkles', name: 'Assistant IA', desc: 'Chat avec Claude (ta clé API)', keywords: ['ia', 'ai', 'claude', 'chat'], path: '/ai' },
];

const actions = computed(() => {
  const list = [
    {
      key: 'theme',
      kind: 'Action',
      icon: theme.value === 'dark' ? 'sun' : 'moon',
      name: theme.value === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre',
      desc: 'Basculer l’apparence',
      keywords: ['thème', 'clair', 'sombre', 'dark', 'light'],
      run: toggle,
      keepOpen: true,
    },
    {
      key: 'settings',
      kind: 'Action',
      icon: 'settings',
      name: 'Réglages & données',
      desc: 'Accent, export / import, effacement',
      keywords: ['réglages', 'settings', 'export', 'import', 'accent'],
      run: () => emit('open-settings'),
    },
  ];
  const tool = getTool(route.meta.tool);
  if (tool) {
    list.push({
      key: 'reset-tool',
      kind: 'Action',
      icon: 'rotate-ccw',
      name: `Vider la saisie de « ${tool.name} »`,
      desc: 'Remet l’outil dans son état initial',
      keywords: ['vider', 'reset', 'effacer', 'réinitialiser'],
      run: () => {
        clearToolKeys(tool.id);
        window.location.reload();
      },
    });
  }
  return list;
});

const recentItems = computed(() =>
  recents.value
    .map((r) => ITEMS.find((item) => item.key === `${r.type === 'cheatsheet' ? 'sheet' : r.type}-${r.id}`))
    .filter(Boolean)
    .slice(0, 5),
);

const results = computed(() => {
  const q = query.value.trim();
  if (!q) {
    return [
      ...recentItems.value.map((item) => ({ ...item, group: 'Récents' })),
      ...PAGES.map((item) => ({ ...item, group: 'Pages' })),
      ...actions.value.map((item) => ({ ...item, group: 'Actions' })),
    ];
  }
  return rank([...ITEMS, ...PAGES, ...actions.value], q, (item) => [item.name, item.desc, ...(item.keywords || [])])
    .slice(0, 40)
    .map((item) => ({ ...item, group: '' }));
});

watch(
  () => props.open,
  async (open) => {
    if (!open) return;
    query.value = '';
    active.value = 0;
    await nextTick();
    input.value?.focus();
  },
);

watch(results, () => (active.value = 0));

function move(step) {
  const n = results.value.length;
  if (!n) return;
  active.value = (active.value + step + n) % n;
  nextTick(() => list.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }));
}

function run(item = results.value[active.value]) {
  if (!item) return;
  if (item.run) {
    item.run();
    if (!item.keepOpen) emit('close');
    return;
  }
  router.push(item.path);
  emit('close');
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    run();
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <div ref="dialog" class="modal-card palette" role="dialog" aria-modal="true" aria-label="Recherche et commandes">
          <div class="p-search">
            <Icon name="search" />
            <input
              ref="input"
              v-model="query"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              :aria-activedescendant="results[active] ? `pi-${results[active].key}` : undefined"
              placeholder="Rechercher un outil, une leçon, une fiche ou une action…"
              spellcheck="false"
              autocomplete="off"
              @keydown="onKeydown"
            />
            <kbd>Échap</kbd>
          </div>
          <ul id="palette-list" ref="list" class="p-list" role="listbox">
            <template v-for="(item, index) in results" :key="item.key">
              <li v-if="item.group && (index === 0 || results[index - 1].group !== item.group)" class="p-group" role="presentation">
                {{ item.group }}
              </li>
              <li
                :id="`pi-${item.key}`"
                class="p-item"
                role="option"
                :aria-selected="index === active"
                :data-active="index === active"
                @click="run(item)"
                @mousemove="active = index"
              >
                <span class="p-icon"><Icon :name="item.icon" /></span>
                <span class="p-text">
                  <span class="p-name">{{ item.name }}</span>
                  <span class="p-desc">{{ item.desc }}</span>
                </span>
                <span class="chip p-kind">{{ item.kind }}</span>
              </li>
            </template>
            <li v-if="!results.length" class="p-empty">Rien ne correspond à « {{ query }} ».</li>
          </ul>
          <div class="p-foot" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
            <span><kbd>⏎</kbd> ouvrir</span>
            <span><kbd>/</kbd> ou <kbd>Ctrl</kbd><kbd>K</kbd> rouvrir</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette {
  max-height: min(640px, 80vh);
}

.p-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--line);
}

.p-search > .icon {
  width: 19px;
  height: 19px;
  color: var(--subtle);
}

.p-search input {
  border: 0;
  background: none;
  box-shadow: none;
  padding: 12px 0;
  font-size: 17px;
  font-weight: 550;
}

.p-search input:focus {
  box-shadow: none;
  background: none;
}

.p-list {
  overflow-y: auto;
  padding: 8px;
}

.p-group {
  padding: 12px 12px 6px;
  font: 500 11px var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--subtle);
}

.p-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  cursor: pointer;
}

.p-item[data-active='true'] {
  background: color-mix(in srgb, var(--accent-fill) 12%, transparent);
}

.p-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  background: var(--soft);
  color: var(--muted);
}

.p-item[data-active='true'] .p-icon {
  background: var(--accent-fill);
  color: var(--on-accent);
}

.p-icon .icon {
  width: 17px;
  height: 17px;
}

.p-text {
  display: grid;
  min-width: 0;
  flex: 1;
}

.p-name {
  font-weight: 650;
  font-size: 14.5px;
}

.p-desc {
  font-size: 12.5px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-kind {
  font-size: 11px;
  padding: 3px 8px;
}

.p-empty {
  padding: 26px;
  text-align: center;
  color: var(--muted);
}

.p-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 18px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  color: var(--subtle);
}

.p-foot kbd {
  margin-right: 3px;
}

@media (max-width: 600px) {
  .p-kind,
  .p-foot {
    display: none;
  }
}
</style>
