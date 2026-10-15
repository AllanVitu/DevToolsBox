<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';
import { TRACKS } from '@/data/lessons';
import { lessonResult } from '@/composables/useProgress';

const props = defineProps({ lesson: { type: Object, required: true } });
const track = computed(() => TRACKS.find((t) => t.id === props.lesson.track));
const result = computed(() => lessonResult(props.lesson.id));
</script>

<template>
  <RouterLink :to="`/apprendre/${lesson.id}`" class="tile tile--link lesson-card" :class="{ done: result }" :data-accent="track?.accent">
    <div class="top">
      <span class="num">{{ String(lesson.number).padStart(2, '0') }}</span>
      <span class="icon-chip"><Icon :name="lesson.icon" /></span>
      <span v-if="lesson.added" class="chip chip--new">Nouveau</span>
      <span v-if="result" class="done-badge" :title="`Quiz : ${result.best} / ${result.total}`"><Icon name="check" /></span>
    </div>
    <h3>{{ lesson.title }}</h3>
    <p class="muted">{{ lesson.summary }}</p>
    <div class="meta">
      <span class="chip"><Icon name="clock" /> {{ lesson.readingTime }} min</span>
      <span v-if="result" class="chip chip--ok">Quiz {{ result.best }}/{{ result.total }}</span>
      <span v-else-if="lesson.quizCount" class="chip">{{ lesson.quizCount }} questions</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.lesson-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.num {
  font: 600 13px var(--font-mono);
  color: var(--subtle);
}

.done-badge {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-left: auto;
  border-radius: 50%;
  background: var(--ok-fill);
  color: #04130d;
}

.done-badge .icon {
  width: 15px;
  height: 15px;
  stroke-width: 3;
}

h3 {
  font-size: 17px;
  letter-spacing: -0.02em;
}

p {
  font-size: 14px;
  line-height: 1.5;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
}
</style>
