<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import MarkdownView from '@/components/MarkdownView.vue';
import Segmented from '@/components/Segmented.vue';
import { useClaude } from '@/composables/useClaude';
import { usePipeline } from '@/composables/usePipeline';
import { LINKS } from '@/data/site';

const { apiKey, model, effort, hasKey, currentModel, MODELS, EFFORTS, streamText, describeError, describeStop } = useClaude();
const { pending, consume } = usePipeline();

const SYSTEM =
  'Tu es l’assistant intégré de DevToolbox, une boîte à outils pour développeurs. Réponds en français, de façon concise et concrète. ' +
  'Utilise du Markdown : titres courts, listes, et des blocs de code avec le langage indiqué dès que tu montres du code.';

const TASKS = [
  { id: 'explain', name: 'Expliquer du code', icon: 'book-open', placeholder: 'Colle le code à expliquer…', system: 'Tu es développeur senior. Explique le code fourni en français : rôle global, puis points clés et pièges éventuels. Reste concis et structuré.' },
  { id: 'optimize', name: 'Améliorer', icon: 'zap', placeholder: 'Colle le code à améliorer…', system: 'Refactore et améliore le code fourni (lisibilité, performance, robustesse). Donne d’abord le code complet dans un bloc de code, puis une courte liste des changements et de leurs raisons.' },
  { id: 'bugs', name: 'Trouver des bugs', icon: 'bug', placeholder: 'Colle le code à analyser…', system: 'Analyse le code et liste les bugs et risques (y compris de sécurité). Pour chacun : la cause, l’impact et une correction concrète. Sois précis.' },
  { id: 'regex', name: 'Générer une regex', icon: 'regex', placeholder: 'Décris ce que la regex doit trouver (ex. « un code postal français »)…', system: 'Génère une expression régulière JavaScript pour la description donnée. Donne la regex seule dans un bloc de code, puis explique chaque partie et donne deux exemples qui correspondent et un qui ne correspond pas.' },
  { id: 'sql', name: 'Générer du SQL', icon: 'database', placeholder: 'Décris la requête voulue, avec le schéma des tables si possible…', system: 'Génère une requête SQL (PostgreSQL par défaut) correspondant à la demande, en respectant le schéma fourni. Donne la requête dans un bloc de code, puis une phrase d’explication et les index utiles.' },
  { id: 'tests', name: 'Écrire des tests', icon: 'flask-conical', placeholder: 'Colle la fonction ou le composant à tester…', system: 'Écris des tests unitaires Vitest pour le code fourni : cas nominaux, cas limites et erreurs. Donne le fichier de test complet dans un bloc de code, puis la liste des cas couverts.' },
];

// ── Clé API ────────────────────────────────────────────────────────────────
const keyDraft = ref('');
function saveKey() {
  const key = keyDraft.value.trim();
  if (!key) return;
  apiKey.value = key;
  keyDraft.value = '';
}
function forgetKey() {
  if (!confirm('Supprimer la clé API de ce navigateur ?')) return;
  apiKey.value = '';
  messages.value = [];
}

const mode = ref('chat');

// ── Chat ───────────────────────────────────────────────────────────────────
const messages = ref([]);
const draft = ref('');
const running = ref(false);
const error = ref('');
const listEl = ref(null);
const stuckToBottom = ref(true);
let activeStream = null;

function onScroll() {
  const el = listEl.value;
  if (!el) return;
  stuckToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
}

async function scrollToBottom(force = false) {
  await nextTick();
  const el = listEl.value;
  if (el && (force || stuckToBottom.value)) el.scrollTop = el.scrollHeight;
}

async function send() {
  const text = draft.value.trim();
  if (!text || running.value) return;
  error.value = '';
  draft.value = '';
  messages.value.push({ role: 'user', content: text });
  const reply = { role: 'assistant', content: '', thinking: '', notice: '', interrupted: false, model: currentModel.value.name };
  // Historique envoyé à l'API : uniquement le texte des tours précédents.
  const history = messages.value.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content }));
  messages.value.push(reply);
  const index = messages.value.length - 1;
  const live = () => messages.value[index];
  running.value = true;
  scrollToBottom(true);

  let Anthropic;
  try {
    const started = await streamText({
      system: SYSTEM,
      messages: history,
      onText: (delta) => {
        live().content += delta;
        scrollToBottom();
      },
      onThinking: (delta) => (live().thinking += delta),
      onFallback: (block) => (live().notice = `Les filtres de sécurité ont passé la main à ${block.to?.model ?? 'un modèle de repli'}.`),
    });
    Anthropic = started.Anthropic;
    activeStream = started.stream;
    const final = await activeStream.finalMessage();
    const stop = describeStop(final);
    if (stop) live().notice = stop;
  } catch (e) {
    const message = describeError(Anthropic, e);
    if (message) error.value = message;
    else live().interrupted = true;
    if (!live().content) messages.value.splice(index, 1);
  } finally {
    running.value = false;
    activeStream = null;
    scrollToBottom();
  }
}

