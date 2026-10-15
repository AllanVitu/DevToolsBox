import { ref, watch } from 'vue';
import { readJSON, writeJSON } from '@/lib/storage';

// Les écritures sont regroupées (150 ms) pour ne pas sérialiser à chaque frappe ;
// celles en attente sont forcées quand la page est masquée ou fermée.
const pending = new Map();
let timer = null;

function flush() {
  clearTimeout(timer);
  timer = null;
  for (const [key, value] of pending) writeJSON(key, value);
  pending.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

/**
 * ref() synchronisée avec localStorage sous « devtoolbox:<key> ».
 * Les clés sont celles des versions précédentes : les saisies déjà enregistrées
 * par l'utilisateur sont retrouvées telles quelles.
 */
export function usePersistentRef(key, initial) {
  const state = ref(readJSON(key, initial));
  watch(
    state,
    (value) => {
      pending.set(key, value);
      clearTimeout(timer);
      timer = setTimeout(flush, 150);
    },
    { deep: true },
  );
  return state;
}
