<script setup>
import { computed, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import ProgressRing from '@/components/ProgressRing.vue';
import { FAMILIES } from '@/data/families';
import { getTool, toolsOfFamily } from '@/data/tools';
import { LESSONS, getLesson } from '@/data/lessons';
import { getCheatsheet } from '@/data/cheatsheets';
import { COUNTS, NEW_LESSONS, NEW_SHEETS, NEW_TOOLS } from '@/data/catalog';
import { useFavorites } from '@/composables/useFavorites';
import { useProgress } from '@/composables/useProgress';
import { useDashboard } from '@/composables/useDashboard';
import { useClaude } from '@/composables/useClaude';
import { readJSON } from '@/lib/storage';
import { openPalette } from '@/lib/events';

const { favorites, recents, reorderFavorites } = useFavorites();
const { percent, completedCount, isLessonDone } = useProgress(LESSONS.map((l) => l.id));
const { visible, hidden, editMode, toggle, move, reset, nameOf } = useDashboard();
const { hasKey, currentModel } = useClaude();

const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
const hour = new Date().getHours();
const greeting = hour < 5 || hour >= 18 ? 'Bonsoir' : 'Bonjour';

const favoriteTools = computed(() => favorites.value.map(getTool).filter(Boolean));
const snippetCount = (readJSON('snippets', []) || []).length;

const recentItems = computed(() =>
  recents.value
    .map((r) => {
      if (r.type === 'tool') {
        const t = getTool(r.id);
        return t && { key: `t-${t.id}`, icon: t.icon, name: t.name, kind: 'Outil', to: `/${t.id}` };
      }
      if (r.type === 'lesson') {
        const l = getLesson(r.id);
        return l && { key: `l-${l.id}`, icon: l.icon, name: l.title, kind: 'Leçon', to: `/apprendre/${l.id}` };
      }
      if (r.type === 'cheatsheet') {
        const c = getCheatsheet(r.id);
        return c && { key: `c-${c.id}`, icon: c.icon, name: c.title, kind: 'Fiche', to: `/aide-memoire/${c.id}` };
      }
      return null;
    })
    .filter(Boolean),
);

const nextLesson = computed(() => LESSONS.find((l) => !isLessonDone(l.id)) || null);
const families = FAMILIES.map((f) => ({ ...f, count: toolsOfFamily(f.id).length }));

// Glisser-déposer des favoris (souris) — les flèches restent disponibles au clavier.
const dragging = ref(null);
function dropOn(id) {
  if (!dragging.value || dragging.value === id) return;
  const list = [...favorites.value];
  const from = list.indexOf(dragging.value);
  const to = list.indexOf(id);
  if (from === -1 || to === -1) return;
  list.splice(to, 0, list.splice(from, 1)[0]);
  reorderFavorites(list);
  dragging.value = null;
}
function shiftFavorite(id, step) {
  const list = [...favorites.value];
  const from = list.indexOf(id);
  const to = from + step;
  if (from === -1 || to < 0 || to >= list.length) return;
  [list[from], list[to]] = [list[to], list[from]];
  reorderFavorites(list);
}

const TIPS = [
  'Appuie sur / ou Ctrl + K n’importe où pour chercher un outil, une leçon ou une fiche.',
  'Le bouton « Partager » d’un outil copie un lien qui rouvre l’outil avec ta saisie, sans serveur.',
  '« Envoyer vers » fait passer le résultat d’un outil à un autre : SQL formaté → visualiseur ERD, JSON → TypeScript…',
  'Réglages → Exporter sauvegarde favoris, progression et snippets dans un fichier JSON (sans ta clé API).',
  'Chaque leçon se termine par un quiz : ton meilleur score est gardé dans ce navigateur.',
];
const tip = TIPS[new Date().getDate() % TIPS.length];
</script>

<template>
  <div class="page">
    <section class="tile tile--tint hello" style="--i: 0">
      <div>
        <p class="eyebrow eyebrow--accent">{{ today }}</p>
        <h1>{{ greeting }} !</h1>
        <p class="lead">Que construit-on aujourd’hui ?</p>
      </div>
      <div class="hello-actions">
        <button class="search-big" type="button" @click="openPalette">
          <Icon name="search" />
          <span>Chercher un outil, une leçon, une fiche…</span>
          <kbd>/</kbd>
        </button>
        <div class="row">
          <button class="btn btn--sm" type="button" :class="{ 'is-on': editMode }" @click="editMode = !editMode">
            <Icon :name="editMode ? 'check' : 'sliders-horizontal'" /> {{ editMode ? 'Terminer' : 'Personnaliser' }}
          </button>
          <button v-if="editMode" class="btn btn--sm btn--ghost" type="button" @click="reset"><Icon name="rotate-ccw" /> Réinitialiser</button>
        </div>
      </div>
    </section>

    <div v-if="editMode && hidden.length" class="hidden-bar">
      <span class="label">Tuiles masquées</span>
      <button v-for="w in hidden" :key="w.id" class="chip" type="button" @click="toggle(w.id)"><Icon name="plus" /> {{ nameOf(w.id) }}</button>
    </div>

    <div class="dash">
      <template v-for="(w, index) in visible" :key="w.id">
        <section class="tile widget" :class="[`w-${w.id}`, { editing: editMode }]" :style="{ '--i': index + 1 }">
          <div v-if="editMode" class="w-bar">
            <span class="label">{{ nameOf(w.id) }}</span>
            <button class="btn btn--sm btn--icon" type="button" :disabled="index === 0" aria-label="Monter" @click="move(w.id, -1)"><Icon name="arrow-left" /></button>
            <button class="btn btn--sm btn--icon" type="button" :disabled="index === visible.length - 1" aria-label="Descendre" @click="move(w.id, 1)"><Icon name="arrow-right" /></button>
            <button class="btn btn--sm btn--icon" type="button" aria-label="Masquer" @click="toggle(w.id)"><Icon name="eye-off" /></button>
          </div>

          <!-- Chiffres clés -->
          <template v-if="w.id === 'stats'">
            <p class="eyebrow">En chiffres</p>
            <dl class="nums">
              <div><dt>{{ COUNTS.tools }}</dt><dd>outils</dd></div>
              <div><dt>{{ favorites.length }}</dt><dd>favoris</dd></div>
              <div><dt>{{ completedCount }}</dt><dd>leçons faites</dd></div>
              <div><dt>{{ snippetCount }}</dt><dd>snippets</dd></div>
            </dl>
          </template>

          <!-- Favoris -->
          <template v-else-if="w.id === 'favorites'">
            <p class="eyebrow">Favoris <span v-if="favoriteTools.length > 1" class="subtle">· glisse pour réordonner</span></p>
            <ul v-if="favoriteTools.length" class="fav-list">
              <li
                v-for="t in favoriteTools"
                :key="t.id"
                draggable="true"
                :class="{ dragging: dragging === t.id }"
                @dragstart="dragging = t.id"
                @dragover.prevent
                @drop.prevent="dropOn(t.id)"
                @dragend="dragging = null"
              >
                <RouterLink :to="`/${t.id}`" class="item">
                  <span class="icon-chip" :data-accent="FAMILIES.find((f) => f.id === t.family)?.accent"><Icon :name="t.icon" /></span>
                  <span class="item-name">{{ t.name }}</span>
                </RouterLink>
                <span class="fav-move">
                  <button type="button" :aria-label="`Monter ${t.name}`" @click="shiftFavorite(t.id, -1)"><Icon name="chevron-left" /></button>
                  <button type="button" :aria-label="`Descendre ${t.name}`" @click="shiftFavorite(t.id, 1)"><Icon name="chevron-right" /></button>
                </span>
              </li>
            </ul>
            <p v-else class="empty-hint">Aucun favori pour l’instant. Ouvre un outil et clique sur l’étoile pour l’épingler ici.</p>
          </template>

          <!-- Récents -->
          <template v-else-if="w.id === 'recents'">
            <p class="eyebrow">Récemment ouverts</p>
            <ul v-if="recentItems.length" class="recent-list">
              <li v-for="r in recentItems" :key="r.key">
                <RouterLink :to="r.to" class="item">
                  <Icon :name="r.icon" />
                  <span class="item-name">{{ r.name }}</span>
                  <span class="chip">{{ r.kind }}</span>
                </RouterLink>
              </li>
            </ul>
            <p v-else class="empty-hint">Rien pour l’instant : les outils, leçons et fiches que tu ouvres apparaîtront ici.</p>
          </template>

          <!-- Progression -->
          <template v-else-if="w.id === 'progress'">
            <p class="eyebrow">Progression</p>
            <div class="progress">
              <ProgressRing :percent="percent" :size="88" />
              <div>
                <p class="big">{{ completedCount }} / {{ COUNTS.lessons }}</p>
                <p class="muted small">leçons validées par leur quiz</p>
              </div>
            </div>
            <RouterLink v-if="nextLesson" :to="`/apprendre/${nextLesson.id}`" class="btn btn--ink btn--sm">
              <Icon name="play" /> {{ nextLesson.title }}
            </RouterLink>
            <p v-else class="status status--ok"><Icon name="trophy" /> Toutes les leçons sont faites. Bravo !</p>
          </template>

          <!-- Familles -->
          <template v-else-if="w.id === 'families'">
            <div class="row row--between">
              <p class="eyebrow">Familles d’outils</p>
              <RouterLink to="/outils" class="chip chip--accent">Tout voir <Icon name="arrow-right" /></RouterLink>
            </div>
            <ul class="fam-grid">
              <li v-for="f in families" :key="f.id">
                <RouterLink :to="`/outils/${f.id}`" class="fam" :data-accent="f.accent">
                  <span class="icon-chip"><Icon :name="f.icon" /></span>
                  <span>
                    <strong>{{ f.name }}</strong>
                    <span class="muted">{{ f.count }} outil{{ f.count > 1 ? 's' : '' }}</span>
                  </span>
                </RouterLink>
              </li>
            </ul>
          </template>

          <!-- IA -->
          <template v-else-if="w.id === 'ai'">
            <RouterLink to="/ai" class="ai-link">
              <p class="eyebrow">Assistant IA</p>
              <p class="big">{{ hasKey ? currentModel.name : 'Connecte Claude' }}</p>
              <p class="muted small">
                {{ hasKey ? 'Clé enregistrée dans ce navigateur. Chat, explication de code, regex, SQL.' : 'Ajoute ta clé API Anthropic pour activer le chat et l’analyse IA des outils.' }}
              </p>
              <span class="btn btn--sm ai-btn"><Icon name="sparkles" /> Ouvrir</span>
            </RouterLink>
          </template>

          <!-- Nouveautés -->
          <template v-else-if="w.id === 'news'">
            <p class="eyebrow">Nouveau dans la v3</p>
            <p class="big">+{{ NEW_LESSONS.length }} leçons · +{{ NEW_SHEETS.length }} fiches · +{{ NEW_TOOLS.length }} outils</p>
            <div class="news">
              <RouterLink v-for="l in NEW_LESSONS.slice(0, 5)" :key="l.id" :to="`/apprendre/${l.id}`" class="chip chip--accent">{{ l.title }}</RouterLink>
              <RouterLink v-for="t in NEW_TOOLS" :key="t.id" :to="`/${t.id}`" class="chip">{{ t.name }}</RouterLink>
            </div>
          </template>

          <!-- Astuce -->
          <template v-else-if="w.id === 'tip'">
            <p class="eyebrow"><Icon name="lightbulb" /> Astuce</p>
            <p class="tip">{{ tip }}</p>
          </template>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.hello {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px 40px;
  align-items: end;
  padding: 32px;
  margin-bottom: var(--gap);
}

.hello h1 {
  font-size: clamp(38px, 4.6vw, 64px);
  letter-spacing: -0.055em;
  margin-top: 8px;
  line-height: 0.95;
}

.hello .eyebrow {
  text-transform: uppercase;
}

.lead {
  color: var(--muted);
  font-size: 17px;
  margin-top: 10px;
}

.hello-actions {
  display: grid;
  gap: 12px;
  justify-items: start;
}

.search-big {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px 16px 15px 20px;
  border-radius: var(--r-full);
  background: var(--tile);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 15px;
  font-weight: 550;
  text-align: left;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-big:hover {
  border-color: color-mix(in srgb, var(--accent-fill) 50%, transparent);
  box-shadow: var(--shadow);
}

.search-big span {
  flex: 1;
}

.hidden-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0 6px var(--gap);
}

.dash {
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-flow: dense;
}

.widget {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 210px;
}

.widget.editing {
  outline: 2px dashed color-mix(in srgb, var(--accent-fill) 45%, transparent);
  outline-offset: -2px;
}

.w-stats,
.w-progress,
.w-ai,
.w-tip {
  grid-column: span 4;
}

.w-favorites,
.w-recents {
  grid-column: span 6;
}

.w-families {
  grid-column: span 8;
}

.w-news {
  grid-column: span 4;
}

.w-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: -8px -8px 0;
  padding: 6px 6px 6px 12px;
  border-radius: var(--r-md);
  background: var(--soft);
}

