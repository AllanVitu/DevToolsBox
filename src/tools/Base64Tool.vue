<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { transformBase64 } from '@/lib/base64';

const input = usePersistentRef('base64:input', 'Salut le monde 👋');
const mode = usePersistentRef('base64:mode', 'encode');
const urlSafe = usePersistentRef('base64:urlsafe', false);

const result = computed(() => transformBase64(input.value, mode.value, { urlSafe: urlSafe.value }));

function swap() {
  if (result.value.text && !result.value.error) input.value = result.value.text;
  mode.value = mode.value === 'encode' ? 'decode' : 'encode';
}

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value, urlSafe: urlSafe.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'encode' || s.mode === 'decode') mode.value = s.mode;
    urlSafe.value = Boolean(s.urlSafe);
  },
);
</script>

<template>
  <ToolShell>
    <template #actions>
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
      <button class="btn btn--sm" type="button" @click="swap"><Icon name="arrow-up-down" /> Inverser</button>
      <label v-if="mode === 'encode'" class="check"><input v-model="urlSafe" type="checkbox" /> URL-safe (- et _ , sans =)</label>
      <span v-else class="hint">Le décodage accepte les deux variantes, avec ou sans « = ».</span>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="b64-in">{{ mode === 'encode' ? 'Texte' : 'Base64' }}</label>
        <textarea id="b64-in" v-model="input" rows="10" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'encode' ? (urlSafe ? 'Base64 URL-safe' : 'Base64') : 'Texte'" :value="result.text" :rows="10" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="hint mt">Base64 n’est pas un chiffrement : n’importe qui peut décoder. C’est un encodage pour transporter des octets dans du texte.</p>
  </ToolShell>
</template>
