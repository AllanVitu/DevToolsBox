<script setup>
import { computed, ref, watch } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import AiButton from '@/components/AiButton.vue';
import ToolAiPanel from '@/components/ToolAiPanel.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useToolAI } from '@/composables/useToolAI';
import { claimsTimeline, decodeJwt, verifyHmac } from '@/lib/jwt';

// Jeton d'exemple signé en HS256 avec le secret « devtoolbox-demo ».
const token = usePersistentRef(
  'jwt:token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJBbGxhbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDAwMDAwMCwiZXhwIjoxNzkwMDAzNjAwfQ.wCwo-YMxFUm4hnnM22972nBo98-KltZ48Ux1lGRqiyY',
);
const secret = ref('');
const verdict = ref(null);

const decoded = computed(() => decodeJwt(token.value));
const timeline = computed(() => claimsTimeline(decoded.value.payload));
const alg = computed(() => decoded.value.header?.alg || '');

watch([token, secret], () => (verdict.value = null));

async function verify() {
  verdict.value = await verifyHmac(decoded.value.parts, alg.value, secret.value);
}

const ai = useToolAI(
  'Tu es expert en sécurité et en JWT. Analyse l’en-tête et la charge utile fournis : explique chaque claim, signale ce qui est inhabituel ou sensible (données personnelles, durée de vie trop longue, alg « none »…). Sois concis.',
);
const STATES = { ok: 'chip--ok', warn: 'chip--warn', danger: 'chip--danger', info: '' };
</script>

<template>
  <ToolShell>
    <template #actions>
      <AiButton
        :disabled="!decoded.payload"
        :running="ai.running.value"
        @click="ai.analyze(JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2))"
      />
    </template>

    <div class="field">
      <label class="label" for="jwt-in">Jeton JWT</label>
      <textarea id="jwt-in" v-model="token" rows="4" spellcheck="false" placeholder="eyJ…" class="token" />
    </div>
    <p v-if="decoded.error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ decoded.error }}</span></p>

    <template v-if="decoded.payload">
      <div v-if="timeline.length" class="row mt">
        <span v-for="item in timeline" :key="item.label" class="chip" :class="STATES[item.state]">{{ item.label }} : {{ item.value }}</span>
      </div>
      <p v-if="alg === 'none'" class="alert alert--error mt">
        <Icon name="triangle-alert" />
        <span>« alg: none » : jeton non signé. Un serveur ne doit jamais l’accepter.</span>
      </p>
      <div class="io mt">
        <OutputBox label="En-tête" :value="JSON.stringify(decoded.header, null, 2)" :rows="6" />
        <OutputBox label="Charge utile (payload)" :value="JSON.stringify(decoded.payload, null, 2)" :rows="6" />
      </div>

      <section class="panel mt verify">
        <div>
          <h2 class="label">Vérifier la signature ({{ alg || '?' }})</h2>
          <p class="hint">Pour le jeton d’exemple, le secret est <code>devtoolbox-demo</code>. Le secret ne quitte pas ton navigateur. Rappel : le contenu d’un JWT est lisible par tous — seule la signature le protège des modifications.</p>
        </div>
        <div class="verify-row">
          <input v-model="secret" type="password" placeholder="Secret partagé (HS256/384/512)" autocomplete="off" aria-label="Secret de signature" />
          <button class="btn btn--ink" type="button" :disabled="!secret" @click="verify"><Icon name="shield-check" /> Vérifier</button>
        </div>
        <p v-if="verdict" class="status" :class="verdict.ok ? 'status--ok' : 'status--error'">
          <Icon :name="verdict.ok ? 'circle-check' : 'circle-x'" /> {{ verdict.message }}
        </p>
      </section>
    </template>
    <ToolAiPanel :ai="ai" />
  </ToolShell>
</template>

<style scoped>
.token {
  word-break: break-all;
}

.verify {
  display: grid;
  gap: 12px;
}

.verify-row {
  display: flex;
  gap: 10px;
}

@media (max-width: 560px) {
  .verify-row {
    flex-direction: column;
  }
}
</style>
