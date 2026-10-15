<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { DIRECTIVES, PRESETS, SECURITY_HEADERS, auditPolicy, buildPolicy, formatOutput } from '@/lib/csp';

const policy = usePersistentRef('csp:policy', { ...PRESETS.spa.policy });
const upgrade = usePersistentRef('csp:upgrade', true);
const target = usePersistentRef('csp:target', 'nginx');
const extras = usePersistentRef('csp:extras', SECURITY_HEADERS.map((h) => h.name));

const csp = computed(() => buildPolicy(policy.value, { upgradeInsecure: upgrade.value }));
const notes = computed(() => auditPolicy(policy.value));
const output = computed(() => formatOutput(target.value, csp.value, SECURITY_HEADERS.filter((h) => extras.value.includes(h.name))));

function applyPreset(id) {
  policy.value = { ...PRESETS[id].policy };
}

const ICONS = { error: 'circle-x', warn: 'triangle-alert', info: 'info' };
const CLASSES = { error: 'alert--error', warn: 'alert--warn', info: 'alert--info' };
</script>

<template>
  <ToolShell>
    <div class="toolbar">
      <span class="label">Point de départ</span>
      <button v-for="(p, id) in PRESETS" :key="id" class="chip" type="button" @click="applyPreset(id)">{{ p.name }}</button>
    </div>

    <div class="io">
      <div class="directives">
        <div v-for="d in DIRECTIVES" :key="d.id" class="directive">
          <label :for="`csp-${d.id}`">
            <code>{{ d.id }}</code>
            <span class="hint">{{ d.desc }}</span>
          </label>
          <input :id="`csp-${d.id}`" v-model="policy[d.id]" type="text" spellcheck="false" placeholder="(non défini)" />
        </div>
        <label class="check"><input v-model="upgrade" type="checkbox" /> upgrade-insecure-requests (http → https)</label>
      </div>

      <div class="side">
        <div class="field">
          <span class="label">En-têtes ajoutés</span>
          <label v-for="h in SECURITY_HEADERS" :key="h.name" class="check extra">
            <input v-model="extras" type="checkbox" :value="h.name" />
            <span><code>{{ h.name }}</code> <span class="hint">— {{ h.desc }}</span></span>
          </label>
        </div>
        <Segmented
          v-model="target"
          :options="[
            { value: 'nginx', label: 'Nginx' },
            { value: 'apache', label: 'Apache' },
            { value: 'netlify', label: '_headers' },
            { value: 'meta', label: '<meta>' },
            { value: 'raw', label: 'Brut' },
          ]"
          label="Format de sortie"
        />
        <OutputBox label="Configuration" :value="output" :rows="10" />
        <p v-if="target === 'meta'" class="hint">En balise &lt;meta&gt;, seule la CSP passe : frame-ancestors y est ignoré, et les autres en-têtes doivent venir du serveur.</p>
      </div>
    </div>

    <ul v-if="notes.length" class="notes mt">
      <li v-for="(n, i) in notes" :key="i" class="alert" :class="CLASSES[n.level]"><Icon :name="ICONS[n.level]" /> <span>{{ n.text }}</span></li>
    </ul>
    <p class="hint mt">
      Astuce : déploie d’abord en <code>Content-Security-Policy-Report-Only</code> et surveille la console du navigateur, puis passe en mode
      bloquant quand plus rien ne casse.
    </p>
  </ToolShell>
</template>

<style scoped>
.directives {
  display: grid;
  gap: 10px;
}

.directive {
  display: grid;
  gap: 6px;
}

.directive label {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.directive code {
  font-weight: 600;
  font-size: 13.5px;
}

.directive .hint {
  font-size: 12.5px;
}

.directive input {
  font-family: var(--font-mono);
  font-size: 13.5px;
  padding: 9px 12px;
}

.side {
  display: grid;
  gap: 16px;
  position: sticky;
  top: calc(var(--header-h) + 12px);
}

.extra {
  align-items: flex-start;
  font-weight: 500;
}

.extra code {
  font-size: 13px;
  font-weight: 600;
}

.notes {
  display: grid;
  gap: 8px;
}
</style>
