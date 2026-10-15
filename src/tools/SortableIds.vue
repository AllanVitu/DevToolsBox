<script setup>
import { computed, ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { createUlidFactory, timeOf, uuidV7 } from '@/lib/ids';

const kind = usePersistentRef('sortableids:kind', 'ulid');
const count = usePersistentRef('sortableids:count', 5);
const list = ref([]);
const inspect = ref('');

function generate() {
  const n = Math.min(Math.max(Number(count.value) || 1, 1), 1000);
  const ulid = createUlidFactory();
  list.value = Array.from({ length: n }, () => (kind.value === 'ulid' ? ulid() : uuidV7()));
}
watch([kind, count], generate, { immediate: true });

const output = computed(() => list.value.join('\n'));
const decoded = computed(() => {
  if (!inspect.value.trim()) return null;
  const date = timeOf(inspect.value);
  return date ? date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' }) + ` (${date.toISOString()})` : false;
});
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <Segmented
        v-model="kind"
        :options="[
          { value: 'ulid', label: 'ULID' },
          { value: 'uuidv7', label: 'UUID v7' },
        ]"
        label="Format"
      />
      <label class="inline-field">Quantité <input v-model.number="count" type="number" min="1" max="1000" style="width: 100px" /></label>
      <button class="btn btn--accent" type="button" @click="generate"><Icon name="refresh-cw" /> Générer</button>
    </div>
    <p class="hint">
      <template v-if="kind === 'ulid'">26 caractères (Base32 de Crockford) : 48 bits de temps + 80 bits aléatoires. Dans une même milliseconde, les ULID restent croissants.</template>
      <template v-else>Format UUID standard (RFC 9562) dont les 48 premiers bits sont l’heure en millisecondes : idéal comme clé primaire triable.</template>
    </p>
    <OutputBox class="mt" :label="`${list.length} identifiants triés par ordre de création`" :value="output" :rows="Math.min(list.length + 1, 16)" />

    <div class="field mt">
      <label class="label" for="ids-inspect">Lire la date d’un ULID ou d’un UUID v7</label>
      <input id="ids-inspect" v-model="inspect" type="text" spellcheck="false" placeholder="01J… ou 0199…-7…" />
      <p v-if="decoded" class="status status--ok"><Icon name="clock" /> {{ decoded }}</p>
      <p v-else-if="decoded === false" class="status status--error"><Icon name="circle-x" /> Ni un ULID, ni un UUID v7.</p>
    </div>
  </ToolShell>
</template>
