<script setup>
import { computed, ref } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import CopyButton from '@/components/CopyButton.vue';

const dataUrl = ref('');
const info = ref(null);
const error = ref('');
const dragging = ref(false);
const fileInput = ref(null);

function size(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(2)} Mo`;
}

function load(file) {
  error.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    error.value = 'Ce fichier n’est pas une image.';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    dataUrl.value = reader.result;
    const img = new Image();
    img.onload = () => {
      info.value = { name: file.name, type: file.type, size: size(file.size), encoded: size(reader.result.length), dims: `${img.naturalWidth} × ${img.naturalHeight}` };
    };
    img.src = reader.result;
  };
  reader.onerror = () => (error.value = 'Lecture du fichier impossible.');
  reader.readAsDataURL(file);
}

function onDrop(event) {
  dragging.value = false;
  load(event.dataTransfer.files?.[0]);
}

const css = computed(() => (dataUrl.value ? `background-image: url("${dataUrl.value}");` : ''));
const html = computed(() => (dataUrl.value ? `<img src="${dataUrl.value}" alt="" width="" height="">` : ''));
</script>

<template>
  <ToolShell>
    <button
      class="dropzone"
      type="button"
      :class="{ dragging }"
      @click="fileInput?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <img v-if="dataUrl" :src="dataUrl" alt="Aperçu de l’image choisie" />
      <span v-else class="drop-hint">
        <Icon name="image" />
        <strong>Glisse une image ici</strong>
        <span class="muted">ou clique pour en choisir une — elle ne quitte pas ton navigateur</span>
      </span>
    </button>
    <input ref="fileInput" type="file" accept="image/*" hidden @change="load($event.target.files?.[0])" />

    <p v-if="error" class="alert alert--error mt"><Icon name="circle-x" /> <span>{{ error }}</span></p>
    <div v-if="info" class="row mt">
      <span class="chip">{{ info.name }}</span>
      <span class="chip">{{ info.type }}</span>
      <span class="chip">{{ info.dims }} px</span>
      <span class="chip chip--warn">{{ info.size }} → {{ info.encoded }} encodé (+33 %)</span>
    </div>
    <template v-if="dataUrl">
      <OutputBox class="mt" label="Data URL" :value="dataUrl" :rows="5">
        <template #actions>
          <CopyButton :value="css" label="CSS" />
          <CopyButton :value="html" label="<img>" />
        </template>
      </OutputBox>
      <p class="hint mt">Réserve les data URL aux petites images (icônes, &lt; 4 Ko) : au-delà, un fichier séparé se met mieux en cache.</p>
    </template>
  </ToolShell>
</template>

<style scoped>
.dropzone {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 220px;
  padding: 24px;
  border-radius: var(--r-lg);
  border: 2px dashed var(--line-strong);
  background: var(--tile-2);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.dropzone:hover,
.dropzone.dragging {
  border-color: var(--accent-fill);
  background: color-mix(in srgb, var(--accent-fill) 7%, var(--tile));
}

.dropzone img {
  max-height: 260px;
  border-radius: var(--r-md);
}

.drop-hint {
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.drop-hint .icon {
  width: 32px;
  height: 32px;
  color: var(--accent);
}
</style>
