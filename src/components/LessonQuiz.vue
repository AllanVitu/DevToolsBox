<script setup>
import { computed, ref, watch } from 'vue';
import Icon from './Icon.vue';
import { recordQuiz, lessonResult } from '@/composables/useProgress';
import { seededOrder } from '@/lib/shuffle';

const props = defineProps({
  questions: { type: Array, required: true },
  lessonId: { type: String, required: true },
});

// Les options sont présentées dans un ordre mélangé (stable pour une tentative donnée) :
// dans le contenu source, la bonne réponse peut être n'importe où.
const attempt = ref(0);
const picked = ref([]);

const shuffled = computed(() =>
  props.questions.map((q, qi) => {
    const order = seededOrder(q.options.length, `${props.lessonId}:${qi}:${attempt.value}`);
    return { ...q, order };
  }),
);

function reset() {
  picked.value = props.questions.map(() => null);
}
watch(() => props.questions, reset, { immediate: true });

function choose(qi, optionIndex) {
  if (picked.value[qi] !== null) return;
  picked.value[qi] = optionIndex;
}

function stateOf(qi, optionIndex) {
  const choice = picked.value[qi];
  if (choice === null) return '';
  if (optionIndex === props.questions[qi].answer) return 'correct';
  return optionIndex === choice ? 'wrong' : 'dim';
}

const answered = computed(() => picked.value.filter((p) => p !== null).length);
const score = computed(() => picked.value.reduce((n, p, i) => n + (p === props.questions[i].answer ? 1 : 0), 0));
const finished = computed(() => answered.value === props.questions.length);
const best = computed(() => lessonResult(props.lessonId));

watch(finished, (done) => {
  if (done) recordQuiz(props.lessonId, score.value, props.questions.length);
});

const verdict = computed(() => {
  const ratio = score.value / props.questions.length;
  if (ratio === 1) return 'Sans faute, bravo !';
  if (ratio >= 0.5) return 'Bien joué — relis les explications des erreurs.';
  return 'Relis la leçon et retente : le score enregistré est ton meilleur.';
});

function retry() {
  attempt.value += 1;
  reset();
}
</script>

<template>
  <section class="tile tile--flat quiz" aria-labelledby="quiz-title">
    <header class="quiz-head">
      <span class="icon-chip"><Icon name="brain" /></span>
      <div>
        <p class="eyebrow">Vérifie tes acquis</p>
        <h2 id="quiz-title">Quiz</h2>
      </div>
      <span class="chip">{{ answered }} / {{ questions.length }}</span>
    </header>

    <ol class="questions">
      <li v-for="(q, qi) in shuffled" :key="qi" class="question">
        <!-- eslint-disable-next-line vue/no-v-html -- texte de nos leçons, rendu au build -->
        <p class="q-text" v-html="q.q" />
        <div class="options" role="group" :aria-label="`Question ${qi + 1}`">
          <button
            v-for="oi in q.order"
            :key="oi"
            type="button"
            class="option"
            :class="stateOf(qi, oi)"
            :disabled="picked[qi] !== null"
            :aria-pressed="picked[qi] === oi"
            @click="choose(qi, oi)"
          >
            <span class="mark" aria-hidden="true">
              <Icon v-if="stateOf(qi, oi) === 'correct'" name="check" />
              <Icon v-else-if="stateOf(qi, oi) === 'wrong'" name="x" />
            </span>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="q.options[oi]" />
          </button>
        </div>
        <p v-if="picked[qi] !== null" class="explain" :class="{ ok: picked[qi] === q.answer }" role="status">
          <strong>{{ picked[qi] === q.answer ? 'Correct.' : 'Pas tout à fait.' }}</strong>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="q.explain" />
        </p>
      </li>
    </ol>

    <div v-if="finished" class="result" role="status">
      <p class="score">{{ score }}<span> / {{ questions.length }}</span></p>
      <div>
        <p class="verdict">{{ verdict }}</p>
        <p v-if="best" class="muted small">Meilleur score enregistré : {{ best.best }} / {{ best.total }}</p>
      </div>
      <button class="btn" type="button" @click="retry"><Icon name="rotate-ccw" /> Recommencer</button>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  display: grid;
  gap: 20px;
  padding: 28px;
}

.quiz-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.quiz-head > div {
  flex: 1;
}

.quiz-head h2 {
  font-size: 26px;
}

.questions {
  display: grid;
  gap: 22px;
}

.question {
  display: grid;
  gap: 10px;
}

.q-text {
  font-weight: 700;
  font-size: 16.5px;
  letter-spacing: -0.01em;
}

.options {
  display: grid;
  gap: 8px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--tile-2);
  text-align: left;
  font-size: 15px;
  transition:
    border-color 0.2s,
    background 0.2s,
    opacity 0.2s;
}

.option:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--accent-fill) 55%, transparent);
}

.option:disabled {
  cursor: default;
}

.mark {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  border: 2px solid var(--line-strong);
}

.mark .icon {
  width: 13px;
  height: 13px;
  stroke-width: 3;
}

.option.correct {
  border-color: color-mix(in srgb, var(--ok-fill) 60%, transparent);
  background: color-mix(in srgb, var(--ok-fill) 12%, var(--tile));
}

.option.correct .mark {
  border-color: var(--ok-fill);
  background: var(--ok-fill);
  color: #04130d;
}

.option.wrong {
  border-color: color-mix(in srgb, var(--danger-fill) 55%, transparent);
  background: color-mix(in srgb, var(--danger-fill) 10%, var(--tile));
}

.option.wrong .mark {
  border-color: var(--danger-fill);
  background: var(--danger-fill);
  color: #fff;
}

.option.dim {
  opacity: 0.55;
}

.explain {
  font-size: 14.5px;
  padding: 10px 14px;
  border-radius: var(--r-md);
  background: color-mix(in srgb, var(--danger-fill) 9%, transparent);
}

.explain.ok {
  background: color-mix(in srgb, var(--ok-fill) 11%, transparent);
}

.explain strong {
  margin-right: 6px;
}

.result {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  padding: 18px;
  border-radius: var(--r-lg);
  background: color-mix(in srgb, var(--accent-fill) 10%, var(--tile));
}

.result > div {
  flex: 1;
  min-width: 200px;
}

.score {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
}

.score span {
  font-size: 20px;
  color: var(--muted);
}

.verdict {
  font-weight: 700;
}

.small {
  font-size: 13px;
}
</style>
