import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Garde le focus dans une modale ouverte, ferme sur Échap, bloque le défilement de la
 * page derrière et rend le focus à l'élément d'origine à la fermeture.
 */
export function useFocusTrap(isOpen, onClose) {
  const container = ref(null);
  let previous = null;

  const focusables = () =>
    container.value ? [...container.value.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null) : [];

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function release() {
    document.removeEventListener('keydown', onKeydown, true);
    document.documentElement.style.overflow = '';
  }

  watch(isOpen, async (open) => {
    if (open) {
      previous = document.activeElement;
      document.addEventListener('keydown', onKeydown, true);
      document.documentElement.style.overflow = 'hidden';
      await nextTick();
      (container.value?.querySelector('[autofocus]') || focusables()[0])?.focus();
    } else {
      release();
      previous?.focus?.();
    }
  });

  onBeforeUnmount(release);
  return container;
}
