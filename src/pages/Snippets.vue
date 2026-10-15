<script setup>
import { computed, nextTick, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import { useSnippets } from '@/composables/useSnippets';
import { rank } from '@/lib/search';

const { snippets, add, update, remove } = useSnippets();
const LANGS = ['text', 'regex', 'sql', 'javascript', 'typescript', 'vue', 'php', 'python', 'bash', 'powershell', 'json', 'yaml', 'css', 'html', 'dockerfile', 'nginx'];

const title = ref('');
const lang = ref('text');
const content = ref('');
const editingId = ref(null);
const query = ref('');
const notice = ref('');
const fileInput = ref(null);
const titleInput = ref(null);

const canSave = computed(() => title.value.trim() && content.value.trim());
const visible = computed(() => rank(snippets.value, query.value, (s) => [s.title, s.lang, s.content]));

function resetForm() {
  title.value = '';
  content.value = '';
  lang.value = 'text';
  editingId.value = null;
}

function submit() {
  if (!canSave.value) return;
  if (editingId.value) update(editingId.value, { title: title.value.trim(), lang: lang.value, content: content.value });
  else add({ title: title.value, lang: lang.value, content: content.value });
  resetForm();
}

async function edit(snippet) {
  editingId.value = snippet.id;
  title.value = snippet.title;
  lang.value = snippet.lang;
  content.value = snippet.content;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  await nextTick();
  titleInput.value?.focus();
}

function destroy(snippet) {
  if (confirm(`Supprimer le snippet « ${snippet.title} » ?`)) remove(snippet.id);
}

function exportAll() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(snippets.value, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `devtoolbox-snippets-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      let count = 0;
      for (const s of Array.isArray(data) ? data : []) {
        if (s && typeof s.title === 'string' && typeof s.content === 'string') {
          add({ title: s.title, lang: LANGS.includes(s.lang) ? s.lang : 'text', content: s.content });
          count++;
        }
      }
      notice.value = `${count} snippet(s) importé(s).`;
    } catch {
      notice.value = 'Fichier invalide.';
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}
</script>

<template>
  <div class="page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Snippets</span>
    </nav>

    <header class="tile tile--tint page-head" data-accent="teal">
      <div>
        <p class="eyebrow eyebrow--accent">Bibliothèque locale · {{ snippets.length }} snippet{{ snippets.length > 1 ? 's' : '' }}</p>
        <h1>Snippets</h1>
        <p class="lead">Tes bouts de code, regex et modèles réutilisables. Tout reste dans ce navigateur ; exporte-les pour les sauvegarder.</p>
      </div>
      <div class="side">
        <div class="row">
          <button class="btn" type="button" :disabled="!snippets.length" @click="exportAll"><Icon name="download" /> Exporter</button>
          <button class="btn" type="button" @click="fileInput?.click()"><Icon name="upload" /> Importer</button>
          <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importFile" />
        </div>
        <p v-if="notice" class="status status--ok" role="status"><Icon name="circle-check" /> {{ notice }}</p>
      </div>
    </header>

    <div class="layout">
      <form class="tile tile--flat form" @submit.prevent="submit">
        <h2>{{ editingId ? 'Modifier le snippet' : 'Nouveau snippet' }}</h2>
        <div class="form-row">
          <div class="field">
            <label class="label" for="snip-title">Titre</label>
            <input id="snip-title" ref="titleInput" v-model="title" type="text" placeholder="Ex. « Email valide »" />
          </div>
          <div class="field lang">
            <label class="label" for="snip-lang">Langage</label>
            <select id="snip-lang" v-model="lang">
              <option v-for="l in LANGS" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label" for="snip-content">Contenu</label>
          <textarea id="snip-content" v-model="content" rows="8" spellcheck="false" placeholder="Colle ton code ici…" />
        </div>
        <div class="row">
          <button class="btn btn--accent" type="submit" :disabled="!canSave">
            <Icon :name="editingId ? 'check' : 'plus'" /> {{ editingId ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
          <button v-if="editingId" class="btn btn--ghost" type="button" @click="resetForm">Annuler</button>
        </div>
      </form>

      <section class="list-col" aria-label="Mes snippets">
        <div class="searchbar">
          <Icon name="search" />
          <input v-model="query" type="search" placeholder="Chercher dans les snippets…" aria-label="Chercher dans les snippets" />
        </div>
        <p v-if="!snippets.length" class="empty">Aucun snippet pour l’instant : crée le premier avec le formulaire.</p>
        <p v-else-if="!visible.length" class="empty">Aucun résultat pour « {{ query }} ».</p>
        <article v-for="s in visible" :key="s.id" class="tile tile--flat snip">
          <header>
            <strong>{{ s.title }}</strong>
            <span class="chip">{{ s.lang }}</span>
          </header>
          <pre><code>{{ s.content }}</code></pre>
          <div class="row">
            <CopyButton :value="s.content" />
            <button class="btn btn--sm btn--ghost" type="button" @click="edit(s)"><Icon name="pencil" /> Modifier</button>
            <button class="btn btn--sm btn--ghost" type="button" @click="destroy(s)"><Icon name="trash-2" /> Supprimer</button>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: var(--gap);
  margin-top: var(--gap);
  align-items: start;
}

.form {
  position: sticky;
  top: calc(var(--header-h) + 8px);
  display: grid;
  gap: 16px;
  padding: 26px;
}

.form h2 {
  font-size: 22px;
}

.form-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 12px;
}

.form .field + .field {
  margin-top: 0;
}

.list-col {
  display: grid;
  gap: var(--gap);
}

.snip {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.snip header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.snip pre {
  max-height: 260px;
  overflow: auto;
  padding: 14px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .form {
    position: static;
  }
}

@media (max-width: 520px) {
  .form-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
