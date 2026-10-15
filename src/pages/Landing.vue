<script setup>
import { computed } from 'vue';
import Icon from '@/components/Icon.vue';
import ProgressRing from '@/components/ProgressRing.vue';
import { FAMILIES } from '@/data/families';
import { TOOLS, toolsOfFamily } from '@/data/tools';
import { LESSONS } from '@/data/lessons';
import { COUNTS, NEW_LESSONS, NEW_SHEETS, NEW_TOOLS } from '@/data/catalog';
import { LINKS } from '@/data/site';
import { useProgress } from '@/composables/useProgress';
import { usePwa } from '@/composables/usePwa';
import { MODELS } from '@/composables/useClaude';
import avatar from '@/assets/avatar.webp';

const { percent, completedCount, isLessonDone } = useProgress(LESSONS.map((l) => l.id));
const { canInstall, promptInstall } = usePwa();

const nextLesson = computed(() => LESSONS.find((l) => !isLessonDone(l.id)) || LESSONS[0]);
const families = FAMILIES.map((f) => ({ ...f, count: toolsOfFamily(f.id).length }));

// Mosaïque décorative : une icône par famille, puis quelques outils phares.
const mosaic = ['json', 'sqlschema', 'erd', 'jwt', 'totp', 'csp', 'cron', 'color', 'contrast', 'regex', 'compose', 'nginx', 'cidr', 'qr', 'mcmotd', 'hash']
  .map((id) => TOOLS.find((t) => t.id === id))
  .filter(Boolean);

const highlights = [...NEW_LESSONS.slice(0, 6).map((l) => ({ label: l.title, to: `/apprendre/${l.id}` }))];
</script>

