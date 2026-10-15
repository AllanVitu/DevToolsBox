<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from '@/components/Icon.vue';
import CodeBlock from '@/components/CodeBlock.vue';
import LessonQuiz from '@/components/LessonQuiz.vue';
import { LESSONS, TRACKS, getLesson, loadLesson } from '@/data/lessons';
import { getTool } from '@/data/tools';
import { getFamily } from '@/data/families';
import { lessonResult } from '@/composables/useProgress';

const route = useRoute();
const router = useRouter();

const meta = computed(() => getLesson(route.params.id));
const lesson = ref(null);
const loading = ref(true);

watchEffect(async () => {
  const id = route.params.id;
  loading.value = true;
  lesson.value = await loadLesson(id);
  loading.value = false;
});

const track = computed(() => TRACKS.find((t) => t.id === meta.value?.track));
const index = computed(() => LESSONS.findIndex((l) => l.id === meta.value?.id));
const prev = computed(() => (index.value > 0 ? LESSONS[index.value - 1] : null));
const next = computed(() => (index.value >= 0 && index.value < LESSONS.length - 1 ? LESSONS[index.value + 1] : null));
const tools = computed(() => (meta.value?.tools || []).map(getTool).filter(Boolean));
const result = computed(() => (meta.value ? lessonResult(meta.value.id) : null));

const CALLOUT_ICONS = { info: 'info', tip: 'lightbulb', warn: 'triangle-alert', danger: 'circle-x' };

// Le routage utilise le hash de l'URL : les ancres du sommaire défilent donc à la main.
function scrollToHeading(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

// Les liens internes des leçons (rendus en HTML au build) passent par le routeur.
function onArticleClick(event) {
  const link = event.target.closest?.('a[data-route]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  router.push(link.dataset.route);
}
</script>

<template>
  <div class="page">
    <template v-if="meta">
      <nav class="crumbs" aria-label="Fil d’Ariane">
        <RouterLink to="/apprendre">Apprendre</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ track?.name }}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ meta.title }}</span>
      </nav>

      <header class="tile tile--tint page-head lesson-head" :data-accent="track?.accent">
        <div>
          <p class="eyebrow eyebrow--accent">
            Leçon {{ String(meta.number).padStart(2, '0') }} · {{ track?.name }}
            <span v-if="meta.added" class="chip chip--new">Nouveau</span>
          </p>
          <h1>{{ meta.title }}</h1>
          <p class="lead">{{ meta.summary }}</p>
        </div>
        <div class="side">
          <div class="facts">
            <span class="chip"><Icon name="clock" /> {{ meta.readingTime }} min de lecture</span>
            <span v-if="meta.quizCount" class="chip"><Icon name="brain" /> Quiz de {{ meta.quizCount }} questions</span>
            <span v-if="result" class="chip chip--ok"><Icon name="check" /> Validée · {{ result.best }}/{{ result.total }}</span>
          </div>
          <div v-if="tools.length" class="try">
            <span class="label">Mettre en pratique</span>
            <div class="filters">
              <RouterLink v-for="t in tools" :key="t.id" :to="`/${t.id}`" class="chip chip--accent"><Icon :name="t.icon" /> {{ t.name }}</RouterLink>
            </div>
          </div>
        </div>
      </header>

      <div class="layout">
        <article class="tile tile--flat article" @click="onArticleClick">
          <div v-if="loading" class="skeleton" aria-busy="true">
            <span v-for="n in 6" :key="n" />
          </div>
          <div v-else-if="lesson" class="prose">
            <template v-for="(block, i) in lesson.blocks" :key="i">
              <!-- eslint-disable vue/no-v-html -- HTML généré au build depuis src/content -->
              <h2 v-if="block.type === 'heading'" :id="block.id" v-html="block.html" />
              <h3 v-else-if="block.type === 'subheading'" :id="block.id" v-html="block.html" />
              <p v-else-if="block.type === 'text'" v-html="block.html" />
              <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.type === 'list'">
                <li v-for="(item, j) in block.items" :key="j" v-html="item" />
              </component>
              <div v-else-if="block.type === 'callout'" class="callout" :class="`callout--${block.variant}`">
                <Icon :name="CALLOUT_ICONS[block.variant] || 'info'" />
                <p v-html="block.html" />
              </div>
              <div v-else-if="block.type === 'table'" class="prose-table">
                <table>
                  <thead>
                    <tr><th v-for="(h, j) in block.head" :key="j" v-html="h" /></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, r) in block.rows" :key="r"><td v-for="(cell, c) in row" :key="c" v-html="cell" /></tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock v-else-if="block.type === 'code'" :code="block.code" :html="block.html" :label="block.label" />
              <!-- eslint-enable vue/no-v-html -->
            </template>
          </div>
        </article>

        <aside class="aside">
          <nav v-if="lesson?.toc.length > 2" class="tile tile--flat toc" aria-label="Sommaire de la leçon">
            <p class="eyebrow">Sommaire</p>
            <ol>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <li v-for="h in lesson.toc" :key="h.id"><a :href="`#${h.id}`" @click.prevent="scrollToHeading(h.id)" v-html="h.html" /></li>
            </ol>
          </nav>
          <section v-for="t in tools" :key="t.id" class="tile tile--flat try-tile" :data-accent="getFamily(t.family)?.accent">
            <span class="icon-chip"><Icon :name="t.icon" /></span>
            <div>
              <p class="eyebrow">Essayer l’outil</p>
              <p class="try-name">{{ t.name }}</p>
              <p class="muted small">{{ t.desc }}</p>
            </div>
            <RouterLink :to="`/${t.id}`" class="btn btn--sm btn--ink">Ouvrir <Icon name="arrow-right" /></RouterLink>
          </section>
        </aside>
      </div>

      <LessonQuiz v-if="lesson?.quiz.length" :key="lesson.id" class="quiz" :questions="lesson.quiz" :lesson-id="lesson.id" />

      <nav class="pager" aria-label="Leçons voisines">
        <RouterLink v-if="prev" :to="`/apprendre/${prev.id}`" class="tile tile--link prev">
          <Icon name="arrow-left" />
          <span><span class="eyebrow">Leçon précédente</span><span class="ttl">{{ prev.title }}</span></span>
        </RouterLink>
        <RouterLink v-if="next" :to="`/apprendre/${next.id}`" class="tile tile--link next">
          <Icon name="arrow-right" />
          <span><span class="eyebrow">Leçon suivante</span><span class="ttl">{{ next.title }}</span></span>
        </RouterLink>
      </nav>
    </template>

    <section v-else class="tile missing">
      <h1>Leçon introuvable</h1>
      <p class="muted">Cette leçon n’existe pas ou a été renommée.</p>
      <RouterLink to="/apprendre" class="btn btn--ink">Voir toutes les leçons</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.lesson-head .eyebrow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.try {
  display: grid;
  gap: 8px;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--gap);
  margin-top: var(--gap);
  align-items: start;
}

