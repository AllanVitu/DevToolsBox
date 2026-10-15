import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decodeShareState, encodeShareState } from '@/lib/base64';

/**
 * Lien de partage : l'état d'un outil est sérialisé en JSON, encodé en Base64 URL
 * et placé dans ?d=… . Rouvrir le lien restaure la saisie. Rien ne transite par un serveur.
 */
export function useShareLink(getState, applyState) {
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    const state = decodeShareState(route.query.d);
    if (state && typeof state === 'object') applyState(state);
  });

  function buildUrl() {
    const { href } = router.resolve({ path: route.path, query: { d: encodeShareState(getState()) } });
    return new URL(href, window.location.href).toString();
  }

  return { buildUrl };
}
