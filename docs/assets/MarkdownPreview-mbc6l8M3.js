import{_ as p,o as d,p as h,q as f,a as r,H as g,I as m,u as _,N as $,h as v}from"./index-Du61lVK2.js";import{T as w}from"./ToolShell-YZQeLsus.js";import{u as b}from"./usePersistentRef-BDrH1h2H.js";function k(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function u(a){return a.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>")}function j(a){const t=k(a).split(`
`),l=[];let e=0,n=[];const o=()=>{n.length&&(l.push(`<p>${u(n.join(" "))}</p>`),n=[])};for(;e<t.length;){const i=t[e];if(/^```/.test(i.trim())){o();const s=[];for(e++;e<t.length&&!/^```/.test(t[e].trim());)s.push(t[e]),e++;e++,l.push(`<pre><code>${s.join(`
`)}</code></pre>`);continue}const c=i.match(/^(#{1,6})\s+(.*)$/);if(c){o(),l.push(`<h${c[1].length}>${u(c[2])}</h${c[1].length}>`),e++;continue}if(/^(-{3,}|\*{3,}|_{3,})\s*$/.test(i)){o(),l.push("<hr>"),e++;continue}if(/^&gt;\s?/.test(i)){o();const s=[];for(;e<t.length&&/^&gt;\s?/.test(t[e]);)s.push(t[e].replace(/^&gt;\s?/,"")),e++;l.push(`<blockquote>${u(s.join(" "))}</blockquote>`);continue}if(/^\s*[-*+]\s+/.test(i)){o();const s=[];for(;e<t.length&&/^\s*[-*+]\s+/.test(t[e]);)s.push(`<li>${u(t[e].replace(/^\s*[-*+]\s+/,""))}</li>`),e++;l.push(`<ul>${s.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(i)){o();const s=[];for(;e<t.length&&/^\s*\d+\.\s+/.test(t[e]);)s.push(`<li>${u(t[e].replace(/^\s*\d+\.\s+/,""))}</li>`),e++;l.push(`<ol>${s.join("")}</ol>`);continue}if(i.trim()===""){o(),e++;continue}n.push(i),e++}return o(),l.join(`
`)}const x={class:"split"},M={class:"field pane"},T={class:"field pane"},P=["innerHTML"],q={__name:"MarkdownPreview",setup(a){const t=b("md:input",`# Titre

Un paragraphe avec du **gras**, de l'*italique* et du \`code\`.

## Liste

- Premier point
- Deuxième point

> Une citation utile.

\`\`\`js
const x = 42
\`\`\`

[Un lien](https://vuejs.org)`),l=v(()=>j(t.value));return(e,n)=>(d(),h(w,{title:"Aperçu Markdown",icon:"M↓",desc:"Écris à gauche, vois le rendu à droite."},{default:f(()=>[r("div",x,[r("div",M,[n[1]||(n[1]=r("label",null,"Markdown",-1)),g(r("textarea",{"onUpdate:modelValue":n[0]||(n[0]=o=>$(t)?t.value=o:null),spellcheck:"false"},null,512),[[m,_(t)]])]),r("div",T,[n[2]||(n[2]=r("label",null,"Aperçu",-1)),r("div",{class:"md-body",innerHTML:l.value},null,8,P)])])]),_:1}))}},L=p(q,[["__scopeId","data-v-e0161cd5"]]);export{L as default};
