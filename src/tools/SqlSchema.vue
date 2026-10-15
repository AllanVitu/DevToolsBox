<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { usePipeline } from '@/composables/usePipeline';
import { analyzeSchema } from '@/lib/sqlSchema';

const sql = usePersistentRef(
  'sqlschema:sql',
  'CREATE TABLE commandes (\n  id SERIAL PRIMARY KEY,\n  client_id INT REFERENCES clients(id),\n  montant FLOAT NOT NULL,\n  statut VARCHAR(20) NOT NULL DEFAULT \'nouvelle\',\n  cree_le TIMESTAMP DEFAULT now()\n);',
);
const result = computed(() => analyzeSchema(sql.value));

const ICONS = { error: 'circle-x', warn: 'triangle-alert', tip: 'lightbulb' };

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['sql']);
  if (item) sql.value = item.content;
});
</script>

<template>
  <ToolShell>
    <div class="io">
      <div class="field">
        <label class="label" for="schema-in">CREATE TABLE</label>
        <textarea id="schema-in" v-model="sql" rows="14" spellcheck="false" />
      </div>

      <div class="out">
        <p v-if="result.error" class="alert alert--error"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
        <template v-else>
          <div class="out-head">
            <span class="label">Table <code>{{ result.table }}</code></span>
            <span class="status" :class="result.valid ? 'status--ok' : 'status--error'">
              <Icon :name="result.valid ? 'circle-check' : 'circle-x'" /> {{ result.valid ? 'Schéma valide' : 'Problèmes bloquants' }}
            </span>
          </div>
          <ul class="cols">
            <li v-for="c in result.columns" :key="c.name">
              <span class="name">
                <Icon v-if="c.pk" name="key-round" class="pk" />
                <Icon v-else-if="c.fk" name="link" class="fk" />
                {{ c.name }}
              </span>
              <code class="type">{{ c.type }}</code>
              <span class="flags">
                <span v-if="c.notNull" class="chip">NOT NULL</span>
                <span v-if="c.unique" class="chip">UNIQUE</span>
                <span v-if="c.default" class="chip">DEFAULT {{ c.default }}</span>
                <span v-if="c.fk" class="chip chip--accent">→ {{ c.fk.table }}</span>
              </span>
            </li>
          </ul>
        </template>
      </div>
    </div>

    <ul v-if="!result.error && result.issues.length" class="issues mt">
      <li v-for="(issue, i) in result.issues" :key="i" class="alert" :class="issue.level === 'error' ? 'alert--error' : issue.level === 'warn' ? 'alert--warn' : 'alert--info'">
        <Icon :name="ICONS[issue.level]" />
        <span>{{ issue.message }}</span>
      </li>
    </ul>
  </ToolShell>
</template>

<style scoped>
.cols {
  display: grid;
  gap: 6px;
}

.cols li {
  display: grid;
  grid-template-columns: minmax(110px, 1fr) minmax(90px, auto) minmax(0, 1.4fr);
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
}

.name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 650;
  word-break: break-all;
}

.pk {
  color: var(--amber-text);
}

.fk {
  color: var(--accent);
}

.type {
  font-size: 13px;
  color: var(--muted);
}

.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.flags .chip {
  font-size: 11px;
  padding: 3px 7px;
}

.issues {
  display: grid;
  gap: 8px;
}

@media (max-width: 600px) {
  .cols li {
    grid-template-columns: minmax(0, 1fr);
  }

  .flags {
    justify-content: flex-start;
  }
}
</style>
