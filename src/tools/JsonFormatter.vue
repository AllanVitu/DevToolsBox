<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import AiButton from '@/components/AiButton.vue';
import ToolAiPanel from '@/components/ToolAiPanel.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { useToolAI } from '@/composables/useToolAI';
import { formatJson } from '@/lib/json';

const input = usePersistentRef('json:input', '{\n  "hello": "world",\n  "items": [1, 2, 3]\n}');
const indent = usePersistentRef('json:indent', 2);
const minify = usePersistentRef('json:minify', false);
const sortKeys = usePersistentRef('json:sort', false);

const result = computed(() => formatJson(input.value, { indent: indent.value, minify: minify.value, sortKeys: sortKeys.value }));
const valid = computed(() => !result.value.error && result.value.text !== '');
const stats = computed(() => {
  if (!valid.value) return '';
  const bytes = new TextEncoder().encode(result.value.text).length;
  return `${bytes.toLocaleString('fr-FR')} octets`;
});

const ai = useToolAI(
  'Tu es expert JSON. Analyse le JSON fourni : décris la structure, repère les anomalies (clés incohérentes, valeurs nulles, types mélangés) et propose des améliorations. Sois concis.',
);
const { buildUrl } = useShareLink(
  () => ({ input: input.value, indent: indent.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.indent) indent.value = s.indent;
  },
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <AiButton :disabled="!valid" :running="ai.running.value" @click="ai.analyze(result.text)" />
      <PipelineButton :output="result.text" emit-type="json" />
      <ShareButton :build="buildUrl" />
    </template>

    <div class="toolbar">
      <label class="inline-field">
        Indentation
        <select v-model.number="indent" :disabled="minify">
          <option :value="2">2 espaces</option>
          <option :value="4">4 espaces</option>
          <option :value="8">8 espaces</option>
        </select>
      </label>
      <label class="check"><input v-model="minify" type="checkbox" /> Minifier</label>
      <label class="check"><input v-model="sortKeys" type="checkbox" /> Trier les clés</label>
      <span v-if="valid" class="status status--ok"><Icon name="circle-check" /> JSON valide · {{ stats }}</span>
    </div>

    <div class="io">
      <div class="field">
        <label class="label" for="json-in">Entrée</label>
        <textarea id="json-in" v-model="input" rows="16" spellcheck="false" />
      </div>
      <OutputBox label="Résultat" :value="result.text" :rows="16" />
    </div>

    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <ToolAiPanel :ai="ai" />
  </ToolShell>
</template>
