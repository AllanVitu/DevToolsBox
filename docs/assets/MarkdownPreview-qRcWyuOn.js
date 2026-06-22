import{_ as g,o as m,c as _,w as $,a as i,f as v,v as w,u as b,z as k,d as j}from"./index-BpkrKYIB.js";import{T as x}from"./ToolShell-D1bAoKNN.js";import{u as M}from"./usePersistentRef-wT1gM4ft.js";const T={class:"split"},P={class:"field pane"},U={class:"field pane"},q=["innerHTML"],B={__name:"MarkdownPreview",setup(H){const u=M("md:input",`# Titre

Un paragraphe avec du **gras**, de l'*italique* et du \`code\`.

## Liste

- Premier point
- Deuxième point

> Une citation utile.

\`\`\`js
const x = 42
\`\`\`

[Un lien](https://vuejs.org)`);function d(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function a(r){return r.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>")}function h(r){const t=d(r).split(`
`),s=[];let e=0,c=[];const l=()=>{c.length&&(s.push(`<p>${a(c.join(" "))}</p>`),c=[])};for(;e<t.length;){const o=t[e];if(/^```/.test(o.trim())){l();const n=[];for(e++;e<t.length&&!/^```/.test(t[e].trim());)n.push(t[e]),e++;e++,s.push(`<pre><code>${n.join(`
`)}</code></pre>`);continue}const p=o.match(/^(#{1,6})\s+(.*)$/);if(p){l(),s.push(`<h${p[1].length}>${a(p[2])}</h${p[1].length}>`),e++;continue}if(/^(-{3,}|\*{3,}|_{3,})\s*$/.test(o)){l(),s.push("<hr>"),e++;continue}if(/^>\s?/.test(o)){l();const n=[];for(;e<t.length&&/^>\s?/.test(t[e]);)n.push(t[e].replace(/^>\s?/,"")),e++;s.push(`<blockquote>${a(n.join(" "))}</blockquote>`);continue}if(/^\s*[-*+]\s+/.test(o)){l();const n=[];for(;e<t.length&&/^\s*[-*+]\s+/.test(t[e]);)n.push(`<li>${a(t[e].replace(/^\s*[-*+]\s+/,""))}</li>`),e++;s.push(`<ul>${n.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(o)){l();const n=[];for(;e<t.length&&/^\s*\d+\.\s+/.test(t[e]);)n.push(`<li>${a(t[e].replace(/^\s*\d+\.\s+/,""))}</li>`),e++;s.push(`<ol>${n.join("")}</ol>`);continue}if(o.trim()===""){l(),e++;continue}c.push(o),e++}return l(),s.join(`
`)}const f=j(()=>h(u.value));return(r,t)=>(m(),_(x,{title:"Aperçu Markdown",icon:"M↓",desc:"Écris à gauche, vois le rendu à droite."},{default:$(()=>[i("div",T,[i("div",P,[t[1]||(t[1]=i("label",null,"Markdown",-1)),v(i("textarea",{"onUpdate:modelValue":t[0]||(t[0]=s=>k(u)?u.value=s:null),spellcheck:"false"},null,512),[[w,b(u)]])]),i("div",U,[t[2]||(t[2]=i("label",null,"Aperçu",-1)),i("div",{class:"md-body",innerHTML:f.value},null,8,q)])])]),_:1}))}},R=g(B,[["__scopeId","data-v-dfeaeea2"]]);export{R as default};
