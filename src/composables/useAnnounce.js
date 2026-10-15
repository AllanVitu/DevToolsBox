import { ref } from 'vue';

// Messages lus par les lecteurs d'écran (région aria-live dans App.vue).
const message = ref('');
let timer = null;

export function announce(text) {
  message.value = '';
  clearTimeout(timer);
  timer = setTimeout(() => (message.value = text), 50);
}

export function useAnnounce() {
  return { message, announce };
}
