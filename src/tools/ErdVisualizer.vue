<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { usePipeline } from '@/composables/usePipeline';
import { useTheme } from '@/composables/useTheme';
import { parseErd, renderErd } from '@/lib/erd';

const sql = usePersistentRef(
  'erd:sql',
  'CREATE TABLE clients (\n  id INT PRIMARY KEY,\n  nom VARCHAR(80) NOT NULL\n);\n\nCREATE TABLE commandes (\n  id INT PRIMARY KEY,\n  client_id INT REFERENCES clients(id),\n  total NUMERIC(10,2)\n);\n\nCREATE TABLE lignes (\n  commande_id INT REFERENCES commandes(id),\n  produit TEXT,\n  quantite INT,\n  PRIMARY KEY (commande_id, produit)\n);',
);
const perRow = usePersistentRef('erd:perRow', 3);
const { theme } = useTheme();

const model = computed(() => parseErd(sql.value));
const svg = computed(() => renderErd(model.value, { theme: theme.value, columnsPerRow: Number(perRow.value) }));

function download() {
  const url = URL.createObjectURL(new Blob([renderErd(model.value, { theme: 'light', columnsPerRow: Number(perRow.value) })], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'diagramme-erd.svg';
  link.click();
  URL.revokeObjectURL(url);
}

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['sql']);
  if (item) sql.value = item.content;
});
</script>

<template>
  <ToolShell>
    <template #actions>
      <button class="btn" type="button" :disabled="!svg" @click="download"><Icon name="download" /> SVG</button>
    </template>
    <div class="toolbar">
      <label class="inline-field">
        Tables par ligne
        <select v-model.number="perRow">
          <option v-for="n in [1, 2, 3, 4]" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <span class="chip">{{ model.tables.length }} table{{ model.tables.length > 1 ? 's' : '' }} · {{ model.relations.length }} relation{{ model.relations.length > 1 ? 's' : '' }}</span>
    </div>
    <div class="field">
      <label class="label" for="erd-in">Schéma SQL (un ou plusieurs CREATE TABLE)</label>
      <textarea id="erd-in" v-model="sql" rows="10" spellcheck="false" />
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -- SVG généré par lib/erd.js, textes échappés -->
    <div v-if="svg" class="erd mt" v-html="svg" />
    <p v-else class="empty mt">Aucune table détectée : colle un ou plusieurs CREATE TABLE.</p>
  </ToolShell>
</template>

<style scoped>
.erd {
  overflow: auto;
  padding: 10px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--tile-2);
}

.erd :deep(svg) {
  max-width: none;
}
</style>
