<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { convertHex } from '@/lib/hex';

const mode = usePersistentRef('hextext:mode', 'text2hex');
const input = usePersistentRef('hextext:input', 'Salut 👋');
const separator = usePersistentRef('hextext:sep', ' ');
const uppercase = usePersistentRef('hextext:upper', false);

const result = computed(() => convertHex(input.value, mode.value, { separator: separator.value, uppercase: uppercase.value }));

function switchMode(next) {
  if (next === mode.value) return;
  if (result.value.text && !result.value.error) input.value = result.value.text;
  mode.value = next;
}

const { buildUrl } = useShareLink(
  () => ({ input: input.value, mode: mode.value }),
  (s) => {
    if (typeof s.input === 'string') input.value = s.input;
    if (s.mode === 'text2hex' || s.mode === 'hex2text') mode.value = s.mode;
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
        :model-value="mode"
        :options="[
          { value: 'text2hex', label: 'Texte → Hex' },
          { value: 'hex2text', label: 'Hex → Texte' },
        ]"
        @update:model-value="switchMode"
      />
      <template v-if="mode === 'text2hex'">
        <label class="inline-field">
          Séparateur
          <select v-model="separator">
            <option value=" ">Espace</option>
            <option value="">Aucun</option>
            <option value=":">Deux-points</option>
          </select>
        </label>
        <label class="check"><input v-model="uppercase" type="checkbox" /> Majuscules</label>
      </template>
    </div>
    <div class="io">
      <div class="field">
        <label class="label" for="hex-in">{{ mode === 'text2hex' ? 'Texte' : 'Hexadécimal (espaces, 0x et \\x acceptés)' }}</label>
        <textarea id="hex-in" v-model="input" rows="8" spellcheck="false" />
      </div>
      <OutputBox :label="mode === 'text2hex' ? 'Octets UTF-8 en hexadécimal' : 'Texte'" :value="result.text" :rows="8" />
    </div>
    <p v-if="result.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ result.error }}</span></p>
    <p class="hint mt">En UTF-8, « é » prend 2 octets (c3 a9) et un emoji 4 : c’est pourquoi longueur en caractères et en octets diffèrent.</p>
  </ToolShell>
</template>
