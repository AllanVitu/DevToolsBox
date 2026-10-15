<script setup>
import { onMounted, ref, watch } from 'vue';
import QRCode from 'qrcode';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { usePipeline } from '@/composables/usePipeline';

const text = usePersistentRef('qr:text', 'https://allanvitu.github.io/DevToolsBox/');
const level = usePersistentRef('qr:level', 'M');
const dark = usePersistentRef('qr:dark', '#111216');
const light = usePersistentRef('qr:light', '#ffffff');
const dataUrl = ref('');
const error = ref('');

async function render() {
  error.value = '';
  if (!text.value) {
    dataUrl.value = '';
    return;
  }
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      errorCorrectionLevel: level.value,
      margin: 2,
      width: 520,
      color: { dark: dark.value, light: light.value },
    });
  } catch (e) {
    dataUrl.value = '';
    error.value = e.message;
  }
}

watch([text, level, dark, light], render, { immediate: true });

function downloadPng() {
  const link = document.createElement('a');
  link.href = dataUrl.value;
  link.download = 'qrcode.png';
  link.click();
}

async function downloadSvg() {
  const svg = await QRCode.toString(text.value, { type: 'svg', errorCorrectionLevel: level.value, margin: 2, color: { dark: dark.value, light: light.value } });
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qrcode.svg';
  link.click();
  URL.revokeObjectURL(url);
}

const { consume } = usePipeline();
onMounted(() => {
  const item = consume(['url', 'text']);
  if (item) text.value = item.content;
});
</script>

<template>
  <ToolShell>
    <div class="layout">
      <div class="preview">
        <img v-if="dataUrl" :src="dataUrl" alt="QR code généré" width="260" height="260" />
        <p v-else class="muted">Saisis un texte pour générer le QR code.</p>
      </div>
      <div class="controls">
        <div class="field">
          <label class="label" for="qr-text">Texte ou URL</label>
          <textarea id="qr-text" v-model="text" rows="4" spellcheck="false" placeholder="https://…" />
        </div>
        <div class="field">
          <label class="label" for="qr-level">Correction d’erreur</label>
          <select id="qr-level" v-model="level">
            <option value="L">Faible — L · ~7 % récupérable</option>
            <option value="M">Moyenne — M · ~15 %</option>
            <option value="Q">Élevée — Q · ~25 %</option>
            <option value="H">Maximale — H · ~30 % (pour poser un logo)</option>
          </select>
        </div>
        <div class="colors">
          <div class="field">
            <label class="label" for="qr-dark">Modules</label>
            <div class="row"><input id="qr-dark" v-model="dark" type="color" /><input v-model="dark" type="text" aria-label="Couleur des modules (hex)" spellcheck="false" /></div>
          </div>
          <div class="field">
            <label class="label" for="qr-light">Fond</label>
            <div class="row"><input id="qr-light" v-model="light" type="color" /><input v-model="light" type="text" aria-label="Couleur du fond (hex)" spellcheck="false" /></div>
          </div>
        </div>
        <p v-if="error" class="alert alert--error"><Icon name="circle-x" /> <span>{{ error }}</span></p>
        <div class="row">
          <button class="btn btn--ink" type="button" :disabled="!dataUrl" @click="downloadPng"><Icon name="download" /> PNG</button>
          <button class="btn" type="button" :disabled="!text" @click="downloadSvg"><Icon name="download" /> SVG</button>
        </div>
        <p class="hint">Garde un bon contraste (modules foncés sur fond clair) : beaucoup de lecteurs ne savent pas lire un QR code inversé.</p>
      </div>
    </div>
  </ToolShell>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}

.preview {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  padding: 20px;
  border-radius: var(--r-lg);
  background: var(--tile-2);
  border: 1px solid var(--line);
  text-align: center;
}

.preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.controls {
  display: grid;
  gap: 16px;
}

.controls .field + .field {
  margin-top: 0;
}

.colors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.colors .row {
  flex-wrap: nowrap;
}

@media (max-width: 760px) {
  .layout,
  .colors {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview {
    max-width: 320px;
  }
}
</style>
