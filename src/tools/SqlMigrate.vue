<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { migrate } from '@/lib/sqlMigrate';

const before = usePersistentRef('sqlmigrate:before', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  nom VARCHAR(50),\n  age INT\n);');
const after = usePersistentRef('sqlmigrate:after', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  nom TEXT NOT NULL,\n  email VARCHAR(255) NOT NULL DEFAULT \'\'\n);');

const result = computed(() => migrate(before.value, after.value));
const script = computed(() => (result.value.statements || []).join('\n'));
</script>

<template>
  <ToolShell>
    <template #actions>
      <PipelineButton :output="script" emit-type="sql" />
    </template>
    <div class="io">
      <div class="field">
        <label class="label" for="mig-a">Schéma actuel</label>
        <textarea id="mig-a" v-model="before" rows="10" spellcheck="false" />
      </div>
      <div class="field">
        <label class="label" for="mig-b">Schéma cible</label>
        <textarea id="mig-b" v-model="after" rows="10" spellcheck="false" />
      </div>
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p v-else-if="!result.statements.length" class="status status--ok mt"><Icon name="circle-check" /> Aucune différence : les schémas sont identiques.</p>
    <OutputBox v-else class="mt" :label="`Migration (${result.statements.length} instruction${result.statements.length > 1 ? 's' : ''})`" :value="script" :rows="8" />
    <p class="hint mt">
      Syntaxe PostgreSQL. Relis toujours une migration avant de la jouer : un DROP COLUMN efface les données, et un renommage de colonne
      apparaît ici comme une suppression suivie d’un ajout.
    </p>
  </ToolShell>
</template>