function stop() {
  activeStream?.abort();
}

function newChat() {
  stop();
  messages.value = [];
  error.value = '';
}

function onComposerKey(event) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    send();
  }
}

// ── Boîte à outils ─────────────────────────────────────────────────────────
const task = ref(TASKS[0]);
const taskInput = ref('');
const taskOutput = ref('');
const taskRunning = ref(false);
const taskError = ref('');
const taskNotice = ref('');
let taskStream = null;

async function runTask() {
  if (!taskInput.value.trim() || taskRunning.value) return;
  taskOutput.value = '';
  taskError.value = '';
  taskNotice.value = '';
  taskRunning.value = true;
  let Anthropic;
  try {
    const started = await streamText({
      system: task.value.system,
      messages: [{ role: 'user', content: taskInput.value }],
      onText: (delta) => (taskOutput.value += delta),
    });
    Anthropic = started.Anthropic;
    taskStream = started.stream;
    const stop = describeStop(await taskStream.finalMessage());
    if (stop) taskNotice.value = stop;
  } catch (e) {
    const message = describeError(Anthropic, e);
    if (message) taskError.value = message;
  } finally {
    taskRunning.value = false;
    taskStream = null;
  }
}

function stopTask() {
  taskStream?.abort();
}

// Un autre outil a envoyé son résultat ici (« Envoyer vers → Assistant IA »).
onMounted(() => {
  if (!pending.value) return;
  const item = consume();
  if (!item) return;
  mode.value = 'toolkit';
  taskInput.value = item.content;
  task.value = item.type === 'sql' ? TASKS.find((t) => t.id === 'sql') : TASKS[0];
});

const modelOptions = computed(() => MODELS.map((m) => ({ value: m.id, label: m.name.replace('Claude ', '') })));
const effortOptions = EFFORTS.map((e) => ({ value: e.id, label: e.name }));
</script>

