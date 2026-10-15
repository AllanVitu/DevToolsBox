<script setup>
import { computed, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import { CHEATSHEETS, CHEAT_CATEGORIES } from '@/data/cheatsheets';
import { NEW_SHEETS } from '@/data/catalog';
import { rank } from '@/lib/search';

const query = ref('');
const matches = computed(() => rank(CHEATSHEETS, query.value, (c) => [c.title, c.summary, ...c.keywords]));
const groups = computed(() =>
  CHEAT_CATEGORIES.map((cat) => ({ ...cat, sheets: matches.value.filter((s) => s.category === cat.id) })).filter((g) => g.sheets.length),
);
const totalItems = CHEATSHEETS.reduce((n, c) => n + c.count, 0);
</script>

<template>
  <div class="page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Aide-mémoire</span>
    </nav>

    <header class="tile tile--tint page-head" data-accent="amber">
      <div>
        <p class="eyebrow eyebrow--accent">{{ CHEATSHEETS.length }} fiches · {{ totalItems }} commandes et syntaxes</p>
        <h1>Aide-mémoire</h1>
        <p class="lead">
          Les commandes et syntaxes qu’on cherche toujours : Git, Docker, PostgreSQL, PowerShell, Nginx, regex, CSS… Un clic sur une
          ligne la copie.
        </p>
      </div>
      <div class="side">
        <div class="searchbar">
          <Icon name="search" />
          <input v-model="query" type="search" placeholder="Chercher une fiche : docker, sql, git…" aria-label="Chercher une fiche" />
        </div>
        <p v-if="NEW_SHEETS.length" class="muted news">
          <span class="chip chip--new">Nouveau</span>
          {{ NEW_SHEETS.map((s) => s.title).join(' · ') }}
        </p>
      </div>
    </header>

    <section v-for="group in groups" :key="group.id" :aria-labelledby="`c-${group.id}`">
      <div class="section-title">
        <h2 :id="`c-${group.id}`" class="c-title">
          <span class="icon-chip" :data-accent="group.accent"><Icon :name="group.icon" /></span>
          {{ group.name }}
        </h2>
        <p>{{ group.sheets.length }} fiche{{ group.sheets.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="cards">
        <RouterLink
          v-for="(sheet, i) in group.sheets"
          :key="sheet.id"
          :to="`/aide-memoire/${sheet.id}`"
          class="tile tile--link sheet-card"
          :data-accent="group.accent"
          :style="{ '--i': i }"
        >
          <div class="top">
            <span class="icon-chip"><Icon :name="sheet.icon" /></span>
            <span v-if="sheet.added" class="chip chip--new">Nouveau</span>
            <span class="count">{{ sheet.count }} lignes</span>
          </div>
          <h3>{{ sheet.title }}</h3>
          <p class="muted">{{ sheet.summary }}</p>
        </RouterLink>
      </div>
    </section>

    <p v-if="!groups.length" class="empty">Aucune fiche ne correspond à « {{ query }} ».</p>
  </div>
</template>

<style scoped>
.c-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.news {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
}

.sheet-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  min-height: 160px;
}

.top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.count {
  margin-left: auto;
  font: 500 12px var(--font-mono);
  color: var(--subtle);
}

h3 {
  font-size: 17px;
}

p {
  font-size: 14px;
  line-height: 1.5;
}
</style>
