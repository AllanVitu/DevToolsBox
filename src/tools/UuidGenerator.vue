<script setup>
import { computed, ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { uuidV4 } from '@/lib/ids';

const count = usePersistentRef('uuid:count', 5);
const upper = usePersistentRef('uuid:upper', false);
const braces = usePersistentRef('uuid:braces', false);
const list = ref([]);

function generate() {
  const n = Math.min(Math.max(Number(count.value) || 1, 1), 1000);
  list.value = Array.from({ length: n }, () => {
    const id = upper.value ? uuidV4().toUpperCase() : uuidV4();
    return braces.value ? `{${id}}` : id;
  });
}
watch([count, upper, braces], generate, { immediate: true });
const output = computed(() => list.value.join('\n'));
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <label class="inline-field">Quantité <input v-model.number="count" type="number" min="1" max="1000" style="width: 100px" /></label>
      <label class="check"><input v-model="upper" type="checkbox" /> Majuscules</label>
      <label class="check"><input v-model="braces" type="checkbox" /> Accolades {…}</label>
      <button class="btn btn--accent" type="button" @click="generate"><Icon name="refresh-cw" /> Générer</button>
    </div>
    <OutputBox :label="`${list.length} UUID v4`" :value="output" :rows="Math.min(list.length + 1, 18)" />
    <p class="hint mt">
      122 bits aléatoires (crypto.randomUUID) : une collision est pratiquement impossible. Besoin d’identifiants triables par date ? Utilise
      <RouterLink to="/sortableids">ULID / UUID v7</RouterLink>.
    </p>
  </ToolShell>
</template>

<style scoped>
.hint a {
  color: var(--accent);
  text-decoration: underline;
}
</style>
