import { computed, ref } from 'vue';
import { readJSON, writeJSON } from '@/lib/storage';

// { [lessonId]: { best: number, total: number } } — même format que les versions précédentes.
const progress = ref(readJSON('progress', {}) || {});

export function recordQuiz(lessonId, score, total) {
  const previous = progress.value[lessonId];
  if (previous && previous.best >= score && previous.total === total) return;
  progress.value = { ...progress.value, [lessonId]: { best: score, total } };
  writeJSON('progress', progress.value);
}

export function lessonResult(lessonId) {
  return progress.value[lessonId] || null;
}

export function isLessonDone(lessonId) {
  return Boolean(progress.value[lessonId]);
}

export function resetProgress() {
  progress.value = {};
  writeJSON('progress', progress.value);
}

export function useProgress(ids = []) {
  const completedCount = computed(() => ids.filter((id) => isLessonDone(id)).length);
  const percent = computed(() => (ids.length ? Math.round((completedCount.value / ids.length) * 100) : 0));
  return { progress, completedCount, percent, recordQuiz, lessonResult, isLessonDone, resetProgress };
}
