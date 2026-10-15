// Halo doux qui suit le pointeur sur les tuiles (comme sur le portfolio).
// Un seul écouteur délégué ; désactivé au tactile et si l'utilisateur réduit les animations.
let installed = false;

export function installSpotlight() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener(
    'pointermove',
    (event) => {
      if (!fine.matches || reduce.matches) return;
      const tile = event.target.closest?.('.tile');
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      tile.style.setProperty('--my', `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}
