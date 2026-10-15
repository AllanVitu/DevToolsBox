<script setup>
import { computed, onErrorCaptured, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from './Icon.vue';
import { getTool } from '@/data/tools';
import { clearToolKeys } from '@/lib/storage';

const route = useRoute();
const router = useRouter();
const error = ref(null);
const tool = computed(() => getTool(route.meta.tool));

onErrorCaptured((err) => {
  console.error('[DevToolbox] composant en échec :', err);
  error.value = err;
  return false;
});

watch(
  () => route.fullPath,
  () => (error.value = null),
);

function resetTool() {
  if (tool.value) clearToolKeys(tool.value.id);
  window.location.reload();
}

function goHome() {
  if (route.path !== '/dashboard') router.push('/dashboard');
  else error.value = null;
}
</script>

<template>
  <div v-if="error" class="page">
    <section class="tile boundary" role="alert">
      <span class="icon-chip icon-chip--lg" data-accent="rose"><Icon name="triangle-alert" /></span>
      <h1>Cette page a rencontré une erreur</h1>
      <p class="muted">
        Le reste de l’application fonctionne toujours. Tu peux réessayer, réinitialiser l’outil (ses saisies enregistrées seront
        effacées) ou revenir au tableau de bord.
      </p>
      <div class="row">
        <button v-if="tool" class="btn btn--accent" type="button" @click="resetTool"><Icon name="rotate-ccw" /> Réinitialiser l’outil</button>
        <button class="btn" type="button" @click="error = null">Réessayer</button>
        <button class="btn btn--ghost" type="button" @click="goHome">Tableau de bord</button>
      </div>
      <details>
        <summary>Détails techniques</summary>
        <pre>{{ error?.stack || error?.message || String(error) }}</pre>
      </details>
    </section>
  </div>
  <slot v-else />
</template>

<style scoped>
.boundary {
  display: grid;
  gap: 14px;
  justify-items: start;
  max-width: 760px;
  margin: 40px auto;
  padding: 34px;
}

.boundary h1 {
  font-size: clamp(26px, 3vw, 36px);
}

details {
  width: 100%;
  color: var(--muted);
  font-size: 13px;
}

summary {
  cursor: pointer;
}

pre {
  margin-top: 10px;
  padding: 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  overflow-x: auto;
  font-size: 12px;
}
</style>
