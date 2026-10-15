import { ref } from 'vue';

// État « application » : connexion, installation PWA et mises à jour du service worker.
const online = ref(typeof navigator === 'undefined' ? true : navigator.onLine);
const canInstall = ref(false);
const updateReady = ref(false);
let installEvent = null;
let waitingWorker = null;

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => (online.value = true));
  window.addEventListener('offline', () => (online.value = false));
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    canInstall.value = true;
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    canInstall.value = false;
  });
}

function trackWaiting(registration) {
  const offer = (worker) => {
    waitingWorker = worker;
    updateReady.value = true;
  };
  if (registration.waiting && navigator.serviceWorker.controller) offer(registration.waiting);
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    worker?.addEventListener('statechange', () => {
      // Un worker « installed » alors qu'une page est déjà contrôlée = nouvelle version.
      if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
    });
  });
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(trackWaiting)
      .catch(() => {
        /* hors HTTPS ou navigateur sans SW : l'app marche quand même, en ligne */
      });
  });
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !updateReady.value) return;
    reloading = true;
    window.location.reload();
  });
}

async function promptInstall() {
  if (!installEvent) return false;
  installEvent.prompt();
  const { outcome } = await installEvent.userChoice;
  installEvent = null;
  canInstall.value = false;
  return outcome === 'accepted';
}

function applyUpdate() {
  if (waitingWorker) waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  else window.location.reload();
}

export function usePwa() {
  return { online, canInstall, promptInstall, updateReady, applyUpdate };
}
