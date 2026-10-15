// Petits événements globaux entre composants éloignés (ex. ouvrir la palette depuis une page).
export const OPEN_PALETTE = 'devtoolbox:open-palette';

export function openPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_PALETTE));
}
