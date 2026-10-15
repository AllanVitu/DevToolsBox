<script setup>
import { computed, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import LessonCard from '@/components/LessonCard.vue';
import { LESSONS, TRACKS } from '@/data/lessons';
import { NEW_LESSONS } from '@/data/catalog';
import { useProgress } from '@/composables/useProgress';
import { rank } from '@/lib/search';

const { completedCount, percent } = useProgress(LESSONS.map((l) => l.id));
const filter = ref('all');
const query = ref('');

const pool = computed(() => {
  let list = LESSONS;
  if (filter.value === 'new') list = list.filter((l) => l.added);
  else if (filter.value !== 'all') list = list.filter((l) => l.track === filter.value);
  return rank(list, query.value, (l) => [l.title, l.summary, ...l.keywords]);
});

const groups = computed(() =>
  TRACKS.map((t) => ({ ...t, lessons: pool.value.filter((l) => l.track === t.id) })).filter((g) => g.lessons.length),
);
</script>

<template>
  <div class="page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Apprendre</span>
    </nav>

    <header class="tile tile--tint page-head" data-accent="violet">
      <div>
        <p class="eyebrow eyebrow--accent">{{ TRACKS.length }} parcours · {{ LESSONS.length }} leçons</p>
        <h1>Apprendre</h1>
        <p class="lead">
          Des leçons courtes, du code commenté et un quiz à la fin de chacune — du premier composant Vue jusqu’au déploiement
          avec Docker, en passant par la sécurité et PostgreSQL.
        </p>
      </div>
      <div class="side">
        <div class="progress">
          <div class="row row--between">
            <span class="label">Ta progression</span>
            <span class="mono small">{{ completedCount }} / {{ LESSONS.length }} · {{ percent }} %</span>
          </div>
          <div class="meter" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Leçons terminées">
            <span :style="{ width: `${percent}%` }" />
          </div>
        </div>
        <div class="searchbar">
          <Icon name="search" />
          <input v-model="query" type="search" placeholder="Chercher une leçon : docker, sql, vue…" aria-label="Chercher une leçon" />
        </div>
        <div class="filters" role="group" aria-label="Filtrer par parcours">
          <button class="chip" type="button" :class="{ 'chip--accent': filter === 'all' }" :aria-pressed="filter === 'all'" @click="filter = 'all'">Toutes</button>
          <button class="chip" type="button" :class="{ 'chip--accent': filter === 'new' }" :aria-pressed="filter === 'new'" @click="filter = 'new'">
            Nouvelles · {{ NEW_LESSONS.length }}
          </button>
          <button
            v-for="t in TRACKS"
            :key="t.id"
            class="chip"
            type="button"
            :class="{ 'chip--accent': filter === t.id }"
            :aria-pressed="filter === t.id"
            @click="filter = t.id"
          >
            {{ t.name }}
          </button>
        </div>
      </div>
    </header>

    <section v-for="group in groups" :key="group.id" :aria-labelledby="`t-${group.id}`">
      <div class="section-title">
        <h2 :id="`t-${group.id}`" class="t-title">
          <span class="icon-chip" :data-accent="group.accent"><Icon :name="group.icon" /></span>
          {{ group.name }}
        </h2>
        <p>{{ group.lessons.length }} leçon{{ group.lessons.length > 1 ? 's' : '' }} · {{ group.desc }}</p>
      </div>
      <div class="cards">
        <LessonCard v-for="(lesson, i) in group.lessons" :key="lesson.id" :lesson="lesson" :style="{ '--i': i }" />
      </div>
    </section>

    <p v-if="!groups.length" class="empty">Aucune leçon ne correspond à cette recherche.</p>
  </div>
</template>

<style scoped>
.progress {
  display: grid;
  gap: 8px;
}

.small {
  font-size: 12.5px;
  color: var(--muted);
}

.t-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
