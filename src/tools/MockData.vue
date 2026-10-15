<script setup>
import { ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { generateMock } from '@/lib/mock';

const count = usePersistentRef('mock:count', 10);
const format = usePersistentRef('mock:format', 'json');
const output = ref('');

function regenerate() {
  output.value = generateMock(count.value, format.value);
}
watch([count, format], regenerate, { immediate: true });
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <label class="inline-field">
        Lignes
        <input v-model.number="count" type="number" min="1" max="500" style="width: 100px" />
      </label>
      <Segmented
        v-model="format"
        :options="[
          { value: 'json', label: 'JSON' },
          { value: 'csv', label: 'CSV' },
          { value: 'sql', label: 'SQL (INSERT)' },
        ]"
        label="Format"
      />
      <button class="btn btn--accent" type="button" @click="regenerate"><Icon name="refresh-cw" /> Regénérer</button>
    </div>
    <OutputBox :label="`${Math.min(Math.max(Number(count) || 1, 1), 500)} enregistrements`" :value="output" :rows="20" />
    <p class="hint mt">Noms, villes et e-mails fictifs (domaine example.com, réservé aux exemples). Maximum 500 lignes.</p>
  </ToolShell>
</template>
