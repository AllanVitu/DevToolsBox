<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Icon from '@/components/Icon.vue';
import ToolCard from '@/components/ToolCard.vue';
import { FAMILIES, getFamily } from '@/data/families';
import { TOOLS } from '@/data/tools';
import { rank } from '@/lib/search';

const route = useRoute();
const family = computed(() => getFamily(route.params.family));
const query = ref('');

const pool = computed(() => (family.value ? TOOLS.filter((t) => t.family === family.value.id) : TOOLS));
const matches = computed(() => rank(pool.value, query.value, (t) => [t.name, t.desc, ...t.keywords]));

// Sans recherche : regroupé par famille. Avec recherche : une liste triée par pertinence.
const groups = computed(() => {
  if (query.value.trim()) {
    const n = matches.value.length;
    return n ? [{ id: 'results', name: `${n} résultat${n > 1 ? 's' : ''}`, tools: matches.value }] : [];
  }
  return FAMILIES.filter((f) => !family.value || f.id === family.value.id)
    .map((f) => ({ ...f, tools: pool.value.filter((t) => t.family === f.id) }))
    .filter((g) => g.tools.length);
});

const counts = Object.fromEntries(FAMILIES.map((f) => [f.id, TOOLS.filter((t) => t.family === f.id).length]));
</script>

<template>
  <div class="page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink v-if="family" to="/outils">Outils</RouterLink>
      <span v-else aria-current="page">Outils</span>
      <template v-if="family">
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ family.name }}</span>
      </template>
    </nav>

    <header class="tile tile--tint page-head" :data-accent="family?.accent || 'indigo'">
      <div>
        <p class="eyebrow eyebrow--accent">{{ family ? 'Famille d’outils' : 'Catalogue' }}</p>
        <h1>{{ family ? family.name : 'Les outils' }}</h1>
        <p class="lead">
          {{
            family
              ? family.desc
              : `${TOOLS.length} outils rangés en ${FAMILIES.length} familles. Chacun tourne dans le navigateur, sans envoyer ta saisie nulle part.`
          }}
        </p>
      </div>
      <div class="side">
        <div class="searchbar">
          <Icon name="search" />
          <input v-model="query" type="search" placeholder="Filtrer : json, regex, docker…" aria-label="Filtrer les outils" autocomplete="off" />
        </div>
        <nav class="filters" aria-label="Familles">
          <RouterLink to="/outils" class="chip" :class="{ 'chip--accent': !family }">Toutes · {{ TOOLS.length }}</RouterLink>
          <RouterLink v-for="f in FAMILIES" :key="f.id" :to="`/outils/${f.id}`" class="chip" :class="{ 'chip--accent': family?.id === f.id }">
            {{ f.name }} · {{ counts[f.id] }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <section v-for="group in groups" :key="group.id" :aria-labelledby="`g-${group.id}`">
      <div class="section-title">
        <h2 :id="`g-${group.id}`" class="g-title">
          <span v-if="group.icon" class="icon-chip" :data-accent="group.accent"><Icon :name="group.icon" /></span>
          {{ group.name }}
        </h2>
        <p v-if="group.desc">{{ group.tools.length }} outil{{ group.tools.length > 1 ? 's' : '' }} · {{ group.desc }}</p>
      </div>
      <div class="cards">
        <ToolCard v-for="(tool, i) in group.tools" :key="tool.id" :tool="tool" :style="{ '--i': i }" />
      </div>
    </section>

    <p v-if="!groups.length" class="empty">Aucun outil ne correspond à « {{ query }} ». Essaie un autre mot, ou la palette (Ctrl + K).</p>
  </div>
</template>

<style scoped>
.g-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
