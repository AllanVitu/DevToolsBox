<script setup>
import { computed, ref } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { analyzePassword } from '@/lib/pwStrength';

// Volontairement non persisté : un mot de passe testé ne doit pas rester dans le navigateur.
const password = ref('');
const visible = ref(false);
const result = computed(() => (password.value ? analyzePassword(password.value) : null));
const COLORS = ['var(--danger-fill)', 'var(--orange-fill)', 'var(--warn-fill)', 'var(--sky-fill)', 'var(--ok-fill)'];
</script>

<template>
  <ToolShell>
    <div class="field">
      <label class="label" for="pw-test">Mot de passe à tester</label>
      <div class="input-wrap">
        <input
          id="pw-test"
          v-model="password"
          :type="visible ? 'text' : 'password'"
          autocomplete="off"
          spellcheck="false"
          placeholder="Tape ou colle un mot de passe…"
        />
        <button class="btn btn--icon btn--ghost" type="button" :aria-label="visible ? 'Masquer' : 'Afficher'" @click="visible = !visible">
          <Icon :name="visible ? 'eye-off' : 'eye'" />
        </button>
      </div>
    </div>

    <template v-if="result">
      <div class="meter-row mt" aria-hidden="true">
        <span v-for="n in 5" :key="n" :style="{ background: n <= result.level + 1 ? COLORS[result.level] : 'var(--soft-2)' }" />
      </div>
      <p class="verdict" :style="{ color: COLORS[result.level] }">{{ result.label }}</p>
      <div class="stats mt">
        <div class="stat"><strong>{{ result.bits }}</strong><span>bits d’entropie estimés</span></div>
        <div class="stat"><strong>{{ result.length }}</strong><span>caractères</span></div>
        <div class="stat"><strong>{{ result.pool }}</strong><span>symboles possibles</span></div>
      </div>
      <ul v-if="result.warnings.length" class="warnings mt">
        <li v-for="w in result.warnings" :key="w" class="alert alert--warn"><Icon name="triangle-alert" /> <span>{{ w }}</span></li>
      </ul>
    </template>
    <p class="hint mt">
      Estimation locale : rien n’est enregistré ni envoyé. Vise 60 bits ou plus, sans mot du dictionnaire ni schéma « Prénom2024! ». Une phrase
      de passe de 5 ou 6 mots aléatoires est solide et facile à retenir.
    </p>
  </ToolShell>
</template>

<style scoped>
.input-wrap {
  display: flex;
  gap: 8px;
}

.meter-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.meter-row span {
  height: 8px;
  border-radius: 4px;
}

.verdict {
  margin-top: 10px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.warnings {
  display: grid;
  gap: 8px;
}
</style>
