<script setup>
import { TOOLS } from '@/data/tools';
import { LESSONS } from '@/data/lessons';
import { CHEATSHEETS } from '@/data/cheatsheets';
import { LINKS } from '@/data/site';
</script>

<template>
  <footer class="app-footer">
    <p>
      DevToolbox v3 · {{ TOOLS.length }} outils · {{ LESSONS.length }} leçons · {{ CHEATSHEETS.length }} fiches · tout tourne dans ton navigateur
    </p>
    <nav aria-label="Liens annexes">
      <RouterLink to="/confidentialite">Confidentialité &amp; mentions</RouterLink>
      <a :href="LINKS.portfolio" target="_blank" rel="noopener">Portfolio</a>
      <a :href="LINKS.repo" target="_blank" rel="noopener">Code source</a>
    </nav>
  </footer>
</template>

<style scoped>
.app-footer {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 8px 26px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font: 12.5px var(--font-mono);
  color: var(--subtle);
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

a:hover {
  color: var(--ink);
}
</style>
