<script setup>
import CopyButton from './CopyButton.vue';

// Bloc de code d'une leçon : `html` est la coloration calculée au build (Shiki),
// `code` le texte brut copié par le bouton.
defineProps({
  code: { type: String, required: true },
  html: { type: String, default: '' },
  label: { type: String, default: 'code' },
});
</script>

<template>
  <figure class="codeblock">
    <figcaption class="codeblock-head">
      <span class="eyebrow">{{ label }}</span>
      <CopyButton :value="code" label="Copier le code" icon-only />
    </figcaption>
    <!-- eslint-disable-next-line vue/no-v-html -- HTML généré au build depuis nos propres leçons -->
    <pre v-if="html"><code v-html="html" /></pre>
    <pre v-else><code>{{ code }}</code></pre>
  </figure>
</template>