.w-bar .label {
  flex: 1;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.eyebrow .icon {
  width: 14px;
  height: 14px;
}

.small {
  font-size: 13.5px;
}

.big {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.nums {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: auto;
}

.nums dt {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
}

.nums dd {
  font-size: 13px;
  color: var(--muted);
}

.empty-hint {
  color: var(--muted);
  font-size: 14px;
  padding: 18px;
  border: 1.5px dashed var(--line-strong);
  border-radius: var(--r-lg);
}

.fav-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
}

.fav-list li {
  position: relative;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
  transition: border-color 0.2s;
}

.fav-list li:hover {
  border-color: color-mix(in srgb, var(--accent-fill) 45%, transparent);
}

.fav-list li.dragging {
  opacity: 0.4;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--r-md);
  min-width: 0;
}

.item-name {
  flex: 1;
  min-width: 0;
  font-weight: 650;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-list .icon-chip {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.fav-list .icon-chip .icon {
  width: 16px;
  height: 16px;
}

.fav-move {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.fav-list li:hover .fav-move,
.fav-move:focus-within {
  opacity: 1;
}

.fav-move button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: var(--muted);
  background: var(--tile);
}

.recent-list {
  display: grid;
  gap: 4px;
}

.recent-list .item:hover {
  background: var(--soft);
}

.recent-list .item > .icon {
  width: 17px;
  height: 17px;
  color: var(--accent);
}

.progress {
  display: flex;
  align-items: center;
  gap: 16px;
}

.w-progress .btn {
  margin-top: auto;
  align-self: flex-start;
  max-width: 100%;
}

.fam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
}

.fam {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: var(--r-md);
  transition: background 0.2s;
}

.fam:hover {
  background: var(--soft);
}

.fam > span:last-child {
  display: grid;
  font-size: 14px;
}

.fam .muted {
  font-size: 12.5px;
}

.w-ai {
  background: var(--ink);
  color: var(--tile);
  border-color: transparent;
}

.w-ai .eyebrow,
.w-ai .muted {
  color: color-mix(in srgb, var(--tile) 66%, transparent);
}

.ai-link {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.ai-btn {
  margin-top: auto;
  align-self: flex-start;
  background: color-mix(in srgb, var(--tile) 14%, transparent);
  color: var(--tile);
}

.w-news {
  background: var(--accent-fill);
  color: var(--on-accent);
  border-color: transparent;
}

.w-news .eyebrow {
  color: color-mix(in srgb, var(--on-accent) 75%, transparent);
}

.news {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.w-news .chip,
.w-news .chip--accent {
  background: color-mix(in srgb, var(--on-accent) 16%, transparent);
  color: var(--on-accent);
}

.tip {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.45;
}

@media (max-width: 1180px) {
  .w-stats,
  .w-progress,
  .w-ai,
  .w-tip,
  .w-news {
    grid-column: span 6;
  }

  .w-favorites,
  .w-recents,
  .w-families {
    grid-column: span 12;
  }
}

@media (max-width: 760px) {
  .hello {
    grid-template-columns: minmax(0, 1fr);
    padding: 24px;
  }

  .dash > .widget {
    grid-column: 1 / -1;
  }
}
</style>
