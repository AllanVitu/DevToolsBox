<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { formatXml, minifyXml, validateXml } from '@/lib/xml';

const input = usePersistentRef('xml:input', '<note><to>Allan</to><from>Léa</from><!-- rappel --><body>Coucou</body></note>');
const indent = usePersistentRef('xml:indent', 2);
const mode = usePersistentRef('xml:mode', 'format');

const error = computed(() => (input.value.trim() ? validateXml(input.value) : ''));
const output = computed(() => {
  if (!input.value.trim() || error.value) return '';
  return mode.value === 'minify' ? minifyXml(input.value) : formatXml(input.value, Number(indent.value));
});
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <Segmented
        v-model="mode"
        :options="[
          { value: 'format', label: 'Indenter' },
          { value: 'minify', label: 'Minifier' },
        ]"
      />
      <label v-if="mode === 'format'" class="inline-field">
        Indentation
        <select v-model.number="indent">
          <option :value="2">2 espaces</option>
          <option :value="4">4 espaces</option>
        </select>
      </label>
      <span v-if="output" class="status status--ok"><Icon name="circle-check" /> XML bien formé</span>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="xml-in">XML</label>
        <textarea id="xml-in" v-model="input" rows="14" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'minify' ? 'Minifié' : 'Indenté'" :value="output" :rows="14" />
    </div>
    <p v-if="error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ error }}</span></p>
  </ToolShell>
</template>
