<script setup>
import { computed, ref } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { buildSelect } from '@/lib/queryBuilder';

const table = usePersistentRef('qb:table', 'users u');
const columns = usePersistentRef('qb:columns', 'u.id, u.nom, count(o.id) AS commandes');
const distinct = usePersistentRef('qb:distinct', false);
const joins = usePersistentRef('qb:joins', [{ type: 'LEFT JOIN', table: 'orders o', on: 'o.user_id = u.id' }]);
const wheres = usePersistentRef('qb:wheres', ['u.actif = true']);
const groupBy = usePersistentRef('qb:group', 'u.id, u.nom');
const orderBy = usePersistentRef('qb:order', 'commandes DESC');
const limit = usePersistentRef('qb:limit', '50');

const draft = ref({ type: 'JOIN', table: '', on: '' });

function addJoin() {
  if (!draft.value.table.trim() || !draft.value.on.trim()) return;
  joins.value = [...joins.value, { ...draft.value }];
  draft.value = { type: 'JOIN', table: '', on: '' };
}

const sql = computed(() =>
  buildSelect({
    table: table.value,
    columns: String(columns.value).split(','),
    distinct: distinct.value,
    joins: joins.value,
    wheres: wheres.value,
    groupBy: groupBy.value,
    orderBy: orderBy.value,
    limit: limit.value,
  }),
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <PipelineButton :output="sql" emit-type="sql" />
    </template>
    <div class="io">
      <div class="stack-form">
        <div class="pair">
          <div class="field">
            <label class="label" for="qb-table">Table (FROM)</label>
            <input id="qb-table" v-model="table" type="text" spellcheck="false" placeholder="users u" />
          </div>
          <div class="field">
            <label class="label" for="qb-cols">Colonnes</label>
            <input id="qb-cols" v-model="columns" type="text" spellcheck="false" placeholder="* ou u.id, u.nom" />
          </div>
        </div>
        <label class="check"><input v-model="distinct" type="checkbox" /> SELECT DISTINCT</label>

        <div class="field">
          <span class="label">Jointures</span>
          <div v-for="(j, i) in joins" :key="i" class="line">
            <code>{{ j.type }} {{ j.table }} ON {{ j.on }}</code>
            <button class="btn btn--sm btn--icon btn--ghost" type="button" :aria-label="`Retirer la jointure ${j.table}`" @click="joins.splice(i, 1)">
              <Icon name="x" />
            </button>
          </div>
          <div class="join-add">
            <select v-model="draft.type" aria-label="Type de jointure">
              <option>JOIN</option>
              <option>LEFT JOIN</option>
              <option>RIGHT JOIN</option>
              <option>FULL JOIN</option>
            </select>
            <input v-model="draft.table" type="text" placeholder="orders o" aria-label="Table jointe" spellcheck="false" />
            <input v-model="draft.on" type="text" placeholder="o.user_id = u.id" aria-label="Condition ON" spellcheck="false" @keydown.enter.prevent="addJoin" />
            <button class="btn btn--sm" type="button" @click="addJoin"><Icon name="plus" /> Ajouter</button>
          </div>
        </div>

        <div class="field">
          <span class="label">Conditions (WHERE, reliées par AND)</span>
          <div v-for="(w, i) in wheres" :key="i" class="line">
            <input v-model="wheres[i]" type="text" spellcheck="false" placeholder="colonne = valeur" :aria-label="`Condition ${i + 1}`" />
            <button class="btn btn--sm btn--icon btn--ghost" type="button" aria-label="Retirer la condition" @click="wheres.splice(i, 1)"><Icon name="x" /></button>
          </div>
          <button class="btn btn--sm" type="button" @click="wheres.push('')"><Icon name="plus" /> Condition</button>
        </div>

        <div class="pair three">
          <div class="field">
            <label class="label" for="qb-group">GROUP BY</label>
            <input id="qb-group" v-model="groupBy" type="text" spellcheck="false" />
          </div>
          <div class="field">
            <label class="label" for="qb-order">ORDER BY</label>
            <input id="qb-order" v-model="orderBy" type="text" spellcheck="false" />
          </div>
          <div class="field">
            <label class="label" for="qb-limit">LIMIT</label>
            <input id="qb-limit" v-model="limit" type="text" inputmode="numeric" />
          </div>
        </div>
      </div>
      <OutputBox label="Requête générée" :value="sql" :rows="16" />
    </div>
    <p class="hint mt">Pense aux requêtes préparées : les valeurs saisies par un utilisateur ne doivent jamais être collées dans le SQL.</p>
  </ToolShell>
</template>

<style scoped>
.stack-form {
  display: grid;
  gap: 16px;
}

.stack-form .field + .field {
  margin-top: 0;
}

.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pair.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.line code {
  flex: 1;
  padding: 9px 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
  font-size: 13px;
}

.join-add {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr) minmax(0, 1.4fr) auto;
  gap: 8px;
}

@media (max-width: 700px) {
  .pair,
  .pair.three,
  .join-add {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