<template>
  <div class="page">
    <div class="bento">
      <section class="tile t-intro" style="--i: 0" aria-labelledby="landing-title">
        <div class="top">
          <p class="status">100 % local · fonctionne hors-ligne</p>
        </div>
        <h1 id="landing-title">Dev<br />Toolbox</h1>
        <p class="role">La boîte à outils du développeur</p>
        <p class="pitch">
          {{ COUNTS.tools }} outils, {{ COUNTS.lessons }} leçons et {{ COUNTS.sheets }} aide-mémoire dans une application
          installable. Ta saisie ne quitte jamais ton navigateur.
        </p>
        <div class="ctas">
          <RouterLink to="/dashboard" class="btn btn--ink"><Icon name="layout-dashboard" /> Tableau de bord</RouterLink>
          <RouterLink to="/apprendre" class="btn"><Icon name="graduation-cap" /> Apprendre</RouterLink>
        </div>
      </section>

      <RouterLink to="/outils" class="tile tile--link tile--tint t-tools" style="--i: 1" data-accent="indigo">
        <span class="arrow" aria-hidden="true"><Icon name="arrow-right" /></span>
        <p class="eyebrow eyebrow--accent">PWA Vue 3 · IA intégrée</p>
        <h2>Tous tes outils, au même endroit</h2>
        <dl class="nums">
          <div><dt>{{ COUNTS.tools }}</dt><dd>Outils</dd></div>
          <div><dt>{{ COUNTS.lessons }}</dt><dd>Leçons</dd></div>
          <div><dt>{{ COUNTS.sheets }}</dt><dd>Fiches</dd></div>
          <div><dt>{{ FAMILIES.length }}</dt><dd>Familles</dd></div>
        </dl>
        <div class="mosaic" aria-hidden="true">
          <span v-for="t in mosaic" :key="t.id" :data-accent="FAMILIES.find((f) => f.id === t.family)?.accent">
            <Icon :name="t.icon" />
          </span>
        </div>
      </RouterLink>

      <RouterLink to="/ai" class="tile tile--link tile--ink t-ai" style="--i: 2">
        <span class="arrow" aria-hidden="true"><Icon name="arrow-right" /></span>
        <p class="eyebrow">Assistant IA</p>
        <p class="big">Claude, dans chaque outil.</p>
        <p class="muted small">
          Chat, explication de code, génération de regex ou de SQL. {{ MODELS[0].name }} par défaut, avec ta propre clé API.
        </p>
      </RouterLink>

      <section class="tile t-fam" style="--i: 3" aria-labelledby="fam-title">
        <p id="fam-title" class="eyebrow">Familles d’outils</p>
        <ul>
          <li v-for="f in families" :key="f.id">
            <RouterLink :to="`/outils/${f.id}`" class="fam" :data-accent="f.accent">
              <span class="icon-chip"><Icon :name="f.icon" /></span>
              <span class="fam-name">{{ f.name }}</span>
              <span class="fam-count">{{ f.count }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <section class="tile t-learn" style="--i: 4" aria-labelledby="learn-title">
        <p id="learn-title" class="eyebrow">Apprendre</p>
        <div class="learn-row">
          <ProgressRing :percent="percent" :size="92" />
          <div>
            <p class="learn-big">{{ completedCount }} / {{ COUNTS.lessons }} leçons</p>
            <p class="muted small">Six parcours, du premier fichier Vue au déploiement Docker. Chaque leçon finit par un quiz.</p>
          </div>
        </div>
        <RouterLink :to="`/apprendre/${nextLesson.id}`" class="next">
          <span class="icon-chip"><Icon :name="nextLesson.icon" /></span>
          <span>
            <span class="eyebrow">{{ completedCount ? 'Continuer' : 'Commencer' }}</span>
            <strong>{{ nextLesson.title }}</strong>
          </span>
          <Icon name="arrow-right" />
        </RouterLink>
      </section>

      <RouterLink to="/apprendre" class="tile tile--link tile--fill t-new" style="--i: 5" data-accent="violet">
        <span class="arrow" aria-hidden="true"><Icon name="arrow-right" /></span>
        <p class="eyebrow">Nouveau · octobre 2026</p>
        <p class="big">
          {{ NEW_LESSONS.length }} leçons, {{ NEW_SHEETS.length }} fiches et {{ NEW_TOOLS.length }} outils en plus.
        </p>
        <ul class="news">
          <li v-for="h in highlights" :key="h.to">{{ h.label }}</li>
        </ul>
      </RouterLink>

      <section class="tile tile--dashed t-offline" style="--i: 6" data-accent="emerald">
        <p class="eyebrow eyebrow--accent">Hors-ligne</p>
        <p class="mid">Installe-la, emporte-la.</p>
        <p class="muted small">Un service worker garde toute l’app en cache : outils, leçons et fiches restent disponibles sans réseau.</p>
        <button v-if="canInstall" class="btn btn--accent btn--sm" type="button" @click="promptInstall"><Icon name="download" /> Installer</button>
      </section>

      <a :href="LINKS.portfolio" target="_blank" rel="noopener" class="tile tile--link t-made" style="--i: 7">
        <span class="arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
        <img :src="avatar" alt="" width="72" height="88" loading="lazy" />
        <p class="eyebrow">Conçu par</p>
        <p class="mid">Allan Vitu</p>
        <p class="muted small">Voir le portfolio</p>
      </a>
    </div>
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(170px, auto));
  grid-template-areas:
    'intro intro intro intro intro tools tools tools tools tools ai ai'
    'intro intro intro intro intro tools tools tools tools tools ai ai'
    'fam fam fam fam learn learn learn learn new new new new'
    'fam fam fam fam learn learn learn learn off off made made';
}

.small {
  font-size: 13.5px;
  line-height: 1.5;
}

.big {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.mid {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

/* intro */
.t-intro {
  grid-area: intro;
  display: flex;
  flex-direction: column;
  padding: 34px;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: var(--r-full);
  background: color-mix(in srgb, var(--emerald-fill) 14%, transparent);
  color: var(--emerald-text);
}

.status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--emerald-fill);
  animation: ping 2.4s infinite;
}

@keyframes ping {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
  }
  70%,
  100% {
    box-shadow: 0 0 0 8px transparent;
  }
}

