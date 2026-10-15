<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import OutputBox from '@/components/OutputBox.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { decodeEntities, encodeEntities } from '@/lib/htmlEntities';

const mode = usePersistentRef('html:mode', 'encode');
const scope = usePersistentRef('html:scope', 'special');
const input = usePersistentRef('html:input', '<a href="page.html?x=1&y=2">Café & thé 👋</a>');

const output = computed(() => (mode.value === 'encode' ? encodeEntities(input.value, scope.value) : decodeEntities(input.value)));
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <Segmented
        v-model="mode"
        :options="[
          { value: 'encode', label: 'Échapper' },
          { value: 'decode', label: 'Déséchapper' },
        ]"
      />
      <label v-if="mode === 'encode'" class="inline-field">
        Caractères
        <select v-model="scope">
          <option value="special">Spéciaux seulement (&amp; &lt; &gt; " ')</option>
          <option value="all">Aussi tout le non-ASCII (é, emojis…)</option>
        </select>
      </label>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="html-in">{{ mode === 'encode' ? 'Texte ou HTML' : 'Texte avec entités' }}</label>
        <textarea id="html-in" v-model="input" rows="10" spellcheck="false" />
      </div>
      <OutputBox label="Résultat" :value="output" :rows="10" />
    </div>
    <p class="hint mt">
      Échapper avant d’insérer du texte dans une page empêche qu’il soit interprété comme du HTML — c’est la base de la protection contre
      les failles XSS. En Vue, <code v-pre>{{ }}</code> le fait automatiquement ; <code>v-html</code>, non.
    </p>
  </ToolShell>
</template>
