import { ref } from 'vue';
import { announce } from './useAnnounce';

function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
}

export function useClipboard(duration = 1400) {
  const copied = ref(false);
  let timer = null;

  async function copy(value) {
    if (value == null || value === '') return false;
    const text = String(value);
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else legacyCopy(text);
    } catch {
      try {
        legacyCopy(text);
      } catch {
        return false;
      }
    }
    copied.value = true;
    announce('Copié dans le presse-papier');
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), duration);
    return true;
  }

  return { copied, copy };
}