.t-intro h1 {
  font-size: clamp(48px, 6vw, 92px);
  line-height: 0.9;
  letter-spacing: -0.06em;
  margin-top: auto;
  padding-top: 28px;
}

.role {
  font-size: 19px;
  font-weight: 650;
  margin-top: 16px;
}

.pitch {
  color: var(--muted);
  margin-top: 8px;
  max-width: 44ch;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

/* outils */
.t-tools {
  grid-area: tools;
  padding: 30px;
  min-height: 340px;
}

.t-tools h2 {
  font-size: clamp(28px, 2.8vw, 40px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.04;
  margin-top: 8px;
  max-width: 16ch;
}

.nums {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 16px;
}

.nums dt {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}

.nums dd {
  font-size: 12.5px;
  color: var(--muted);
}

.mosaic {
  position: absolute;
  left: 30px;
  right: -40px;
  bottom: -26px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  transform: rotate(-4deg);
  transform-origin: bottom left;
  transition: transform 0.5s var(--ease);
}

.t-tools:hover .mosaic {
  transform: rotate(-2deg) translateY(-8px);
}

.mosaic span {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--tile);
  border: 1px solid var(--line);
  color: var(--accent);
  box-shadow: 0 12px 30px rgba(40, 40, 110, 0.12);
}

.mosaic .icon {
  width: 42%;
  height: 42%;
}

/* IA */
.t-ai {
  grid-area: ai;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-end;
}

.t-ai .eyebrow {
  position: absolute;
  top: 24px;
  left: 24px;
}

/* familles */
.t-fam {
  grid-area: fam;
}

.t-fam ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 14px;
}

.fam {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: var(--r-md);
  transition: background 0.2s;
}

.fam:hover {
  background: var(--soft);
}

.fam .icon-chip {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.fam .icon-chip .icon {
  width: 16px;
  height: 16px;
}

.fam-name {
  flex: 1;
  font-size: 14px;
  font-weight: 650;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fam-count {
  font: 500 12px var(--font-mono);
  color: var(--subtle);
}

/* apprendre */
.t-learn {
  grid-area: learn;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.learn-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.learn-big {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.next {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 12px 14px;
  border-radius: var(--r-lg);
  background: var(--tile-2);
  border: 1px solid var(--line);
  transition:
    border-color 0.2s,
    transform 0.3s var(--ease);
}

.next:hover {
  border-color: color-mix(in srgb, var(--accent-fill) 50%, transparent);
  transform: translateY(-2px);
}

.next > span:nth-child(2) {
  display: grid;
  flex: 1;
  min-width: 0;
}

.next strong {
  font-size: 15px;
  letter-spacing: -0.01em;
}

.next > .icon {
  color: var(--accent);
}

/* nouveautés */
.t-new {
  grid-area: new;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.news li {
  font: 500 12px var(--font-mono);
  padding: 5px 10px;
  border-radius: var(--r-full);
  background: color-mix(in srgb, var(--on-accent) 16%, transparent);
}

/* hors-ligne */
.t-offline {
  grid-area: off;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

/* auteur */
.t-made {
  grid-area: made;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
}

.t-made img {
  position: absolute;
  top: 16px;
  left: 18px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 18%;
  background: var(--tile-2);
}

@media (max-width: 1180px) {
  .bento {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-rows: minmax(200px, auto);
    grid-template-areas:
      'intro intro intro intro intro intro'
      'tools tools tools tools ai ai'
      'fam fam fam learn learn learn'
      'new new new new off off'
      'made made made made made made';
  }

  .t-intro {
    min-height: 420px;
  }

  .t-made img {
    position: static;
    margin-bottom: 8px;
  }
}

@media (max-width: 700px) {
  .bento {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'intro' 'tools' 'ai' 'learn' 'fam' 'new' 'off' 'made';
  }

  .t-intro {
    padding: 26px;
    min-height: 0;
  }

  .t-intro h1 {
    padding-top: 40px;
  }

  .t-tools {
    min-height: 380px;
  }

  .mosaic {
    grid-template-columns: repeat(6, 1fr);
  }

  .t-fam ul {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
