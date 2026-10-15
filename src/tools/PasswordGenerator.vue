<script setup>
import { computed, ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { buildPools, entropyBits, generatePassword, strengthLabel } from '@/lib/password';

const length = usePersistentRef('pwd:length', 20);
const lower = usePersistentRef('pwd:lower', true);
const upper = usePersistentRef('pwd:upper', true);
const digits = usePersistentRef('pwd:digits', true);
const symbols = usePersistentRef('pwd:symbols', true);
const noAmbiguous = usePersistentRef('pwd:noAmbiguous', false);
const password = ref('');

const options = computed(() => ({ lower: lower.value, upper: upper.value, digits: digits.value, symbols: symbols.value, noAmbiguous: noAmbiguous.value }));
const alphabet = computed(() => buildPools(options.value).join('').length);

function regenerate() {
  password.value = generatePassword(length.value, options.value);
}
watch([length, options], regenerate, { immediate: true, deep: true });

const bits = computed(() => entropyBits(password.value.length, alphabet.value));
const strength = computed(() => strengthLabel(bits.value));
const TONES = { danger: 'var(--danger-fill)', warn: 'var(--warn-fill)', ok: 'var(--ok-fill)' };
</script>

<template>
  <ToolShell>
    <div class="result">
      <code class="pwd">{{ password || '—' }}</code>
      <div class="row">
        <button class="btn btn--icon" type="button" aria-label="Générer un autre mot de passe" title="Régénérer" @click="regenerate"><Icon name="refresh-cw" /></button>
        <CopyButton :value="password" :small="false" />
      </div>
    </div>
    <div v-if="password" class="strength">
      <div class="segments" aria-hidden="true">
        <span v-for="n in 4" :key="n" :style="{ background: n <= strength.level ? TONES[strength.tone] : 'var(--soft-2)' }" />
      </div>
      <span class="status" :style="{ color: TONES[strength.tone] }">{{ strength.label }} · {{ bits }} bits d’entropie</span>
    </div>

    <div class="field mt">
      <label class="label" for="pwd-len">Longueur : {{ length }} caractères</label>
      <input id="pwd-len" v-model.number="length" type="range" min="8" max="64" />
    </div>
    <div class="opts mt">
      <label class="check"><input v-model="lower" type="checkbox" /> Minuscules (a-z)</label>
      <label class="check"><input v-model="upper" type="checkbox" /> Majuscules (A-Z)</label>
      <label class="check"><input v-model="digits" type="checkbox" /> Chiffres (0-9)</label>
      <label class="check"><input v-model="symbols" type="checkbox" /> Symboles (!@#…)</label>
      <label class="check"><input v-model="noAmbiguous" type="checkbox" /> Sans caractères ambigus (I l 1 O 0)</label>
    </div>
    <p v-if="!alphabet" class="alert alert--error mt"><Icon name="circle-x" /> <span>Coche au moins un type de caractère.</span></p>
    <p class="hint mt">
      Tirage cryptographique sans biais, avec au moins un caractère de chaque type coché. Rien n’est enregistré ni envoyé — et le mieux
      reste un gestionnaire de mots de passe.
    </p>
  </ToolShell>
</template>

<style scoped>
.result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--r-lg);
  background: var(--tile-2);
  border: 1px solid var(--line);
}

.pwd {
  flex: 1;
  min-width: 0;
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 600;
  letter-spacing: 0.02em;
  word-break: break-all;
}

.strength {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
}

.segments {
  display: grid;
  grid-template-columns: repeat(4, 42px);
  gap: 5px;
}

.segments span {
  height: 7px;
  border-radius: 4px;
}

.opts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
}
</style>