.article {
  padding: 36px 40px;
}

.prose {
  max-width: 76ch;
}

.aside {
  position: sticky;
  top: calc(var(--header-h) + 8px);
  display: grid;
  gap: var(--gap);
}

.toc {
  padding: 20px;
}

.toc ol {
  display: grid;
  gap: 2px;
  margin-top: 10px;
  counter-reset: toc;
}

.toc li {
  counter-increment: toc;
}

.toc a {
  display: flex;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--muted);
}

.toc a::before {
  content: counter(toc, decimal-leading-zero);
  font: 500 11.5px/1.9 var(--font-mono);
  color: var(--subtle);
}

.toc a:hover {
  background: var(--soft);
  color: var(--ink);
}

.toc a :deep(code) {
  font-size: 0.9em;
}

.try-tile {
  display: grid;
  gap: 12px;
  padding: 20px;
  justify-items: start;
}

.try-name {
  font-weight: 750;
  font-size: 16px;
  letter-spacing: -0.02em;
}

.small {
  font-size: 13.5px;
  line-height: 1.5;
}

.quiz {
  margin-top: var(--gap);
}

.pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap);
  margin-top: var(--gap);
}

.pager a {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 26px;
}

.pager a > span {
  display: grid;
  gap: 2px;
}

.pager .icon {
  width: 20px;
  height: 20px;
  color: var(--accent);
  flex: none;
}

.pager .next {
  grid-column: 2;
  flex-direction: row-reverse;
  text-align: right;
}

.ttl {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.skeleton {
  display: grid;
  gap: 14px;
}

.skeleton span {
  height: 16px;
  border-radius: 8px;
  background: var(--soft-2);
  animation: pulse 1.2s ease-in-out infinite alternate;
}

.skeleton span:nth-child(3n) {
  width: 70%;
}

@keyframes pulse {
  to {
    opacity: 0.45;
  }
}

.missing {
  display: grid;
  gap: 12px;
  justify-items: start;
  max-width: 640px;
  margin: 40px auto;
  padding: 34px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .aside {
    position: static;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }

  .toc {
    display: none;
  }
}

@media (max-width: 640px) {
  .article {
    padding: 22px 20px;
  }

  .pager {
    grid-template-columns: minmax(0, 1fr);
  }

  .pager .next {
    grid-column: 1;
    flex-direction: row;
    text-align: left;
  }
}
</style>
