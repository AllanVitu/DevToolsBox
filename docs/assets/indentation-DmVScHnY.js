var e={id:`indentation`,title:`Indentation & lisibilité`,icon:`indent-increase`,summary:`Décaler son code pour le rendre lisible d'un coup d'œil.`,track:`bases`,order:2,keywords:[`indentation`,`espaces`,`lisibilité`,`format`,`prettier`],tools:[],added:null,readingTime:2,quiz:[{q:`À quoi sert principalement l&#39;indentation ?`,options:[`Montrer la structure du code`,`Accélérer le programme`,`Réduire la taille du fichier`],answer:0,explain:`Elle révèle ce qui est imbriqué dans quoi — une aide visuelle.`},{q:`Combien d&#39;espaces par niveau, par convention, en JavaScript / Vue ?`,options:[`2`,`8`,`0`],answer:0,explain:`2 espaces en JS/Vue, 4 en PHP/Python. L&#39;essentiel : rester cohérent.`},{q:`Quel outil indente le code automatiquement à la sauvegarde ?`,options:[`Prettier`,`Photoshop`,`Le Bloc-notes`],answer:0,explain:`Prettier (JS) ou PHP-CS-Fixer (PHP) formatent pour toi.`}],toc:[{id:`l-indentation-c-est-quoi`,html:`L&#39;indentation, c&#39;est quoi ?`},{id:`avant-apres`,html:`Avant / après`},{id:`les-conventions-courantes`,html:`Les conventions courantes`}],blocks:[{type:`heading`,id:`l-indentation-c-est-quoi`,html:`L&#39;indentation, c&#39;est quoi ?`},{type:`text`,html:`Indenter, c&#39;est <strong>décaler le code vers la droite</strong> pour montrer ce qui est « à l&#39;intérieur » de quoi. Chaque niveau d&#39;imbrication ajoute un décalage.`},{type:`heading`,id:`avant-apres`,html:`Avant / après`},{type:`code`,lang:`javascript`,label:`javascript`,code:`function total(panier){
let somme=0
for(const article of panier){
if(article.actif){
somme+=article.prix
}
}
return somme
}`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> total</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">panier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> somme</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> article</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> panier){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(article.actif){</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">somme</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">article.prix</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> somme</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>`},{type:`text`,html:`Difficile de voir où commence et où finit chaque bloc. Maintenant, le même code indenté :`},{type:`code`,lang:`javascript`,label:`javascript`,code:`function total(panier) {
  let somme = 0

  for (const article of panier) {
    if (article.actif) {
      somme += article.prix
    }
  }

  return somme
}`,html:`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> total</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">panier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> somme </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> article</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> panier) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (article.actif) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      somme </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> article.prix</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> somme</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>`},{type:`text`,html:`La structure saute aux yeux : on voit immédiatement ce qui dépend de quoi.`},{type:`heading`,id:`les-conventions-courantes`,html:`Les conventions courantes`},{type:`list`,ordered:!1,items:[`<strong>JavaScript / Vue</strong> : 2 espaces par niveau.`,`<strong>PHP</strong> : 4 espaces (norme PSR-12).`,`<strong>Python</strong> : 4 espaces, et c&#39;est même <strong>obligatoire</strong>.`,`Le plus important : <strong>rester cohérent</strong> dans tout le projet.`]},{type:`callout`,variant:`info`,html:`Un <strong>formateur automatique</strong> (Prettier pour JS, PHP-CS-Fixer pour PHP) indente le code pour toi à chaque sauvegarde. Tu n&#39;as plus à y penser.`}]};export{e as default};