<script setup>
import Icon from '@/components/Icon.vue';
import { LINKS, VERSION } from '@/data/site';

const STORED = [
  ['Préférences', 'thème clair / sombre, couleur d’accent, disposition du tableau de bord'],
  ['Favoris et récents', 'les outils épinglés et les dernières pages ouvertes'],
  ['Progression', 'le meilleur score de chaque quiz'],
  ['Snippets', 'les bouts de code que tu enregistres'],
  ['Saisies des outils', 'le dernier contenu de chaque outil, pour le retrouver au retour'],
  ['Assistant IA', 'ta clé API Anthropic, le modèle et le niveau d’effort choisis — seulement si tu utilises l’IA'],
];
</script>

<template>
  <div class="page">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/dashboard">Tableau de bord</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Confidentialité &amp; mentions</span>
    </nav>

    <header class="tile tile--tint page-head" data-accent="emerald">
      <div>
        <p class="eyebrow eyebrow--accent">Transparence</p>
        <h1>Confidentialité &amp; mentions</h1>
        <p class="lead">
          DevToolbox n’a ni serveur, ni compte, ni cookie, ni mesure d’audience. Ce qui suit décrit précisément ce qui est stocké, où,
          et la seule exception : l’assistant IA.
        </p>
      </div>
      <div class="side">
        <p class="chip chip--ok"><Icon name="shield-check" /> Aucune donnée collectée par DevToolbox</p>
        <p class="chip"><Icon name="clock" /> Mise à jour : 12 octobre 2026 · v{{ VERSION }}</p>
      </div>
    </header>

    <div class="grid sections">
      <section class="tile tile--flat s-wide">
        <h2>Ce qui reste dans ton navigateur</h2>
        <p class="muted">
          Tout est enregistré dans le <code>localStorage</code> de ce navigateur, sous des clés qui commencent par
          <code>devtoolbox:</code>. Rien n’est synchronisé ni envoyé ailleurs :
        </p>
        <dl class="stored">
          <div v-for="[name, desc] in STORED" :key="name">
            <dt>{{ name }}</dt>
            <dd>{{ desc }}</dd>
          </div>
        </dl>
        <p class="muted">
          Le service worker garde aussi en cache une copie des fichiers de l’application (pour le mode hors-ligne) : aucune donnée
          personnelle n’y figure. Ces stockages servent uniquement au fonctionnement que tu demandes, ce qui les dispense de bandeau
          de consentement.
        </p>
        <p class="muted">
          Pour tout supprimer : <strong>Réglages → Tout effacer</strong>, ou efface les données du site depuis les paramètres de ton
          navigateur.
        </p>
      </section>

      <section class="tile tile--flat s-ai" data-accent="violet">
        <span class="icon-chip"><Icon name="sparkles" /></span>
        <h2>L’exception : l’assistant IA</h2>
        <ul class="list">
          <li>
            Quand tu écris à l’assistant ou demandes une « Analyse IA », ton message part <strong>directement de ton navigateur</strong>
            vers l’API d’Anthropic, avec ta clé. DevToolbox ne voit rien passer.
          </li>
          <li>
            Ce traitement relève des conditions et de la
            <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener">politique de confidentialité d’Anthropic</a>. La
            consommation est facturée sur ton compte Anthropic.
          </li>
          <li>
            La clé est stockée en clair dans ce navigateur : utilise une clé dédiée, avec une limite de dépenses, et révoque-la en cas de
            doute. Elle n’est jamais incluse dans les exports.
          </li>
          <li>Ne colle pas de mots de passe, de secrets ou de données personnelles de tiers dans le chat.</li>
          <li>Les réponses sont générées par une IA et peuvent être fausses : vérifie-les avant de t’en servir.</li>
        </ul>
      </section>

      <section class="tile tile--flat s-host">
        <span class="icon-chip"><Icon name="server" /></span>
        <h2>Hébergement</h2>
        <p class="muted">
          Le site est servi par <strong>GitHub Pages</strong> — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107,
          États-Unis. Comme tout hébergeur, GitHub enregistre l’adresse IP des visiteurs pour des raisons de sécurité.
        </p>
        <p class="muted">Les polices sont incluses dans l’application : aucune requête vers un service de polices tiers.</p>
      </section>

      <section class="tile tile--flat s-legal">
        <span class="icon-chip"><Icon name="scale" /></span>
        <h2>Éditeur &amp; conditions</h2>
        <p class="muted">
          Projet personnel et non commercial d’<strong>Allan Vitu</strong>. Contact : via le
          <a :href="LINKS.portfolio" target="_blank" rel="noopener">portfolio</a> ou le
          <a :href="LINKS.repo" target="_blank" rel="noopener">dépôt GitHub</a>.
        </p>
        <p class="muted">
          Le code et le contenu pédagogique sont distribués sous licence <strong>GNU GPL v3</strong>, fournis « tels quels », sans
          garantie. Les leçons et fiches ont une visée pédagogique : vérifie toujours avant un usage en production.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sections {
  margin-top: var(--gap);
}

.sections .tile {
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 28px;
}

.s-wide {
  grid-column: span 7;
}

.s-ai {
  grid-column: span 5;
}

.s-host,
.s-legal {
  grid-column: span 6;
}

h2 {
  font-size: 22px;
}

.stored {
  display: grid;
  gap: 2px;
}

.stored div {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.stored dt {
  font-weight: 700;
}

.stored dd {
  color: var(--muted);
}

.list {
  display: grid;
  gap: 10px;
}

.list li {
  position: relative;
  padding-left: 20px;
  color: var(--muted);
  font-size: 15px;
}

.list li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-fill);
}

a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

code {
  font-size: 0.88em;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--soft);
}

.side {
  justify-items: start;
}

@media (max-width: 1000px) {
  .s-wide,
  .s-ai,
  .s-host,
  .s-legal {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .stored div {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
</style>
