<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { convertDotenv } from '@/lib/dotenv';

const mode = usePersistentRef('dotenv:mode', 'env2json');
const input = usePersistentRef(
  'dotenv:input',
  '# Configuration locale — ne jamais committer ce fichier\nDATABASE_URL=postgres://app:secret@db:5432/app\nAPP_URL="http://localhost:8080"\nMAIL_HOST=mailpit # SMTP de test\nDEBUG=true',
);

const result = computed(() => convertDotenv(input.value, mode.value));

function switchMode(next) {
  if (next === mode.value) return;
  if (result.value.text && !result.value.error) input.value = result.value.text;
  mode.value = next;
}

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'env2json' || s.mode === 'json2env') mode.value = s.mode;
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
          { value: 'env2json', label: '.env → JSON' },
          { value: 'json2env', label: 'JSON → .env' },
        ]"
        @update:model-value="switchMode"
      />
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="env-in">{{ mode === 'env2json' ? 'Fichier .env' : 'JSON (objet clé / valeur)' }}</label>
        <textarea id="env-in" v-model="input" rows="12" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'env2json' ? 'JSON' : '.env'" :value="result.text" :rows="12" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="alert alert--warn mt">
      <Icon name="triangle-alert" />
      <span>Évite de partager un lien contenant de vrais secrets : le contenu de l’outil est encodé dans l’URL.</span>
    </p>
  </ToolShell>
</template>
