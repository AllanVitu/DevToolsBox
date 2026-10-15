import { ref } from 'vue';

// Le résultat d'un outil peut être envoyé vers un autre : il attend ici jusqu'à ce que
// l'outil cible le consomme, à condition que ce dernier accepte ce type de donnée.
const pending = ref(null);

export function usePipeline() {
  function send(from, content, type) {
    pending.value = { from, content, type };
  }
  function consume(accepts) {
    const item = pending.value;
    if (!item || (accepts && !accepts.includes(item.type))) return null;
    pending.value = null;
    return item;
  }
  return { pending, send, consume };
}
