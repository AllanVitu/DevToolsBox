import{o as p,c as N,w as S,a as s,f as m,v as y,u as v,A as _,e as w,t as T,h as b,j as $,k as j,d as k}from"./index-DXyUdI-V.js";import{T as A}from"./ToolShell-sBYXR_3Z.js";import{_ as J}from"./CopyButton-BFJphCcO.js";import{u as g}from"./usePersistentRef-DLmLVVMn.js";const O={class:"row",style:{"margin-bottom":"1rem","align-items":"flex-end"}},V={class:"field"},B={key:0,class:"error"},C={key:1,class:"field"},R={class:"row",style:{"justify-content":"space-between"}},U=["value"],E={__name:"JsonToTs",setup(z){const r=g("jsonts:input",`{
  "id": 1,
  "nom": "Allan",
  "actif": true,
  "adresse": { "ville": "Paris", "cp": "75001" },
  "roles": ["admin", "user"]
}`),o=g("jsonts:root","Root"),l=j("");function f(e){const t=e.replace(/[^a-zA-Z0-9]/g," ").replace(/\s+(.)/g,(d,a)=>a.toUpperCase()),n=t.charAt(0).toUpperCase()+t.slice(1);return/^[A-Za-z]/.test(n)?n:"Item"}function h(e){return e.endsWith("s")?e.slice(0,-1):e}function u(e,t,n){if(e===null)return"null";if(Array.isArray(e))return e.length?u(e[0],h(t),n)+"[]":"unknown[]";if(typeof e=="object"){const d=Object.entries(e).map(([i,x])=>`  ${/^[a-zA-Z_$][\w$]*$/.test(i)?i:`'${i}'`}: ${u(x,f(i),n)};`),a=f(t);return n.push(`interface ${a} {
${d.join(`
`)}
}`),a}return typeof e=="string"?"string":typeof e=="number"?"number":typeof e=="boolean"?"boolean":"unknown"}const c=k(()=>{if(l.value="",!r.value.trim())return"";try{const e=JSON.parse(r.value),t=[];return u(e,o.value||"Root",t),t.reverse().join(`

`)}catch(e){return l.value=e.message,""}});return(e,t)=>(p(),N(A,{title:"JSON → TypeScript",icon:"TS",desc:"Génère les interfaces TypeScript à partir d'un exemple JSON."},{default:S(()=>[s("div",O,[s("div",null,[t[2]||(t[2]=s("label",null,"Nom de l'interface racine",-1)),m(s("input",{"onUpdate:modelValue":t[0]||(t[0]=n=>_(o)?o.value=n:null),type:"text",spellcheck:"false",style:{width:"220px"}},null,512),[[y,v(o)]])])]),s("div",V,[t[3]||(t[3]=s("label",null,"JSON",-1)),m(s("textarea",{"onUpdate:modelValue":t[1]||(t[1]=n=>_(r)?r.value=n:null),rows:"10",spellcheck:"false"},null,512),[[y,v(r)]])]),l.value?(p(),w("p",B,"⚠ "+T(l.value),1)):b("",!0),c.value?(p(),w("div",C,[s("div",R,[t[4]||(t[4]=s("label",{style:{margin:"0"}},"Interfaces TypeScript",-1)),$(J,{value:c.value},null,8,["value"])]),s("textarea",{value:c.value,rows:"12",readonly:"",spellcheck:"false"},null,8,U)])):b("",!0)]),_:1}))}};export{E as default};
