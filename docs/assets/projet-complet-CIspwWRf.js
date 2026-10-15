var e={id:`projet-complet`,title:`Créer une app de A à Z (Vue 3 + PHP + PostgreSQL)`,icon:`rocket`,summary:`Le guide complet : du front au back, jusqu'à la base de données.`,track:`back`,order:7,keywords:[`projet`,`fullstack`,`vue`,`php`,`postgresql`,`api`,`crud`,`complet`,`capstone`],tools:[`sqlschema`,`erd`],added:null,readingTime:5,quiz:[{q:`Avec quoi PHP se connecte-t-il à PostgreSQL ?`,options:[`PDO`,`jQuery`,`le CSS`],answer:0,explain:`PDO + le pilote pgsql, avec des requêtes préparées.`},{q:`Comment se protéger de l&#39;injection SQL ?`,options:[`Des requêtes préparées (:param)`,`Mettre la variable directement`,`Désactiver la base`],answer:0,explain:`Les paramètres (:titre) sont échappés automatiquement.`},{q:`Comment stocker un mot de passe en PHP ?`,options:[`password_hash()`,`en clair dans la base`,`dans un commentaire`],answer:0,explain:`On enregistre le hash, et on vérifie avec password_verify().`},{q:`Que produit <code>npm run build</code> côté Vue ?`,options:[`Un dossier dist/ de fichiers statiques`,`Une base de données`,`Un serveur PHP`],answer:0,explain:`Ce dossier dist/ s&#39;héberge sur n&#39;importe quel serveur web.`}],toc:[{id:`vue-d-ensemble-3-briques-qui-se-parlent`,html:`Vue d&#39;ensemble : 3 briques qui se parlent`},{id:`le-schema-complet`,html:`Le schéma complet`},{id:`1-les-prerequis`,html:`1. Les prérequis`},{id:`2-la-base-de-donnees-postgresql`,html:`2. La base de données PostgreSQL`},{id:`3-le-back-se-connecter-a-la-base-pdo`,html:`3. Le back : se connecter à la base (PDO)`},{id:`4-le-back-une-api-qui-lit-et-ecrit`,html:`4. Le back : une API qui lit et écrit`},{id:`5-lancer-le-serveur-php`,html:`5. Lancer le serveur PHP`},{id:`6-le-front-creer-le-projet-vue-3`,html:`6. Le front : créer le projet Vue 3`},{id:`7-afficher-les-donnees-get`,html:`7. Afficher les données (GET)`},{id:`8-envoyer-des-donnees-post`,html:`8. Envoyer des données (POST)`},{id:`9-la-securite-le-minimum-vital`,html:`9. La sécurité, le minimum vital`},{id:`10-mettre-en-ligne`,html:`10. Mettre en ligne`},{id:`recapitulatif`,html:`Récapitulatif`}],blocks:[{type:`heading`,id:`vue-d-ensemble-3-briques-qui-se-parlent`,html:`Vue d&#39;ensemble : 3 briques qui se parlent`},{type:`text`,html:`Une application web complète repose sur trois briques. Tout l&#39;art consiste à les faire communiquer proprement.`},{type:`list`,ordered:!1,items:[`<strong>Le front (Vue 3)</strong> : ce que voit l&#39;utilisateur, dans le navigateur.`,`<strong>Le back (PHP)</strong> : le serveur qui reçoit les requêtes et applique la logique.`,`<strong>La base (PostgreSQL)</strong> : là où les données sont stockées durablement.`]},{type:`heading`,id:`le-schema-complet`,html:`Le schéma complet`},{type:`code`,lang:`sch`,label:`éma`,code:`[ Navigateur ]            [ Serveur PHP ]            [ PostgreSQL ]
   Vue 3                     API REST                  base de données
     |   fetch (JSON)           |      requête SQL          |
     | ----------------------> | -----------------------> |
     |                         | <----------------------- |
     |  <--------------------  |     lignes de données    |
     |   affiche le résultat   |     renvoie du JSON       |`,html:`<span class="line">[ Navigateur ]            [ Serveur PHP ]            [ PostgreSQL ]</span>
<span class="line">   Vue 3                     API REST                  base de données</span>
<span class="line">     |   fetch (JSON)           |      requête SQL          |</span>
<span class="line">     | ----------------------&gt; | -----------------------&gt; |</span>
<span class="line">     |                         | &lt;----------------------- |</span>
<span class="line">     |  &lt;--------------------  |     lignes de données    |</span>
<span class="line">     |   affiche le résultat   |     renvoie du JSON       |</span>`},{type:`heading`,id:`1-les-prerequis`,html:`1. Les prérequis`},{type:`list`,ordered:!1,items:[`<strong>Node.js</strong> (avec npm) pour le front Vue.`,`<strong>PHP 8+</strong> pour le serveur.`,`<strong>PostgreSQL</strong>, avec l&#39;extension <code>pdo_pgsql</code> activée dans PHP.`]},{type:`callout`,variant:`info`,html:`Vérifie tes installations : <code>node -v</code>, <code>php -v</code>, <code>psql --version</code>.`},{type:`heading`,id:`2-la-base-de-donnees-postgresql`,html:`2. La base de données PostgreSQL`},{type:`text`,html:`On crée une base et une table. Dans le terminal <code>psql</code> :`},{type:`code`,lang:`sql`,label:`sql`,code:`-- Créer la base
CREATE DATABASE blog;

-- (se connecter à la base) puis créer une table
CREATE TABLE articles (
  id       SERIAL PRIMARY KEY,
  titre    TEXT NOT NULL,
  contenu  TEXT,
  cree_le  TIMESTAMP DEFAULT now()
);

-- Insérer une première ligne
INSERT INTO articles (titre, contenu)
VALUES ('Premier article', 'Bonjour le monde');`,html:`<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">-- Créer la base</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> DATABASE</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> blog</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">-- (se connecter à la base) puis créer une table</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">CREATE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> TABLE</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> articles</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  id       </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">SERIAL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> PRIMARY KEY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  titre    </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">TEXT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> NOT NULL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  contenu  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">TEXT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  cree_le  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">TIMESTAMP</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> DEFAULT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">-- Insérer une première ligne</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">INSERT INTO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> articles (titre, contenu)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">VALUES</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Premier article'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Bonjour le monde'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>`},{type:`list`,ordered:!1,items:[`<code>SERIAL PRIMARY KEY</code> : un identifiant unique qui s&#39;incrémente seul.`,`<code>NOT NULL</code> : le champ est obligatoire.`,`<code>DEFAULT now()</code> : la date est remplie automatiquement.`]},{type:`heading`,id:`3-le-back-se-connecter-a-la-base-pdo`,html:`3. Le back : se connecter à la base (PDO)`},{type:`text`,html:`PHP parle à PostgreSQL via <strong>PDO</strong>. On isole la connexion dans un fichier réutilisable.`},{type:`code`,lang:`php`,label:`php`,code:`<?php
// db.php — connexion partagée à PostgreSQL
function getDb() {
    $hote = 'localhost';
    $base = 'blog';
    $user = 'postgres';
    $mdp  = 'motdepasse';

    $pdo = new PDO("pgsql:host=$hote;dbname=$base", $user, $mdp);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">&#x3C;?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">php</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// db.php — connexion partagée à PostgreSQL</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> getDb</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $hote </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'localhost'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $base </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'blog'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $user </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'postgres'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $mdp  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'motdepasse'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $pdo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> new</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> PDO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"pgsql:host=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$hote</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">;dbname=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, $user, $mdp);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $pdo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">-></span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">setAttribute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">PDO</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">ATTR_ERRMODE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">PDO</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">ERRMODE_EXCEPTION</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $pdo;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>`},{type:`heading`,id:`4-le-back-une-api-qui-lit-et-ecrit`,html:`4. Le back : une API qui lit et écrit`},{type:`text`,html:`Un point d&#39;entrée qui <strong>liste</strong> les articles (GET) et en <strong>crée</strong> un (POST), en renvoyant du JSON.`},{type:`code`,lang:`php`,label:`php`,code:`<?php
require 'db.php';

// Autoriser le front à appeler cette API (CORS)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$pdo = getDb();
$methode = $_SERVER['REQUEST_METHOD'];

if ($methode === 'GET') {
    $articles = $pdo->query('SELECT * FROM articles ORDER BY id DESC')
                    ->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($articles);
}

if ($methode === 'POST') {
    // Lire le JSON envoyé par le front
    $data = json_decode(file_get_contents('php://input'), true);

    // Requête PRÉPARÉE : protège contre l'injection SQL
    $req = $pdo->prepare(
        'INSERT INTO articles (titre, contenu) VALUES (:titre, :contenu)'
    );
    $req->execute([
        ':titre'   => $data['titre'],
        ':contenu' => $data['contenu'],
    ]);
    echo json_encode(['ok' => true]);
}`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">&#x3C;?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">php</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">require</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'db.php'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// Autoriser le front à appeler cette API (CORS)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Access-Control-Allow-Origin: *'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Content-Type: application/json'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$pdo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> getDb</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$methode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $_SERVER[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'REQUEST_METHOD'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> ($methode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'GET'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $articles </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $pdo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">-></span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">query</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">SELECT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> FROM</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> articles </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">ORDER BY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">DESC</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">                    -></span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">fetchAll</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">PDO</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">FETCH_ASSOC</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    echo</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> json_encode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($articles);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> ($methode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'POST'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Lire le JSON envoyé par le front</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> json_decode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">file_get_contents</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'php://input'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Requête PRÉPARÉE : protège contre l'injection SQL</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $req </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $pdo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">-></span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">prepare</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">        '</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">INSERT INTO</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> articles (titre, contenu) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">VALUES</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> (:titre, :contenu)'</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    $req</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">-></span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">execute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">        ':titre'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">   =></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $data[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'titre'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">        ':contenu'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> $data[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'contenu'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    ]);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    echo</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> json_encode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">([</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'ok'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =></span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>`},{type:`callout`,variant:`warn`,html:`<strong>Jamais</strong> une variable directement dans une requête SQL ! On utilise toujours des <strong>requêtes préparées</strong> (<code>:titre</code>) pour éviter l&#39;<strong>injection SQL</strong>.`},{type:`heading`,id:`5-lancer-le-serveur-php`,html:`5. Lancer le serveur PHP`},{type:`code`,lang:`bash`,label:`bash`,code:`# Depuis le dossier du back
php -S localhost:8000`,html:`<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># Depuis le dossier du back</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">php</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> -S</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> localhost:8000</span></span>`},{type:`text`,html:`L&#39;API répond maintenant sur <code>http://localhost:8000/articles.php</code>.`},{type:`heading`,id:`6-le-front-creer-le-projet-vue-3`,html:`6. Le front : créer le projet Vue 3`},{type:`code`,lang:`bash`,label:`bash`,code:`npm create vue@latest mon-app
cd mon-app
npm install
npm run dev`,html:`<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> vue@latest</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> mon-app</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> mon-app</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> dev</span></span>`},{type:`text`,html:`Vue génère la structure (<code>src/</code>, <code>components/</code>, <code>App.vue</code>…). On va afficher la liste, puis ajouter un formulaire.`},{type:`heading`,id:`7-afficher-les-donnees-get`,html:`7. Afficher les données (GET)`},{type:`code`,lang:`vue`,label:`vue`,code:`<script setup>
import { ref, onMounted } from 'vue'

const articles = ref([])
const API = 'http://localhost:8000/articles.php'

async function charger() {
  const res = await fetch(API)
  articles.value = await res.json()
}

// onMounted : s'exécute quand le composant apparaît à l'écran
onMounted(charger)
<\/script>

<template>
  <ul>
    <li v-for="a in articles" :key="a.id">
      <strong>{{ a.titre }}</strong> — {{ a.contenu }}
    </li>
  </ul>
</template>`,html:`<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ref, onMounted } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'vue'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> articles</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">([])</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> API</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'http://localhost:8000/articles.php'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> charger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> res</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">API</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  articles.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> res.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// onMounted : s'exécute quand le composant apparaît à l'écran</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">onMounted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(charger)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> v-for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"a in articles"</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> :key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"a.id"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">strong</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>{{ a.titre }}&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">strong</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">> — {{ a.contenu }}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>`},{type:`heading`,id:`8-envoyer-des-donnees-post`,html:`8. Envoyer des données (POST)`},{type:`code`,lang:`vue`,label:`vue`,code:`<script setup>
import { ref } from 'vue'

const titre = ref('')
const contenu = ref('')
const API = 'http://localhost:8000/articles.php'

async function envoyer() {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titre: titre.value, contenu: contenu.value }),
  })
  titre.value = ''
  contenu.value = ''
  // ... puis recharger la liste
}
<\/script>

<template>
  <form @submit.prevent="envoyer">
    <input v-model="titre" placeholder="Titre" />
    <textarea v-model="contenu" placeholder="Contenu"></textarea>
    <button>Ajouter</button>
  </form>
</template>`,html:`<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ref } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'vue'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> titre</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">''</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> contenu</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">''</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> API</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'http://localhost:8000/articles.php'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> envoyer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">API</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    method: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'POST'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    headers: { </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Content-Type'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'application/json'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    body: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">JSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({ titre: titre.value, contenu: contenu.value }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  titre.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> ''</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  contenu.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> ''</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">  // ... puis recharger la liste</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">form</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> @submit.prevent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"envoyer"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"titre"</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> placeholder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"Titre"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">textarea</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"contenu"</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> placeholder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"Contenu"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">textarea</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Ajouter&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">form</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>`},{type:`callout`,variant:`info`,html:`<code>@submit.prevent</code> empêche le rechargement de page par défaut du formulaire.`},{type:`heading`,id:`9-la-securite-le-minimum-vital`,html:`9. La sécurité, le minimum vital`},{type:`list`,ordered:!1,items:[`<strong>Injection SQL</strong> : toujours des requêtes préparées (vu plus haut).`,`<strong>Mots de passe</strong> : jamais en clair. <code>password_hash()</code> pour enregistrer, <code>password_verify()</code> pour vérifier.`,`<strong>Validation</strong> : vérifie côté serveur que les données reçues sont correctes.`,`<strong>CORS</strong> : en production, remplace <code>*</code> par l&#39;adresse exacte de ton front.`]},{type:`code`,lang:`php`,label:`php`,code:`<?php
// Enregistrer un mot de passe en sécurité
$hash = password_hash($mdpEnClair, PASSWORD_DEFAULT);

// Plus tard, à la connexion
if (password_verify($saisie, $hash)) {
    // mot de passe correct
}`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">&#x3C;?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">php</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// Enregistrer un mot de passe en sécurité</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">$hash </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> password_hash</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($mdpEnClair, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">PASSWORD_DEFAULT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// Plus tard, à la connexion</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">password_verify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">($saisie, $hash)) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // mot de passe correct</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>`},{type:`heading`,id:`10-mettre-en-ligne`,html:`10. Mettre en ligne`},{type:`list`,ordered:!1,items:[`<strong>Front</strong> : <code>npm run build</code> produit un dossier <code>dist/</code> de fichiers statiques, à héberger (Netlify, Vercel, un serveur web…).`,`<strong>Back + base</strong> : un hébergeur compatible PHP + PostgreSQL (VPS ou services managés).`,`<strong>Secrets</strong> : mets les identifiants de la base dans des <strong>variables d&#39;environnement</strong>, jamais en dur dans le code.`]},{type:`callout`,variant:`warn`,html:`Ne committe jamais tes mots de passe ou clés dans Git. Utilise un fichier <code>.env</code> (ignoré par Git) lu côté serveur.`},{type:`heading`,id:`recapitulatif`,html:`Récapitulatif`},{type:`list`,ordered:!1,items:[`<strong>PostgreSQL</strong> stocke les données dans des tables.`,`<strong>PHP</strong> lit/écrit avec PDO et expose une <strong>API JSON</strong>.`,`<strong>Vue 3</strong> appelle l&#39;API avec <code>fetch</code> et affiche le résultat.`,`<strong>Sécurité</strong> : requêtes préparées, mots de passe hashés, validation, secrets en variables d&#39;environnement.`,`Tu as maintenant la carte complète d&#39;une app web moderne. 🚀`]}]};export{e as default};