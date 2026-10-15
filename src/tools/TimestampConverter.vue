<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import Segmented from '@/components/Segmented.vue';
import { fromLocalInput, fromTimestamp, toLocalInputValue } from '@/lib/timestamp';

const now = ref(Date.now());
const timer = setInterval(() => (now.value = Date.now()), 1000);
onBeforeUnmount(() => clearInterval(timer));

const stamp = ref(String(Math.floor(Date.now() / 1000)));
const unit = ref('auto');
const local = ref(toLocalInputValue());

const fromStamp = computed(() => fromTimestamp(stamp.value, unit.value, now.value));
const fromDate = computed(() => fromLocalInput(local.value));
const nowSeconds = computed(() => Math.floor(now.value / 1000));

function useNow() {
  stamp.value = unit.value === 'ms' ? String(Date.now()) : String(Math.floor(Date.now() / 1000));
}
</script>

<template>
  <ToolShell>
    <div class="now">
      <span class="label">Maintenant</span>
      <code>{{ nowSeconds }}</code>
      <CopyButton :value="String(nowSeconds)" label="" icon-only />
      <span class="muted">{{ new Date(now).toLocaleTimeString('fr-FR') }}</span>
    </div>

    <div class="io mt">
      <section class="panel">
        <h2 class="label">Timestamp → date</h2>
        <div class="row mt-s">
          <input v-model="stamp" type="text" inputmode="numeric" placeholder="1760000000" aria-label="Timestamp Unix" class="grow" />
          <button class="btn btn--sm" type="button" @click="useNow"><Icon name="clock" /> Maintenant</button>
        </div>
        <Segmented
          v-model="unit"
          class="mt-s"
          :options="[
            { value: 'auto', label: 'Auto' },
            { value: 's', label: 'Secondes' },
            { value: 'ms', label: 'Millisecondes' },
          ]"
          label="Unité"
        />
        <dl v-if="fromStamp" class="kv mt-s">
          <div class="kv-row"><dt>Locale</dt><dd>{{ fromStamp.local }}</dd><span /></div>
          <div class="kv-row"><dt>Relatif</dt><dd>{{ fromStamp.relative }}</dd><span /></div>
          <div class="kv-row"><dt>ISO 8601</dt><dd><code>{{ fromStamp.iso }}</code></dd><CopyButton :value="fromStamp.iso" label="" icon-only /></div>
          <div class="kv-row"><dt>UTC</dt><dd>{{ fromStamp.utc }}</dd><span /></div>
          <div class="kv-row"><dt>Unité lue</dt><dd>{{ fromStamp.unit === 's' ? 'secondes' : 'millisecondes' }}</dd><span /></div>
        </dl>
        <p v-else class="muted mt-s">Saisis un nombre de secondes (10 chiffres) ou de millisecondes (13 chiffres).</p>
      </section>

      <section class="panel">
        <h2 class="label">Date → timestamp</h2>
        <input v-model="local" class="mt-s" type="datetime-local" step="1" aria-label="Date et heure locales" />
        <dl v-if="fromDate" class="kv mt-s">
          <div class="kv-row"><dt>Secondes</dt><dd><code>{{ fromDate.seconds }}</code></dd><CopyButton :value="String(fromDate.seconds)" label="" icon-only /></div>
          <div class="kv-row"><dt>Millisecondes</dt><dd><code>{{ fromDate.millis }}</code></dd><CopyButton :value="String(fromDate.millis)" label="" icon-only /></div>
          <div class="kv-row"><dt>ISO 8601 (UTC)</dt><dd><code>{{ fromDate.iso }}</code></dd><CopyButton :value="fromDate.iso" label="" icon-only /></div>
        </dl>
      </section>
    </div>
    <p class="hint mt">
      Un timestamp Unix compte les secondes depuis le 1er janvier 1970 à 00:00 UTC : il ne dépend d’aucun fuseau. JavaScript (Date.now) compte
      en millisecondes, PHP (time()) et PostgreSQL (extract(epoch …)) en secondes.
    </p>
  </ToolShell>
</template>

<style scoped>
.now {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.now code {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.mt-s {
  margin-top: 12px;
}

.grow {
  flex: 1;
  min-width: 0;
}

.panel .kv-row {
  grid-template-columns: 120px minmax(0, 1fr) auto;
  background: var(--tile);
}

dt {
  font: 500 12px var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--subtle);
}

dd {
  min-width: 0;
  word-break: break-word;
}
</style>
