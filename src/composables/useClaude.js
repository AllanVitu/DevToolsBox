import { computed } from 'vue';
import { usePersistentRef } from './usePersistentRef';

// Modèles proposés (tarifs API publics, en dollars par million de jetons entrée / sortie).
// Le repli serveur (« fallbacks: default ») n'existe pas pour Haiku 5.5.
export const MODELS = [
  { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', note: 'Par défaut · le plus polyvalent', price: '4 $ / 20 $', fallback: true },
  { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', note: 'Rapide, très bon en code', price: '2 $ / 10 $', fallback: true },
  { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5', note: 'Le plus léger et le moins cher', price: '0,10 $ / 0,50 $', fallback: false },
];

export const EFFORTS = [
  { id: 'low', name: 'Rapide' },
  { id: 'medium', name: 'Équilibré' },
  { id: 'high', name: 'Approfondi' },
];

const DEFAULT_MODEL = MODELS[0].id;

const apiKey = usePersistentRef('ai:key', '');
const storedModel = usePersistentRef('ai:model', DEFAULT_MODEL);
const effort = usePersistentRef('ai:effort', 'medium');

// Un identifiant enregistré par une ancienne version (ex. claude-opus-4-8) est
// ramené au modèle par défaut actuel.
if (!MODELS.some((m) => m.id === storedModel.value)) storedModel.value = DEFAULT_MODEL;
if (!EFFORTS.some((e) => e.id === effort.value)) effort.value = 'medium';

const hasKey = computed(() => Boolean(apiKey.value));
const currentModel = computed(() => MODELS.find((m) => m.id === storedModel.value) ?? MODELS[0]);

// Le SDK (≈ 160 Ko) n'est téléchargé qu'à la première demande d'IA.
let sdkPromise = null;
function loadSdk() {
  sdkPromise ??= import('@anthropic-ai/sdk').then((m) => m.default);
  return sdkPromise;
}

/**
 * Lance une réponse en streaming. Renvoie le flux (pour l'interrompre et attendre le
 * message final) et la classe du SDK (pour reconnaître les erreurs typées).
 */
async function streamText({ system, messages, onText, onThinking, onFallback }) {
  const Anthropic = await loadSdk();
  const client = new Anthropic({ apiKey: apiKey.value, dangerouslyAllowBrowser: true });
  const model = currentModel.value;
  const params = {
    model: model.id,
    max_tokens: 64000,
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: { effort: effort.value },
    system,
    messages,
  };
  if (model.fallback) {
    // Si les filtres de sécurité déclinent la demande, l'API la relance d'elle-même
    // sur le modèle de repli recommandé, dans le même appel.
    params.betas = ['server-side-fallback-2026-07-01'];
    params.fallbacks = 'default';
  }
  const stream = client.beta.messages.stream(params);
  if (onText) stream.on('text', (delta) => onText(delta));
  if (onThinking) stream.on('thinking', (delta) => onThinking(delta));
  if (onFallback) {
    stream.on('contentBlock', (block) => {
      if (block.type === 'fallback') onFallback(block);
    });
  }
  return { stream, Anthropic };
}

/** Message d'erreur en français, ou null si l'utilisateur a lui-même interrompu. */
function describeError(Anthropic, error) {
  if (Anthropic) {
    if (error instanceof Anthropic.APIUserAbortError) return null;
    if (error instanceof Anthropic.AuthenticationError) return 'Clé API invalide ou révoquée.';
    if (error instanceof Anthropic.PermissionDeniedError) return 'Cette clé n’a pas accès à ce modèle.';
    if (error instanceof Anthropic.RateLimitError) return 'Limite de débit atteinte. Réessaie dans un instant.';
    if (error instanceof Anthropic.APIConnectionError) return 'Connexion impossible : vérifie ta connexion internet.';
    if (error instanceof Anthropic.InternalServerError) return 'Le service est momentanément surchargé. Réessaie plus tard.';
    if (error instanceof Anthropic.BadRequestError) return 'Requête refusée : ' + (error.message || 'paramètres invalides');
  }
  return 'Erreur : ' + (error?.message || 'requête échouée');
}

/** Avertissement à afficher selon la raison d'arrêt du message final. */
function describeStop(message) {
  if (!message) return '';
  if (message.stop_reason === 'refusal') {
    const category = message.stop_details?.category;
    return 'Claude a décliné cette demande' + (category ? ` (catégorie : ${category})` : '') + '. Reformule-la ou change de modèle.';
  }
  if (message.stop_reason === 'max_tokens') return 'Réponse tronquée : la limite de longueur a été atteinte.';
  return '';
}

export function useClaude() {
  return { apiKey, model: storedModel, effort, hasKey, currentModel, MODELS, EFFORTS, streamText, describeError, describeStop };
}
