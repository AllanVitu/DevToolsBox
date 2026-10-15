<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { usePipeline } from '@/composables/usePipeline';
import { csvToJson, jsonToCsv } from '@/lib/csv';

const mode = usePersistentRef('jsoncsv:mode', 'json2csv');
const delimiter = usePersistentRef('jsoncsv:delimiter', ',');
const input = usePersistentRef(
  'jsoncsv:input',
  '[\n  { "nom": "Allan", "ville": "Mulhouse", "age": 33 },\n  { "nom": "Léa", "ville": "Lyon", "age": 29 }\n]',
);

const result = computed(() => {
  if (!input.value.trim()) return { text: '', error: '' };
  try {
    const text =
      mode.value === 'json2csv'
        ? jsonToCsv(input.value, { delimiter: delimiter.value === 'auto' ? ',' : delimiter.value })
        : csvToJson(input.value, { delimiter: delimiter.value });
    return { text, error: '' };
  } catch (e) {
    return { text: '', error: e.message };
  }
});

function switchMode(next) {
  if (next === mode.value) return;
  if (result.value.text && !result.value.error) input.value = result.value.text;
  mode.value = next;
}

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['json']);
  if (item) {
    input.value = item.content;
    mode.value = 'json2csv';
  }
});

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'json2csv' || s.mode === 'csv2json') mode.value = s.mode;
  },
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <ShareButton :build="buildUrl" />
    </template>

    <div class="toolbar">
      <Segmented
        :model-value="mode"
        :options="[
          { value: 'json2csv', label: 'JSON → CSV' },
          { value: 'csv2json', label: 'CSV → JSON' },
        ]"
        @update:model-value="switchMode"
      />
      <label class="inline-field">
        Séparateur
        <select v-model="delimiter">
          <option v-if="mode === 'csv2json'" value="auto">Détection auto</option>
          <option value=",">Virgule ,</option>
          <option value=";">Point-virgule ; (Excel FR)</option>
          <option value="&#9;">Tabulation</option>
        </select>
      </label>
    </div>

    <div class="io">
      <div class="field">
        <label class="label" for="csv-in">{{ mode === 'json2csv' ? 'JSON (tableau d’objets)' : 'CSV (1re ligne = en-têtes)' }}</label>
        <textarea id="csv-in" v-model="input" rows="14" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'json2csv' ? 'CSV' : 'JSON'" :value="result.text" :rows="14" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="hint mt">Les valeurs du type 007 ou 1e3 restent du texte, pour ne pas abîmer codes postaux et identifiants.</p>
  </ToolShell>
</template>
