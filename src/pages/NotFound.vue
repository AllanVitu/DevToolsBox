<script setup>
import Icon from '@/components/Icon.vue';
import { openPalette } from '@/lib/events';
</script>

<template>
  <div class="page">
    <section class="tile tile--dashed nf" data-accent="amber">
      <p class="code">404</p>
      <h1>Cette page n’existe pas</h1>
      <p class="muted">Le lien est peut-être ancien, ou l’outil a changé de nom. Tout le contenu reste accessible depuis la recherche.</p>
      <div class="row">
        <button class="btn btn--ink" type="button" @click="openPalette"><Icon name="search" /> Rechercher</button>
        <RouterLink to="/outils" class="btn">Tous les outils</RouterLink>
        <RouterLink to="/dashboard" class="btn btn--ghost">Tableau de bord</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nf {
  display: grid;
  gap: 12px;
  justify-items: start;
  max-width: 720px;
  margin: 40px auto;
  padding: 40px;
}

.code {
  font-size: 96px;
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 0.9;
  color: var(--accent);
}

h1 {
  font-size: clamp(28px, 3.4vw, 42px);
}
</style>
