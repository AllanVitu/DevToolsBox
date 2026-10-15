<script setup>
import Icon from './Icon.vue';
import CopyButton from './CopyButton.vue';
import MarkdownView from './MarkdownView.vue';

// Panneau « Analyse IA » affiché sous un outil. Reçoit l'état de useToolAI().
defineProps({ ai: { type: Object, required: true } });
</script>

<template>
  <Transition name="ai-slide">
    <section v-if="ai.visible.value" class="ai-panel" aria-live="polite" data-accent="violet">
      <header class="ai-head">
        <span class="icon-chip"><Icon name="sparkles" /></span>
        <div>
          <p class="eyebrow eyebrow--accent">Analyse IA</p>
          <p class="hint">Réponse générée par Claude : à vérifier avant de s’en servir.</p>
        </div>
        <div class="row">
          <CopyButton v-if="ai.output.value && !ai.running.value" :value="ai.output.value" />
          <button v-if="ai.running.value" class="btn btn--sm" type="button" @click="ai.stop"><Icon name="square" /> Arrêter</button>
          <button v-else class="btn btn--sm btn--icon" type="button" aria-label="Fermer l’analyse" @click="ai.close"><Icon name="x" /></button>
        </div>
      </header>
      <p v-if="ai.error.value" class="alert alert--error"><Icon name="circle-x" /> <span>{{ ai.error.value }}</span></p>
      <template v-else>
        <MarkdownView :source="ai.output.value" />
        <p v-if="ai.running.value && !ai.output.value" class="thinking">Claude réfléchit…</p>
        <span v-else-if="ai.running.value" class="caret" aria-hidden="true" />
      </template>
      <p v-if="ai.notice.value" class="alert alert--warn"><Icon name="info" /> <span>{{ ai.notice.value }}</span></p>
      <p v-if="!ai.error.value && !ai.hasKey.value" class="hint">
        <RouterLink to="/ai">Configurer la clé API →</RouterLink>
      </p>
    </section>
  </Transition>
</template>

<style scoped>
.ai-panel {
  display: grid;
  gap: 14px;
  margin-top: 22px;
  padding: 20px;
  border-radius: var(--r-lg);
  border: 1px solid color-mix(in srgb, var(--accent-fill) 35%, transparent);
  background: linear-gradient(160deg, color-mix(in srgb, var(--accent-fill) 8%, var(--tile)), var(--tile) 70%);
}

.ai-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-head > div:nth-child(2) {
  flex: 1;
}

.thinking {
  color: var(--muted);
  font-style: italic;
}

.caret {
  display: inline-block;
  width: 9px;
  height: 18px;
  border-radius: 2px;
  background: var(--accent-fill);
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}

.ai-slide-enter-active,
.ai-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.3s var(--ease);
}

.ai-slide-enter-from,
.ai-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
