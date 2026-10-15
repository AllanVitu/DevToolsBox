<script setup>
import { computed, onMounted } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import AiButton from '@/components/AiButton.vue';
import ToolAiPanel from '@/components/ToolAiPanel.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { usePipeline } from '@/composables/usePipeline';
import { useToolAI } from '@/composables/useToolAI';
import { formatSql } from '@/lib/sqlFormat';

const input = usePersistentRef(
  'sqlfmt:input',
  "select u.nom, count(*) as commandes from users u left join orders o on o.user_id = u.id where u.actif = true and u.ville = 'select' group by u.nom having count(*) > 2 order by commandes desc limit 10",
);
const uppercase = usePersistentRef('sqlfmt:upper', true);
const output = computed(() => formatSql(input.value, { uppercase: uppercase.value }));

const ai = useToolAI(
  'Tu es expert SQL (PostgreSQL par défaut). Explique la requête en langage clair, puis signale les risques de performance (index manquants, SELECT *, jointures coûteuses, N+1) et propose une version améliorée. Sois concis.',
);
const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['sql']);
  if (item) input.value = item.content;
});
const { buildUrl } = useShareLink(
  () => ({ input: input.value }),
  (s) => typeof s.input === 'string' && (input.value = s.input),
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <AiButton :disabled="!output" :running="ai.running.value" @click="ai.analyze(output)" />
      <PipelineButton :output="output" emit-type="sql" />
      <ShareButton :build="buildUrl" />
    </template>
    <div class="toolbar">
      <label class="check"><input v-model="uppercase" type="checkbox" /> Mots-clés en majuscules</label>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="sql-in">Requête SQL</label>
        <textarea id="sql-in" v-model="input" rows="14" spellcheck="false" />
      </div>
      <OutputBox label="Requête mise en forme" :value="output" :rows="14" />
    </div>
    <p class="hint mt">Les chaînes, identifiants entre guillemets et commentaires sont laissés intacts.</p>
    <ToolAiPanel :ai="ai" />
  </ToolShell>
</template>
