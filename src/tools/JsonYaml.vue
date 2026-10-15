<script setup>
import { computed, onMounted } from 'vue';
import { dump, load } from 'js-yaml';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { usePipeline } from '@/composables/usePipeline';

const mode = usePersistentRef('jsonyaml:mode', 'json2yaml');
const input = usePersistentRef(
  'jsonyaml:input',
  '{\n  "nom": "DevToolbox",\n  "version": 3,\n  "offline": true,\n  "outils": ["json", "yaml", "qr"]\n}',
);

const result = computed(() => {
  if (!input.value.trim()) return { text: '', error: '' };
  try {
    const text =
      mode.value === 'json2yaml'
        ? dump(JSON.parse(input.value), { indent: 2, lineWidth: -1, noRefs: true })
        : JSON.stringify(load(input.value), null, 2);
    return { text: text ?? '', error: '' };
  } catch (e) {
    return { text: '', error: e.message.split('\n')[0] };
  }
});

function switchMode(next) {
  if (next === mode.value) return;
  if (result.value.text && !result.value.error) input.value = result.value.text;
  mode.value = next;
}

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['json', 'yaml']);
  if (!item) return;
  input.value = item.content;
  mode.value = item.type === 'yaml' ? 'yaml2json' : 'json2yaml';
});

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'json2yaml' || s.mode === 'yaml2json') mode.value = s.mode;
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
          { value: 'json2yaml', label: 'JSON → YAML' },
          { value: 'yaml2json', label: 'YAML → JSON' },
        ]"
        @update:model-value="switchMode"
      />
    </div>

    <div class="io">
      <div class="field">
        <label class="label" for="yaml-in">{{ mode === 'json2yaml' ? 'JSON' : 'YAML' }}</label>
        <textarea id="yaml-in" v-model="input" rows="16" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'json2yaml' ? 'YAML' : 'JSON'" :value="result.text" :rows="16" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="hint mt">Pratique pour passer d’une config JSON à un compose.yaml ou un workflow GitHub Actions — et vérifier l’indentation d’un YAML.</p>
  </ToolShell>
</template>
