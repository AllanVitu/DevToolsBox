<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { describeCron, nextRuns, parseCron } from '@/lib/cron';

const expr = usePersistentRef('cron:expr', '*/15 9-17 * * 1-5');
const parsed = computed(() => parseCron(expr.value));
const runs = computed(() => (parsed.value.error ? [] : nextRuns(parsed.value.fields)));
const description = computed(() => (parsed.value.error ? '' : describeCron(parsed.value.fields)));
const fmt = (d) => d.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const EXAMPLES = [
  ['0 * * * *', 'chaque heure pile'],
  ['*/15 9-17 * * 1-5', 'toutes les 15 min, 9 h–17 h, en semaine'],
  ['30 2 * * 0', 'chaque dimanche à 2 h 30'],
  ['0 3 * * *', 'sauvegarde quotidienne à 3 h'],
  ['0 0 1 * *', 'le 1er de chaque mois'],
  ['0 */6 * * *', 'toutes les 6 heures'],
  ['@weekly', 'macro : chaque semaine'],
  ['0 9 * JAN-JUN MON', 'les lundis à 9 h, de janvier à juin'],
];
const LEGEND = ['minute', 'heure', 'jour du mois', 'mois', 'jour sem.'];
</script>

<template>
  <ToolShell>
    <div class="field">
      <label class="label" for="cron-in">Expression cron</label>
      <input id="cron-in" v-model="expr" type="text" spellcheck="false" class="cron" placeholder="*/15 9-17 * * 1-5" />
      <div class="legend" aria-hidden="true">
        <span v-for="(l, i) in LEGEND" :key="l"><code>{{ (parsed.expanded || expr).split(/\s+/)[i] || '·' }}</code>{{ l }}</span>
      </div>
    </div>

    <p v-if="parsed.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ parsed.error }}</span></p>
    <template v-else>
      <p class="description mt">{{ description }}</p>
      <h2 class="label mt">Prochaines exécutions (heure locale)</h2>
      <ol class="runs">
        <li v-for="(r, i) in runs" :key="i"><span class="n">{{ i + 1 }}</span>{{ fmt(r) }}</li>
        <li v-if="!runs.length" class="muted">Aucune exécution dans les 5 prochaines années (ex. un 31 février).</li>
      </ol>
    </template>

    <h2 class="label mt">Exemples</h2>
    <div class="examples">
      <button v-for="[e, d] in EXAMPLES" :key="e" class="example" type="button" @click="expr = e">
        <code>{{ e }}</code>
        <span>{{ d }}</span>
      </button>
    </div>
    <p class="hint mt">
      0 et 7 désignent tous deux le dimanche. Les serveurs (crontab) utilisent leur fuseau horaire : sur un VPS réglé en UTC, « 0 3 * * * »
      tombe à 4 h ou 5 h à Paris.
    </p>
  </ToolShell>
</template>

<style scoped>
.cron {
  font: 600 20px var(--font-mono);
  letter-spacing: 0.04em;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.legend span {
  display: grid;
  gap: 2px;
  justify-items: center;
  min-width: 80px;
  padding: 6px 8px;
  border-radius: var(--r-md);
  background: var(--soft);
  font-size: 12px;
  color: var(--muted);
}

.legend code {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.description {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.runs {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.runs li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
  text-transform: capitalize;
}

.n {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent-fill) 14%, transparent);
  color: var(--accent);
  font: 700 12px var(--font-mono);
}

.examples {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.example {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--tile-2);
  text-align: left;
  transition: border-color 0.2s;
}

.example:hover {
  border-color: color-mix(in srgb, var(--accent-fill) 55%, transparent);
}

.example span {
  font-size: 13px;
  color: var(--muted);
}
</style>
