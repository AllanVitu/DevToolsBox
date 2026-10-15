<script setup>
import { ref, toRef, watch } from 'vue';
import Icon from './Icon.vue';
import { useTheme } from '@/composables/useTheme';
import { usePwa } from '@/composables/usePwa';
import { useFocusTrap } from '@/composables/useFocusTrap';
import { resetProgress } from '@/composables/useProgress';
import { PREFIX, allKeys } from '@/lib/storage';
import { LINKS, VERSION, VERSION_DATE } from '@/data/site';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);

const { theme, accent, setTheme, setAccent, ACCENTS } = useTheme();
const { canInstall, promptInstall, online } = usePwa();
const dialog = useFocusTrap(toRef(props, 'open'), () => emit('close'));

// Clés « système » : tout le reste correspond aux saisies des outils.
const SYSTEM_KEYS = ['theme', 'accent', 'favorites', 'recents', 'progress', 'snippets', 'dash:widgets', 'ai:key', 'ai:model', 'ai:effort'].map(
  (k) => PREFIX + k,
);
// La clé API n'est jamais exportée : un fichier de sauvegarde circule plus facilement qu'un navigateur.
const NEVER_EXPORTED = [PREFIX + 'ai:key'];

const inputCount = ref(0);
const message = ref('');
const isError = ref(false);
const fileInput = ref(null);

const toolKeys = () => allKeys().filter((k) => !SYSTEM_KEYS.includes(k));

function refresh() {
  inputCount.value = toolKeys().length;
  message.value = '';
  isError.value = false;
}

watch(
  () => props.open,
  (open) => open && refresh(),
);

function say(text, error = false) {
  message.value = text;
  isError.value = error;
}

