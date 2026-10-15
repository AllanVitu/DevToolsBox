<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { usePipeline } from '@/composables/usePipeline';
import { jsonToTs } from '@/lib/jsonToTs';

const input = usePersistentRef(
  'jsonts:input',
  '{\n  "id": 1,\n  "nom": "Allan",\n  "actif": true,\n  "adresse": { "ville": "Mulhouse", "cp": "68100" },\n  "roles": ["admin", "user"],\n  "projets": [\n    { "nom": "DevToolbox", "etoiles": 12 },\n    { "nom": "BoxCraft", "etoiles": 4, "jeu": "Minecraft" }\n  ]\n}',
);
const root = usePersistentRef('jsonts:root', 'Utilisateur');
const exportKeyword = usePersistentRef('jsonts:export', true);

const result = computed(() => {
  if (!input.value.trim()) return { text: '', error: '' };
  try {
    return { text: jsonToTs(JSON.parse(input.value), root.value || 'Root', { exportKeyword: exportKeyword.value }), error: '' };
  } catch (e) {
    return { text: '', error: e.message };
  }
});

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['json']);
  if (item) input.value = item.content;
});
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <label class="inline-field">
        Nom racine
        <input v-model="root" type="text" spellcheck="false" style="width: 180px" />
      </label>
      <label class="check"><input v-model="exportKeyword" type="checkbox" /> Ajouter <code>export</code></label>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="ts-in">JSON d’exemple</label>
        <textarea id="ts-in" v-model="input" rows="18" spellcheck="false" />
      </div>
      <OutputBox label="Interfaces TypeScript" :value="result.text" :rows="18" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="hint mt">Les objets d’un même tableau sont fusionnés : une clé absente de certains devient optionnelle (<code>?</code>).</p>
  </ToolShell>
</template>
