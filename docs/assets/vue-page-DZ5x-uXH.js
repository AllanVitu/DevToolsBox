var e={id:`vue-page`,title:`Créer une page en Vue 3`,icon:`component`,summary:`Anatomie d'un composant et passage à une vraie page.`,track:`front`,order:1,keywords:[`vue`,`page`,`composant`,`sfc`,`script setup`,`réactivité`],tools:[],added:null,readingTime:2,quiz:[{q:`Quelles sont les 3 parties d&#39;un fichier .vue ?`,options:[`script, template, style`,`html, php, sql`,`header, body, footer`],answer:0,explain:`&lt;script setup&gt; (logique), &lt;template&gt; (affichage), &lt;style scoped&gt; (style).`},{q:`Quelle fonction rend une donnée réactive ?`,options:[`ref()`,`print()`,`var()`],answer:0,explain:`Avec ref(), l&#39;affichage se met à jour dès que la valeur change.`},{q:`Qu&#39;est-ce qui transforme un composant en page ?`,options:[`Le routeur (une URL)`,`Le CSS`,`Un commentaire`],answer:0,explain:`Une page = un composant associé à une URL via vue-router.`}],toc:[{id:`un-fichier-vue-c-est-3-parties`,html:`Un fichier .vue, c&#39;est 3 parties`},{id:`la-reactivite-la-magie-de-vue`,html:`La réactivité : la magie de Vue`},{id:`transformer-un-composant-en-page`,html:`Transformer un composant en page`}],blocks:[{type:`heading`,id:`un-fichier-vue-c-est-3-parties`,html:`Un fichier .vue, c&#39;est 3 parties`},{type:`text`,html:`Un composant Vue (appelé <strong>SFC</strong>, <em>Single File Component</em>) regroupe dans un seul fichier la logique, l&#39;affichage et le style.`},{type:`code`,lang:`vue`,label:`vue`,code:`<script setup>
import { ref, computed } from 'vue'

// ref() crée une donnée RÉACTIVE : si elle change, l'affichage se met à jour.
const prenom = ref('Allan')

// computed() crée une valeur DÉRIVÉE, recalculée automatiquement.
const message = computed(() => 'Bonjour ' + prenom.value + ' !')
<\/script>

<template>
  <section>
    <h1>{{ message }}</h1>
    <input v-model="prenom" placeholder="Ton prénom" />
  </section>
</template>

<style scoped>
section {
  padding: 2rem;
}
</style>`,html:`<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ref, computed } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'vue'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ref() crée une donnée RÉACTIVE : si elle change, l'affichage se met à jour.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> prenom</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Allan'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// computed() crée une valeur DÉRIVÉE, recalculée automatiquement.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> message</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> computed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=></span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'Bonjour '</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> prenom.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">+</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> ' !'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>{{ message }}&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"prenom"</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> placeholder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"Ton prénom"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">style</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> scoped</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  padding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">rem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>`},{type:`list`,ordered:!1,items:[`<code>&lt;script setup&gt;</code> : la <strong>logique</strong> (les données, les fonctions).`,`<code>&lt;template&gt;</code> : l&#39;<strong>affichage</strong> (le HTML, avec <code>{{ }}</code> pour insérer une valeur).`,`<code>&lt;style scoped&gt;</code> : le <strong>style</strong>, isolé à ce seul composant.`]},{type:`heading`,id:`la-reactivite-la-magie-de-vue`,html:`La réactivité : la magie de Vue`},{type:`text`,html:`Avec <code>ref()</code>, une donnée devient <strong>réactive</strong> : dès qu&#39;elle change, l&#39;écran se met à jour tout seul. <code>v-model</code> relie l&#39;<code>input</code> à <code>prenom</code> dans les deux sens — tape dans le champ, le titre change instantanément.`},{type:`heading`,id:`transformer-un-composant-en-page`,html:`Transformer un composant en page`},{type:`text`,html:`Une « page » est simplement un composant associé à une <strong>URL</strong> grâce au routeur.`},{type:`code`,lang:`javascript`,label:`javascript`,code:`// router.js
import { createRouter, createWebHistory } from 'vue-router'
import Accueil from './pages/Accueil.vue'

const routes = [
  { path: '/', component: Accueil },
  { path: '/profil', component: () => Promise.resolve('./pages/Profil.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})`,html:`<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// router.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { createRouter, createWebHistory } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'vue-router'</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Accueil </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> './pages/Accueil.vue'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> routes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  { path: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, component: Accueil },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  { path: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/profil'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=></span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'./pages/Profil.vue'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> createRouter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  history: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">createWebHistory</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  routes,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">})</span></span>`},{type:`list`,ordered:!1,items:[`<code>/</code> affiche la page <strong>Accueil</strong>.`,`<code>/profil</code> affiche la page <strong>Profil</strong>, chargée seulement quand on en a besoin (<em>lazy loading</em>).`]},{type:`callout`,variant:`info`,html:`Dans cette app, chaque outil est une page : compare avec <code>src/router.js</code> et <code>src/tools.js</code>.`}]};export{e as default};