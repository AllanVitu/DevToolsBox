<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import Segmented from '@/components/Segmented.vue';
import CopyableCode from '@/components/CopyableCode.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { parseUrl, transformUrl } from '@/lib/url';

const input = usePersistentRef('url:input', 'https://example.com/recherche?q=vue 3&lang=fr&page=2#resultats');
const mode = usePersistentRef('url:mode', 'encode');
const scope = usePersistentRef('url:scope', 'component');

const result = computed(() => transformUrl(input.value, mode.value, scope.value));
const parsed = computed(() => parseUrl(mode.value === 'decode' && result.value.text ? result.value.text : input.value));

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'encode' || s.mode === 'decode') mode.value = s.mode;
  },
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <PipelineButton :output="result.text" emit-type="url" />
      <ShareButton :build="buildUrl" />
    </template>
    <div class="toolbar">
      <Segmented
        v-model="mode"
        :options="[
          { value: 'encode', label: 'Encoder' },
          { value: 'decode', label: 'Décoder' },
        ]"
      />
      <label class="inline-field">
        Portée
        <select v-model="scope">
          <option value="component">Valeur de paramètre (encodeURIComponent)</option>
          <option value="full">URL complète (encodeURI)</option>
          <option v-if="mode === 'decode'" value="form">Formulaire (+ = espace)</option>
        </select>
      </label>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="url-in">Entrée</label>
        <textarea id="url-in" v-model="input" rows="5" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'encode' ? 'Encodé' : 'Décodé'" :value="result.text" :rows="5" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>

    <section v-if="parsed" class="mt">
      <h2 class="label">Décomposition</h2>
      <div class="kv mt-s">
        <div class="kv-row"><span>Protocole</span><code>{{ parsed.protocol }}</code><span /></div>
        <div class="kv-row"><span>Hôte</span><code>{{ parsed.host }}</code><span /></div>
        <div class="kv-row"><span>Port</span><code>{{ parsed.port }}</code><span /></div>
        <div class="kv-row"><span>Chemin</span><code>{{ parsed.pathname }}</code><span /></div>
        <div v-if="parsed.hash" class="kv-row"><span>Ancre</span><code>{{ parsed.hash }}</code><span /></div>
      </div>
      <template v-if="parsed.params.length">
        <h3 class="label mt">Paramètres ({{ parsed.params.length }})</h3>
        <div class="kv mt-s">
          <div v-for="([k, v], i) in parsed.params" :key="i" class="kv-row">
            <span>{{ k }}</span>
            <code>{{ v }}</code>
            <CopyableCode :value="v" label="" />
          </div>
        </div>
      </template>
    </section>
  </ToolShell>
</template>

<style scoped>
.mt-s {
  margin-top: 10px;
}

.kv-row > span:first-child {
  text-transform: none;
  letter-spacing: 0;
}
</style>
