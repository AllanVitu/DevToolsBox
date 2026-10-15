<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Icon from '@/components/Icon.vue';
import CopyableCode from '@/components/CopyableCode.vue';
import { CHEAT_CATEGORIES, getCheatsheet, loadCheatsheet } from '@/data/cheatsheets';
import { normalize } from '@/lib/search';

const route = useRoute();
const meta = computed(() => getCheatsheet(route.params.id));
const sheet = ref(null);
const filter = ref('');

watchEffect(async () => {
  sheet.value = await loadCheatsheet(route.params.id);
});

const category = computed(() => CHEAT_CATEGORIES.find((c) => c.id === meta.value?.category));

// Filtre en direct sur le code et la description de chaque ligne.
const groups = computed(() => {
  if (!sheet.value) return [];
  const q = normalize(filter.value.trim());
  if (!q) return sheet.value.groups;
  return sheet.value.groups
    .map((g) => ({ ...g, items: g.items.filter((it) => normalize(`${it.code} ${it.desc}`).includes(q)) }))
    .filter((g) => g.items.length);
});
</script>

<template>
  <div class="page">
    <template v-if="meta">
      <nav class="crumbs" aria-label="Fil d’Ariane">
        <RouterLink to="/aide-memoire">Aide-mémoire</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ category?.name }}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ meta.title }}</span>
      </nav>

      <header class="tile tile--tint page-head" :data-accent="category?.accent">
        <div>
          <p class="eyebrow eyebrow--accent">
            Aide-mémoire · {{ category?.name }}
            <span v-if="meta.added" class="chip chip--new">Nouveau</span>
          </p>
          <h1>{{ meta.title }}</h1>
          <p class="lead">{{ meta.summary }}</p>
        </div>
        <div class="side">
          <div class="searchbar">
            <Icon name="search" />
            <input v-model="filter" type="search" placeholder="Filtrer les lignes…" aria-label="Filtrer les lignes de la fiche" />
          </div>
          <p class="hint"><Icon name="copy" /> Clique sur une commande pour la copier.</p>
        </div>
      </header>

      <div v-if="sheet" class="groups">
        <section v-for="(group, gi) in groups" :key="group.title" class="tile tile--flat group" :style="{ '--i': gi }">
          <h2 class="eyebrow">{{ group.title }}</h2>
          <div class="rows">
            <div v-for="item in group.items" :key="item.code" class="item">
              <CopyableCode :value="item.code" />
              <!-- eslint-disable-next-line vue/no-v-html -- description rendue au build -->
              <p class="desc" v-html="item.desc" />
            </div>
          </div>
        </section>
      </div>
      <p v-if="sheet && !groups.length" class="empty">Aucune ligne ne correspond à « {{ filter }} ».</p>
    </template>

    <section v-else class="tile missing">
      <h1>Fiche introuvable</h1>
      <p class="muted">Cette fiche n’existe pas ou a été renommée.</p>
      <RouterLink to="/aide-memoire" class="btn btn--ink">Voir toutes les fiches</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.page-head .eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
}

.groups {
  columns: 2 420px;
  column-gap: var(--gap);
  margin-top: var(--gap);
}

.group {
  break-inside: avoid;
  margin-bottom: var(--gap);
  padding: 22px;
}

.group h2 {
  margin-bottom: 14px;
}

.rows {
  display: grid;
  gap: 4px;
}

.item {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.item:last-child {
  border-bottom: 0;
}

.desc {
  font-size: 14px;
  color: var(--muted);
  padding-left: 2px;
}

.desc :deep(code) {
  font-size: 0.88em;
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--soft);
}

.missing {
  display: grid;
  gap: 12px;
  justify-items: start;
  max-width: 640px;
  margin: 40px auto;
  padding: 34px;
}
</style>
