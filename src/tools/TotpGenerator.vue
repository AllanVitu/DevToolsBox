<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import QRCode from 'qrcode';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import PipelineButton from '@/components/PipelineButton.vue';
import { base32Decode, generateSecret, otpauthUri, secondsLeft, totp } from '@/lib/totp';

// Rien n'est persisté : un secret 2FA ne doit pas traîner dans le stockage du navigateur.
const secret = ref(generateSecret());
const issuer = ref('DevToolbox');
const account = ref('allan@example.com');
const digits = ref(6);
const period = ref(30);
const algorithm = ref('SHA1');
const verifyCode = ref('');

const now = ref(Date.now());
const code = ref('');
const previous = ref('');
const next = ref('');
const error = ref('');
const qr = ref('');
let timer = null;

const secretBytes = computed(() => {
  try {
    return base32Decode(secret.value);
  } catch {
    return null;
  }
});

const uri = computed(() =>
  secretBytes.value
    ? otpauthUri({ secret: secret.value.replace(/\s/g, '').toUpperCase(), issuer: issuer.value.trim(), account: account.value.trim() || 'compte', digits: digits.value, period: period.value, algorithm: algorithm.value })
    : '',
);

async function refresh() {
  now.value = Date.now();
  error.value = '';
  if (!secretBytes.value) {
    error.value = 'Secret invalide : il doit être en Base32 (lettres A-Z et chiffres 2-7).';
    code.value = previous.value = next.value = '';
    return;
  }
  const opts = { digits: digits.value, period: period.value, algorithm: algorithm.value };
  [previous.value, code.value, next.value] = await Promise.all(
    [-1, 0, 1].map((step) => totp(secretBytes.value, { ...opts, time: now.value + step * period.value * 1000 })),
  );
}

watch([secret, digits, period, algorithm], refresh, { immediate: true });
watch(
  uri,
  async (value) => {
    qr.value = value ? await QRCode.toDataURL(value, { margin: 1, width: 360, errorCorrectionLevel: 'M' }) : '';
  },
  { immediate: true },
);

onMounted(() => {
  timer = setInterval(() => {
    const changed = Math.floor(Date.now() / 1000 / period.value) !== Math.floor(now.value / 1000 / period.value);
    now.value = Date.now();
    if (changed) refresh();
  }, 500);
});
onBeforeUnmount(() => clearInterval(timer));

const remaining = computed(() => secondsLeft(period.value, now.value));
const verdict = computed(() => {
  const c = verifyCode.value.replace(/\s/g, '');
  if (!c) return null;
  if (c === code.value) return { ok: true, text: 'Code valide pour la fenêtre actuelle.' };
  if (c === previous.value || c === next.value) return { ok: true, text: 'Accepté avec une tolérance d’une fenêtre (décalage d’horloge).' };
  return { ok: false, text: 'Code refusé.' };
});

function newSecret() {
  secret.value = generateSecret();
}
</script>

