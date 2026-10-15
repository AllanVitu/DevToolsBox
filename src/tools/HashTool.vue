<script setup>
import { computed, ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import Segmented from '@/components/Segmented.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';

const ALGOS = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];
const source = usePersistentRef('hash:source', 'text');
const input = usePersistentRef('hash:input', 'Bonjour');
const expected = ref('');
const results = ref({});
const file = ref(null);
const busy = ref(false);

const toHex = (buffer) => Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');

async function compute(data) {
  const out = {};
  for (const algo of ALGOS) out[algo] = toHex(await crypto.subtle.digest(algo, data));
  results.value = out;
}

watch(
  [input, source],
  () => {
    if (source.value === 'text') compute(new TextEncoder().encode(input.value));
  },
  { immediate: true },
);

async function onFile(event) {
  const chosen = event.target.files?.[0];
  if (!chosen) return;
  busy.value = true;
  file.value = { name: chosen.name, size: chosen.size };
  try {
    await compute(await chosen.arrayBuffer());
  } finally {
    busy.value = false;
  }
}

watch(source, (value) => {
  if (value === 'file') {
    results.value = {};
    file.value = null;
  }
});

const match = computed(() => {
  const want = expected.value.trim().toLowerCase().replace(/^sha\d+[:=]\s*/, '');
  if (!want) return null;
  return Object.entries(results.value).find(([, hex]) => hex === want)?.[0] || false;
});
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <Segmented
        v-model="source"
        :options="[
          { value: 'text', label: 'Texte' },
          { value: 'file', label: 'Fichier' },
        ]"
        label="Source"
      />
    </div>

    <div v-if="source === 'text'" class="field">
      <label class="label" for="hash-in">Texte à hacher</label>
      <textarea id="hash-in" v-model="input" rows="4" spellcheck="false" />
    </div>
    <div v-else class="field">
      <label class="label" for="hash-file">Fichier (lu localement, jamais envoyé)</label>
      <input id="hash-file" type="file" @change="onFile" />
      <p v-if="file" class="hint">{{ file.name }} · {{ file.size.toLocaleString('fr-FR') }} octets{{ busy ? ' · calcul…' : '' }}</p>
    </div>

    <div class="kv mt">
      <div v-for="algo in ALGOS" :key="algo" class="kv-row" :class="{ hit: match === algo }">
        <span>{{ algo }}<template v-if="algo === 'SHA-1'"> · obsolète</template></span>
        <code>{{ results[algo] || '—' }}</code>
        <CopyButton :value="results[algo] || ''" label="" icon-only />
      </div>
    </div>

    <div class="field mt">
      <label class="label" for="hash-expected">Comparer avec une empreinte attendue</label>
      <input id="hash-expected" v-model="expected" type="text" spellcheck="false" placeholder="Colle l’empreinte publiée par l’éditeur (SHA-256…)" />
      <p v-if="match" class="status status--ok"><Icon name="circle-check" /> Identique ({{ match }}) : le fichier est bien celui publié.</p>
      <p v-else-if="match === false" class="status status--error"><Icon name="circle-x" /> Aucune empreinte ne correspond : fichier différent ou corrompu.</p>
    </div>
    <p class="hint mt">
      Une empreinte vérifie l’intégrité d’un téléchargement (pilote, ISO…). Pour stocker des mots de passe, n’utilise jamais un hash
      simple : il faut bcrypt ou Argon2. SHA-1 n’est plus sûr face aux collisions.
    </p>
  </ToolShell>
</template>

<style scoped>
.kv-row.hit {
  border-color: var(--ok-fill);
  background: color-mix(in srgb, var(--ok-fill) 10%, var(--tile));
}
</style>
