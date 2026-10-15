import { ref } from 'vue';
import { useClaude } from './useClaude';

/** Panneau « Analyse IA » d'un outil : envoie la saisie à Claude avec une consigne dédiée. */
export function useToolAI(system) {
  const { hasKey, streamText, describeError, describeStop } = useClaude();
  const output = ref('');
  const running = ref(false);
  const error = ref('');
  const notice = ref('');
  const visible = ref(false);
  let stream = null;

  async function analyze(input) {
    if (!input || running.value) return;
    visible.value = true;
    output.value = '';
    error.value = '';
    notice.value = '';
    if (!hasKey.value) {
      error.value = 'Ajoute ta clé API dans « Assistant IA » pour utiliser l’analyse.';
      return;
    }
    running.value = true;
    let Anthropic;
    try {
      const started = await streamText({
        system,
        messages: [{ role: 'user', content: String(input) }],
        onText: (delta) => (output.value += delta),
        onFallback: (block) => (notice.value = `Réponse terminée par ${block.to?.model ?? 'un modèle de repli'}.`),
      });
      Anthropic = started.Anthropic;
      stream = started.stream;
      const message = await stream.finalMessage();
      const stop = describeStop(message);
      if (stop) notice.value = stop;
    } catch (e) {
      const text = describeError(Anthropic, e);
      if (text) error.value = text;
    } finally {
      running.value = false;
      stream = null;
    }
  }

  function stop() {
    stream?.abort();
  }

  function close() {
    stop();
    visible.value = false;
    output.value = '';
    error.value = '';
    notice.value = '';
  }

  return { output, running, error, notice, visible, hasKey, analyze, stop, close };
}