<template>
  <ToolShell>
    <template #actions>
      <PipelineButton :output="uri" emit-type="url" />
    </template>

    <div class="layout">
      <section class="code-card" aria-live="polite">
        <p class="eyebrow">Code actuel</p>
        <p class="code">{{ code ? `${code.slice(0, digits / 2)} ${code.slice(digits / 2)}` : '— — —' }}</p>
        <div class="timer" :style="{ '--p': `${(remaining / period) * 100}%` }">
          <span>{{ remaining }} s</span>
        </div>
        <div class="row">
          <CopyButton :value="code" label="Copier le code" />
        </div>
        <p class="hint">Précédent {{ previous || '—' }} · suivant {{ next || '—' }}</p>
      </section>

      <div class="form">
        <div class="field">
          <label class="label" for="totp-secret">Secret (Base32)</label>
          <div class="row nowrap">
            <input id="totp-secret" v-model="secret" type="text" spellcheck="false" autocomplete="off" />
            <button class="btn btn--icon" type="button" aria-label="Générer un nouveau secret" title="Nouveau secret" @click="newSecret"><Icon name="refresh-cw" /></button>
          </div>
        </div>
        <div class="pair">
          <div class="field">
            <label class="label" for="totp-issuer">Émetteur</label>
            <input id="totp-issuer" v-model="issuer" type="text" />
          </div>
          <div class="field">
            <label class="label" for="totp-account">Compte</label>
            <input id="totp-account" v-model="account" type="text" />
          </div>
        </div>
        <div class="pair three">
          <label class="field">
            <span class="label">Chiffres</span>
            <select v-model.number="digits"><option :value="6">6</option><option :value="8">8</option></select>
          </label>
          <label class="field">
            <span class="label">Période</span>
            <select v-model.number="period"><option :value="30">30 s</option><option :value="60">60 s</option></select>
          </label>
          <label class="field">
            <span class="label">Algorithme</span>
            <select v-model="algorithm"><option>SHA1</option><option>SHA256</option><option>SHA512</option></select>
          </label>
        </div>
        <p v-if="error" class="alert alert--error"><Icon name="circle-x" /> <span>{{ error }}</span></p>
      </div>
    </div>

    <div class="io mt">
      <div class="panel scan">
        <img v-if="qr" :src="qr" alt="QR code otpauth à scanner avec une application d’authentification" width="180" height="180" />
        <div>
          <p class="label">URI otpauth</p>
          <code class="uri">{{ uri }}</code>
          <CopyButton :value="uri" label="Copier l’URI" />
        </div>
      </div>
      <div class="field">
        <label class="label" for="totp-verify">Vérifier un code (comme le ferait le serveur)</label>
        <input id="totp-verify" v-model="verifyCode" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="123456" />
        <p v-if="verdict" class="status" :class="verdict.ok ? 'status--ok' : 'status--error'">
          <Icon :name="verdict.ok ? 'circle-check' : 'circle-x'" /> {{ verdict.text }}
        </p>
        <p class="hint">
          Côté serveur, on accepte souvent la fenêtre précédente et la suivante pour absorber un léger décalage d’horloge, et on refuse un
          code déjà utilisé.
        </p>
      </div>
    </div>
    <p class="alert alert--warn mt">
      <Icon name="triangle-alert" />
      <span>Outil d’apprentissage et de test : n’y colle pas le secret 2FA d’un vrai compte. Rien n’est enregistré, mais un secret 2FA ne devrait vivre que dans ton application d’authentification.</span>
    </p>
  </ToolShell>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.code-card {
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 22px;
  border-radius: var(--r-lg);
  background: var(--ink);
  color: var(--tile);
  text-align: center;
}

.code-card .eyebrow,
.code-card .hint {
  color: color-mix(in srgb, var(--tile) 65%, transparent);
}

.code {
  font: 700 40px/1 var(--font-mono);
  letter-spacing: 0.08em;
}

.timer {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: conic-gradient(var(--accent-fill) var(--p), color-mix(in srgb, var(--tile) 18%, transparent) 0);
  font: 600 13px var(--font-mono);
}

.timer span {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--ink);
}

.code-card .btn {
  background: color-mix(in srgb, var(--tile) 14%, transparent);
  color: var(--tile);
}

.form {
  display: grid;
  gap: 14px;
}

.form .field + .field {
  margin-top: 0;
}

.nowrap {
  flex-wrap: nowrap;
}

.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pair.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.scan {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.scan img {
  border-radius: 8px;
  background: #fff;
  flex: none;
}

.scan > div {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.uri {
  font-size: 12px;
  word-break: break-all;
}

@media (max-width: 820px) {
  .layout,
  .pair,
  .pair.three {
    grid-template-columns: minmax(0, 1fr);
  }

  .scan {
    flex-direction: column;
  }
}
</style>
