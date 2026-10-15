<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { usePipeline } from '@/composables/usePipeline';
import { diffJson, summarize } from '@/lib/jsonDiff';

const left = usePersistentRef('jsondiff:left', '{\n  "nom": "Allan",\n  "age": 33,\n  "ville": "Paris",\n  "tags": ["vue", "php"]\n}');
const right = usePersistentRef('jsondiff:right', '{\n  "nom": "Allan",\n  "age": 34,\n  "pays": "France",\n  "tags": ["vue", "php", "docker"]\n}');

const result = computed(() => {
  let a;
  let b;
  try {
    a = JSON.parse(left.value);
  } catch (e) {
    return { error: `JSON A invalide : ${e.message}` };
  }
  try {
    b = JSON.parse(right.value);
  } catch (e) {
    return { error: `JSON B invalide : ${e.message}` };
  }
  const entries = diffJson(a, b);
  return { entries, summary: summarize(entries), error: '' };
});

const show = (v) => (v === undefined ? '∅' : typeof v === 'object' ? JSON.stringify(v) : JSON.stringify(v));

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['json']);
  if (item) left.value = item.content;
});
</script>

<template>
  <ToolShell>
    <div class="io">
      <div class="field">
        <label class="label" for="jd-a">JSON A (avant)</label>
        <textarea id="jd-a" v-model="left" rows="12" spellcheck="false" />
      </div>
      <div class="field">
        <label class="label" for="jd-b">JSON B (après)</label>
        <textarea id="jd-b" v-model="right" rows="12" spellcheck="false" />
      </div>
    </div>

    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <template v-else>
      <div class="row mt">
        <span class="chip chip--ok">+{{ result.summary.added }} ajout{{ result.summary.added > 1 ? 's' : '' }}</span>
        <span class="chip chip--danger">−{{ result.summary.removed }} suppression{{ result.summary.removed > 1 ? 's' : '' }}</span>
        <span class="chip chip--warn">~{{ result.summary.changed }} modification{{ result.summary.changed > 1 ? 's' : '' }}</span>
      </div>
      <p v-if="!result.entries.length" class="status status--ok mt"><Icon name="circle-check" /> Les deux JSON sont identiques.</p>
      <ul v-else class="diff mt">
        <li v-for="(e, i) in result.entries" :key="i" :class="e.type">
          <code class="path">{{ e.path }}</code>
          <span v-if="e.type === 'added'" class="val">+ {{ show(e.newVal) }}</span>
          <span v-else-if="e.type === 'removed'" class="val">− {{ show(e.oldVal) }}</span>
          <span v-else class="val">{{ show(e.oldVal) }} → {{ show(e.newVal) }}</span>
        </li>
      </ul>
    </template>
  </ToolShell>
</template>

<style scoped>
.diff {
  display: grid;
  gap: 6px;
}

.diff li {
  display: grid;
  grid-template-columns: minmax(140px, 260px) minmax(0, 1fr);
  gap: 14px;
  padding: 10px 14px;
  border-radius: var(--r-md);
  border-left: 4px solid;
  background: var(--tile-2);
  font-size: 14px;
}

.diff .added {
  border-color: var(--ok-fill);
}

.diff .removed {
  border-color: var(--danger-fill);
}

.diff .changed {
  border-color: var(--warn-fill);
}

.path {
  font-weight: 600;
  word-break: break-all;
}

.val {
  font-family: var(--font-mono);
  font-size: 13px;
  word-break: break-word;
}

@media (max-width: 640px) {
  .diff li {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
