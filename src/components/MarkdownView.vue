<script setup>
import { computed } from 'vue';
import CopyButton from './CopyButton.vue';
import { renderMarkdown, splitFences } from '@/lib/markdown';

// Affiche du Markdown (réponses de l'IA) : les blocs de code ont leur propre bouton
// « Copier », le reste passe par le moteur Markdown sûr de lib/markdown.js.
const props = defineProps({ source: { type: String, default: '' } });

const segments = computed(() =>
  splitFences(props.source).map((s) => (s.type === 'md' ? { ...s, html: renderMarkdown(s.text) } : s)),
);
</script>

<template>
  <div class="md">
    <template v-for="(segment, i) in segments" :key="i">
      <!-- eslint-disable-next-line vue/no-v-html -- HTML échappé par lib/markdown.js -->
      <div v-if="segment.type === 'md'" class="md-body" v-html="segment.html" />
      <div v-else class="codeblock">
        <div class="codeblock-head">
          <span class="eyebrow">{{ segment.lang || 'code' }}</span>
          <CopyButton :value="segment.code" label="" icon-only />
        </div>
        <pre><code>{{ segment.code }}</code></pre>
      </div>
    </template>
  </div>
</template>

<style scoped>
.md {
  display: grid;
  gap: 12px;
}
</style>