function exportData() {
  const data = {};
  for (const key of allKeys().filter((k) => !NEVER_EXPORTED.includes(k))) {
    const raw = localStorage.getItem(key);
    try {
      data[key] = JSON.parse(raw);
    } catch {
      data[key] = raw;
    }
  }
  const payload = { app: 'DevToolbox', version: 3, exportedAt: new Date().toISOString(), data };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `devtoolbox-donnees-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  say('Données exportées (la clé API n’est jamais incluse).');
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const data = parsed && parsed.data ? parsed.data : parsed;
      let count = 0;
      for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith(PREFIX) || NEVER_EXPORTED.includes(key)) continue;
        localStorage.setItem(key, typeof value === 'string' && /^devtoolbox:(theme|accent)$/.test(key) ? value : JSON.stringify(value));
        count++;
      }
      say(`${count} entrée(s) importée(s). Rechargement…`);
      setTimeout(() => window.location.reload(), 700);
    } catch {
      say('Fichier invalide ou illisible.', true);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function clearInputs() {
  const keys = toolKeys();
  if (!keys.length) return say('Aucune saisie d’outil à effacer.');
  if (!confirm(`Effacer ${keys.length} saisie(s) d’outils ? Favoris, progression et snippets sont conservés.`)) return;
  keys.forEach((k) => localStorage.removeItem(k));
  say('Saisies effacées. Rechargement…');
  setTimeout(() => window.location.reload(), 700);
}

function clearProgress() {
  if (!confirm('Remettre à zéro la progression des leçons et les scores de quiz ?')) return;
  resetProgress();
  say('Progression remise à zéro.');
}

function clearAll() {
  if (!confirm('Tout effacer ? Saisies, favoris, progression, snippets, réglages et clé API seront supprimés de ce navigateur.')) return;
  allKeys().forEach((k) => localStorage.removeItem(k));
  say('Tout a été effacé. Rechargement…');
  setTimeout(() => window.location.reload(), 700);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <div ref="dialog" class="modal-card settings" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <header class="s-head">
            <div>
              <p class="eyebrow">Préférences</p>
              <h2 id="settings-title">Réglages &amp; données</h2>
            </div>
            <button class="btn btn--icon btn--ghost" type="button" aria-label="Fermer" @click="emit('close')">
              <Icon name="x" />
            </button>
          </header>

          <div class="s-body">
            <section class="s-section">
              <h3 class="label">Apparence</h3>
              <div class="seg" role="group" aria-label="Thème">
                <button type="button" :aria-pressed="theme === 'light'" @click="setTheme('light')">Clair</button>
                <button type="button" :aria-pressed="theme === 'dark'" @click="setTheme('dark')">Sombre</button>
              </div>
            </section>

            <section class="s-section">
              <h3 class="label">Couleur d’accent</h3>
              <div class="accents" role="radiogroup" aria-label="Couleur d’accent">
                <button
                  v-for="a in ACCENTS"
                  :key="a.id"
                  type="button"
                  role="radio"
                  class="accent-dot"
                  :data-accent="a.id"
                  :aria-checked="accent === a.id"
                  :title="a.name"
                  @click="setAccent(a.id)"
                >
                  <Icon v-if="accent === a.id" name="check" />
                  <span class="sr-only">{{ a.name }}</span>
                </button>
              </div>
            </section>

            <section v-if="canInstall" class="s-section">
              <h3 class="label">Application</h3>
              <p class="muted small">Installe DevToolbox comme une application : elle s’ouvre dans sa propre fenêtre et fonctionne hors-ligne.</p>
              <button class="btn btn--accent" type="button" @click="promptInstall"><Icon name="download" /> Installer</button>
            </section>

            <section class="s-section">
              <h3 class="label">Mes données</h3>
              <p class="muted small">
                Tout est stocké dans ce navigateur ({{ inputCount }} saisie{{ inputCount > 1 ? 's' : '' }} d’outils). Rien n’est envoyé à un
                serveur, sauf les messages que tu adresses à l’assistant IA.
              </p>
              <div class="row">
                <button class="btn btn--ink" type="button" @click="exportData"><Icon name="download" /> Exporter</button>
                <button class="btn" type="button" @click="fileInput?.click()"><Icon name="upload" /> Importer</button>
                <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importData" />
              </div>
              <div class="row danger-row">
                <button class="btn btn--sm" type="button" @click="clearInputs">Effacer les saisies</button>
                <button class="btn btn--sm" type="button" @click="clearProgress">Remettre la progression à zéro</button>
                <button class="btn btn--sm btn--danger" type="button" @click="clearAll"><Icon name="trash-2" /> Tout effacer</button>
              </div>
              <p v-if="message" class="status" :class="isError ? 'status--error' : 'status--ok'" role="status">
                <Icon :name="isError ? 'circle-x' : 'circle-check'" /> {{ message }}
              </p>
            </section>

            <section class="s-section about">
              <p class="subtle mono small">
                DevToolbox {{ VERSION }} · {{ VERSION_DATE }} · {{ online ? 'en ligne' : 'hors-ligne' }}
              </p>
              <p class="small">
                <RouterLink to="/confidentialite" @click="emit('close')">Confidentialité &amp; mentions</RouterLink>
                ·
                <a :href="LINKS.repo" target="_blank" rel="noopener">Code source</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.settings {
  width: min(560px, 100%);
}

.s-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 22px 16px 26px;
  border-bottom: 1px solid var(--line);
}

.s-head h2 {
  font-size: 24px;
  margin-top: 4px;
}

.s-body {
  overflow-y: auto;
  padding: 8px 26px 24px;
}

.s-section {
  display: grid;
  gap: 12px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.s-section:last-child {
  border-bottom: 0;
}

.small {
  font-size: 13.5px;
  line-height: 1.55;
}

.accents {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.accent-dot {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent-fill);
  color: var(--on-accent);
  transition: transform 0.2s var(--ease);
}

.accent-dot:hover {
  transform: scale(1.08);
}

.accent-dot[aria-checked='true'] {
  box-shadow:
    0 0 0 3px var(--tile),
    0 0 0 5px var(--accent-fill);
}

.accent-dot .icon {
  width: 17px;
  height: 17px;
}

.danger-row {
  padding-top: 4px;
}

.about a {
  color: var(--accent);
}
</style>