<template>
  <div class="page ai-page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Assistant IA</span>
    </nav>

    <header class="tile tile--tint page-head ai-head" data-accent="violet">
      <div>
        <p class="eyebrow eyebrow--accent">IA · Claude par Anthropic</p>
        <h1>Assistant IA</h1>
        <p class="lead">Pose une question, fais expliquer ou corriger du code, génère une regex ou une requête SQL. Les messages partent vers l’API Anthropic avec ta propre clé.</p>
      </div>
      <div v-if="hasKey" class="side">
        <div class="setting">
          <span class="label">Modèle</span>
          <Segmented v-model="model" :options="modelOptions" label="Modèle" />
          <span class="hint">{{ currentModel.note }} · {{ currentModel.price }} par million de jetons (entrée / sortie)</span>
        </div>
        <div class="setting">
          <span class="label">Réflexion</span>
          <Segmented v-model="effort" :options="effortOptions" label="Niveau d’effort" />
        </div>
        <div class="row">
          <button class="btn btn--sm" type="button" @click="newChat"><Icon name="refresh-cw" /> Nouvelle conversation</button>
          <button class="btn btn--sm btn--ghost" type="button" @click="forgetKey"><Icon name="key-round" /> Oublier la clé</button>
        </div>
      </div>
    </header>

    <!-- Pas encore de clé -->
    <section v-if="!hasKey" class="tile tile--flat setup" data-accent="violet">
      <span class="icon-chip icon-chip--lg"><Icon name="key-round" /></span>
      <h2>Connecter Claude</h2>
      <p class="muted">
        Colle ta clé API Anthropic (<code>sk-ant-…</code>). Elle reste <strong>dans ce navigateur</strong> et n’est envoyée qu’à l’API
        d’Anthropic, jamais ailleurs.
      </p>
      <p class="alert alert--warn">
        <Icon name="triangle-alert" />
        <span>
          Contrairement au reste de DevToolbox, l’assistant <strong>n’est pas hors-ligne</strong> : tes messages sont transmis à Anthropic.
          Utilise une clé dédiée, avec une limite de dépenses, et n’y colle aucun secret.
        </span>
      </p>
      <form class="key-row" @submit.prevent="saveKey">
        <label class="sr-only" for="api-key">Clé API Anthropic</label>
        <input id="api-key" v-model="keyDraft" type="password" placeholder="sk-ant-…" autocomplete="off" spellcheck="false" />
        <button class="btn btn--accent" type="submit" :disabled="!keyDraft.trim()">Enregistrer</button>
      </form>
      <p class="hint">
        Obtenir une clé : <a :href="LINKS.anthropicKeys" target="_blank" rel="noopener">console.anthropic.com</a>. Détails dans
        <RouterLink to="/confidentialite">Confidentialité &amp; mentions</RouterLink>.
      </p>
    </section>

    <template v-else>
      <div class="mode-bar">
        <Segmented
          v-model="mode"
          :options="[
            { value: 'chat', label: 'Conversation' },
            { value: 'toolkit', label: 'Boîte à outils' },
          ]"
          label="Mode"
        />
      </div>

      <!-- Conversation -->
      <section v-if="mode === 'chat'" class="tile tile--flat chat">
        <div ref="listEl" class="messages" role="log" aria-live="polite" aria-label="Conversation" @scroll="onScroll">
          <div v-if="!messages.length" class="empty-chat">
            <span class="icon-chip icon-chip--lg" data-accent="violet"><Icon name="sparkles" /></span>
            <p class="big">Que veux-tu savoir ?</p>
            <div class="suggestions">
              <button
                v-for="s in ['Explique-moi les closures en JavaScript', 'Docker : volume nommé ou bind mount ?', 'Comment fonctionne un code TOTP ?', 'Écris une requête SQL pour les 10 meilleurs clients']"
                :key="s"
                class="chip"
                type="button"
                @click="draft = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <article v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
            <span class="avatar" aria-hidden="true"><Icon :name="m.role === 'user' ? 'user' : 'sparkles'" /></span>
            <div class="bubble">
              <p class="who">{{ m.role === 'user' ? 'Toi' : m.model }}</p>
              <p v-if="m.role === 'user'" class="user-text">{{ m.content }}</p>
              <template v-else>
                <details v-if="m.thinking" class="thinking">
                  <summary>Réflexion</summary>
                  <p>{{ m.thinking }}</p>
                </details>
                <p v-if="!m.content && running && i === messages.length - 1" class="typing">Claude réfléchit…</p>
                <MarkdownView v-else :source="m.content" />
                <p v-if="m.interrupted" class="chip">Réponse interrompue</p>
                <p v-if="m.notice" class="alert alert--warn"><Icon name="info" /> <span>{{ m.notice }}</span></p>
                <div v-if="m.content && !(running && i === messages.length - 1)" class="msg-actions">
                  <CopyButton :value="m.content" label="Copier la réponse" />
                </div>
              </template>
            </div>
          </article>
        </div>

        <button v-if="!stuckToBottom" class="btn btn--sm to-bottom" type="button" @click="scrollToBottom(true)"><Icon name="arrow-down" /> Revenir en bas</button>

        <p v-if="error" class="alert alert--error"><Icon name="circle-x" /> <span>{{ error }}</span></p>

        <form class="composer" @submit.prevent="send">
          <label class="sr-only" for="ai-draft">Ton message</label>
          <textarea
            id="ai-draft"
            v-model="draft"
            rows="2"
            placeholder="Écris ton message… (Entrée pour envoyer, Maj + Entrée pour aller à la ligne)"
            spellcheck="false"
            @keydown="onComposerKey"
          />
          <button v-if="running" class="btn btn--danger" type="button" @click="stop"><Icon name="square" /> Arrêter</button>
          <button v-else class="btn btn--accent" type="submit" :disabled="!draft.trim()"><Icon name="send" /> Envoyer</button>
        </form>
        <p class="disclaimer"><Icon name="info" /> Réponses générées par IA : elles peuvent contenir des erreurs. Vérifie avant de t’en servir.</p>
      </section>

      <!-- Boîte à outils -->
      <section v-else class="tile tile--flat toolkit">
        <div class="tasks" role="group" aria-label="Tâche">
          <button
            v-for="t in TASKS"
            :key="t.id"
            class="task"
            type="button"
            :aria-pressed="task.id === t.id"
            @click="(task = t), (taskOutput = ''), (taskError = '')"
          >
            <Icon :name="t.icon" />
            {{ t.name }}
          </button>
        </div>
        <div class="field">
          <label class="label" for="task-input">Entrée</label>
          <textarea id="task-input" v-model="taskInput" rows="9" spellcheck="false" :placeholder="task.placeholder" />
        </div>
        <div class="row">
          <button v-if="taskRunning" class="btn btn--danger" type="button" @click="stopTask"><Icon name="square" /> Arrêter</button>
          <button v-else class="btn btn--accent" type="button" :disabled="!taskInput.trim()" @click="runTask"><Icon name="sparkles" /> {{ task.name }}</button>
        </div>
        <p v-if="taskError" class="alert alert--error"><Icon name="circle-x" /> <span>{{ taskError }}</span></p>
        <div v-if="taskOutput || taskRunning" class="out">
          <div class="out-head">
            <span class="label">Résultat</span>
            <CopyButton v-if="taskOutput && !taskRunning" :value="taskOutput" />
          </div>
          <div class="panel">
            <p v-if="!taskOutput" class="typing">Claude réfléchit…</p>
            <MarkdownView v-else :source="taskOutput" />
          </div>
        </div>
        <p v-if="taskNotice" class="alert alert--warn"><Icon name="info" /> <span>{{ taskNotice }}</span></p>
        <p class="disclaimer"><Icon name="info" /> Réponses générées par IA : vérifie le code avant de l’utiliser.</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.ai-head .side {
  display: grid;
  gap: 14px;
}

