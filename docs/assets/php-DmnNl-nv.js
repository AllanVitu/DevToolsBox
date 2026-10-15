var e={id:`php`,title:`Les bases de PHP`,icon:`server`,summary:`Le langage du serveur, expliqué simplement.`,track:`back`,order:1,keywords:[`php`,`serveur`,`backend`,`api`,`json`],tools:[],added:null,readingTime:2,quiz:[{q:`Où s&#39;exécute le code PHP ?`,options:[`Sur le serveur`,`Dans le navigateur`,`Sur l&#39;imprimante`],answer:0,explain:`PHP tourne côté serveur ; le navigateur n&#39;en voit que le résultat.`},{q:`Par quel symbole commence une variable PHP ?`,options:[`$`,`#`,`@`],answer:0,explain:`Exemple : $prenom = &#39;Allan&#39;;`},{q:`Quelle fonction renvoie des données au format JSON ?`,options:[`json_encode()`,`echo_json()`,`print_r()`],answer:0,explain:`json_encode() transforme un tableau PHP en texte JSON.`}],toc:[{id:`php-c-est-quoi`,html:`PHP, c&#39;est quoi ?`},{id:`la-syntaxe-de-base`,html:`La syntaxe de base`},{id:`un-mini-point-d-entree-api`,html:`Un mini point d&#39;entrée (API)`}],blocks:[{type:`heading`,id:`php-c-est-quoi`,html:`PHP, c&#39;est quoi ?`},{type:`text`,html:`PHP s&#39;exécute <strong>sur le serveur</strong>, pas dans le navigateur. Le <strong>front</strong> (Vue) gère l&#39;affichage côté utilisateur ; le <strong>back</strong> (PHP) gère ce qui se passe côté serveur : lire une base de données, vérifier un mot de passe, envoyer un e-mail...`},{type:`heading`,id:`la-syntaxe-de-base`,html:`La syntaxe de base`},{type:`code`,lang:`php`,label:`php`,code:`<?php
// Une variable commence toujours par un dollar
$prenom = 'Allan';
$age = 33;

// Une fonction : un bloc réutilisable qui renvoie un résultat
function saluer($nom) {
    return 'Bonjour ' . $nom;
}

echo saluer($prenom); // affiche : Bonjour Allan`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">&#x3C;?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">php</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// Une variable commence toujours par un dollar</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$prenom </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'Allan'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$age </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 33</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// Une fonction : un bloc réutilisable qui renvoie un résultat</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> saluer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($nom) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'Bonjour '</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> .</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $nom;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">echo</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> saluer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($prenom); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// affiche : Bonjour Allan</span></span>`},{type:`list`,ordered:!1,items:[`Le code PHP vit après la balise <code>&lt;?php</code>.`,`Les variables commencent par <code>$</code>.`,`On colle deux textes avec un point <code>.</code> (la <strong>concaténation</strong>).`,`<code>echo</code> écrit la réponse renvoyée au navigateur.`]},{type:`heading`,id:`un-mini-point-d-entree-api`,html:`Un mini point d&#39;entrée (API)`},{type:`text`,html:`En pratique, PHP renvoie surtout des <strong>données</strong> (au format JSON) que le front se charge d&#39;afficher.`},{type:`code`,lang:`php`,label:`php`,code:`<?php
// api/bonjour.php — renvoie du JSON
header('Content-Type: application/json');

// $_GET lit les paramètres de l'URL : ?prenom=Allan
$prenom = $_GET['prenom'] ?? 'inconnu';

$reponse = [
    'message' => 'Bonjour ' . $prenom,
    'heure'   => date('H:i:s'),
];

echo json_encode($reponse);`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">&#x3C;?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">php</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// api/bonjour.php — renvoie du JSON</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Content-Type: application/json'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// $_GET lit les paramètres de l'URL : ?prenom=Allan</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$prenom </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $_GET[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'prenom'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">??</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'inconnu'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$reponse </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">    'message'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =></span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'Bonjour '</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> .</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $prenom,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">    'heure'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">   =></span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'H:i:s'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">echo</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> json_encode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($reponse);</span></span>`},{type:`callout`,variant:`info`,html:`<code>$_GET</code> lit les paramètres de l&#39;URL. <code>?? &#39;inconnu&#39;</code> signifie : « si ce paramètre est absent, utilise <em>inconnu</em> à la place ».`}]};export{e as default};