.setting {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.setup {
  display: grid;
  gap: 14px;
  justify-items: start;
  max-width: 760px;
  margin: var(--gap) auto 0;
  padding: 34px;
}

.setup h2 {
  font-size: 28px;
}

.setup code {
  font-size: 0.9em;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--soft);
}

.key-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.hint a {
  color: var(--accent);
  text-decoration: underline;
}

.mode-bar {
  margin: var(--gap) 0;
}

.chat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100dvh - var(--header-h) - 120px);
  min-height: 460px;
  padding: 0 0 18px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 24px 26px 8px;
}

.empty-chat {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 40px 10px;
  text-align: center;
}

.big {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 640px;
}

.msg {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.msg.user {
  flex-direction: row-reverse;
}

.avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  background: var(--soft);
  color: var(--muted);
}

.msg.assistant .avatar {
  background: var(--violet-fill);
  color: var(--violet-on);
}

.avatar .icon {
  width: 16px;
  height: 16px;
}

.bubble {
  display: grid;
  gap: 10px;
  min-width: 0;
  max-width: min(820px, 100%);
}

.msg.user .bubble {
  padding: 12px 16px;
  border-radius: 18px 18px 6px 18px;
  background: var(--accent-fill);
  color: var(--on-accent);
}

.msg.user .who {
  color: color-mix(in srgb, var(--on-accent) 75%, transparent);
}

.who {
  font: 500 11.5px var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
}

.user-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.thinking {
  font-size: 13.5px;
  color: var(--muted);
  border-left: 3px solid var(--line-strong);
  padding-left: 12px;
}

.thinking summary {
  cursor: pointer;
  font-weight: 600;
}

.thinking p {
  margin-top: 6px;
  white-space: pre-wrap;
}

.typing {
  color: var(--muted);
  font-style: italic;
}

.msg-actions {
  display: flex;
  gap: 8px;
}

.to-bottom {
  position: absolute;
  left: 50%;
  bottom: 130px;
  transform: translateX(-50%);
  box-shadow: var(--shadow);
  background: var(--tile);
}

.chat > .alert {
  margin: 0 26px;
}

.composer {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  padding: 0 26px;
}

.composer textarea {
  min-height: 56px;
  max-height: 220px;
  font-family: var(--font-sans);
  font-size: 15px;
  resize: none;
}

.disclaimer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 26px;
  font-size: 12.5px;
  color: var(--subtle);
}

.disclaimer .icon {
  width: 14px;
  height: 14px;
}

.toolkit {
  display: grid;
  gap: 16px;
  padding: 26px;
}

.tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.task {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--r-full);
  border: 1px solid var(--line);
  background: var(--tile-2);
  font-weight: 650;
  font-size: 14px;
}

.task .icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.task[aria-pressed='true'] {
  background: var(--accent-fill);
  color: var(--on-accent);
  border-color: transparent;
}

.task[aria-pressed='true'] .icon {
  color: inherit;
}

@media (max-width: 640px) {
  .messages {
    padding: 18px 14px 8px;
  }

  .composer,
  .disclaimer {
    padding: 0 14px;
  }

  .composer {
    flex-direction: column;
    align-items: stretch;
  }

  .key-row {
    flex-direction: column;
  }

  .setup {
    padding: 24px;
  }
}
</style>
