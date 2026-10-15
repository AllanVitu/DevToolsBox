// JSON → interfaces TypeScript.
// Les objets d'un même tableau sont fusionnés (une clé absente de certains devient
// optionnelle), les types mélangés deviennent des unions, et deux interfaces de
// même nom reçoivent un suffixe numérique au lieu d'entrer en collision.

const IDENT = /^[A-Za-z_$][\w$]*$/;

export function pascal(text) {
  const words = String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const name = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  return /^[A-Za-z]/.test(name) ? name : `Item${name}`;
}

function singular(name) {
  if (/ies$/i.test(name)) return name.slice(0, -3) + 'y';
  if (/(ss|us|is)$/i.test(name)) return name;
  return name.replace(/s$/i, '') || name;
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function jsonToTs(value, rootName = 'Root', { exportKeyword = true } = {}) {
  const kw = exportKeyword ? 'export ' : '';
  const root = pascal(rootName || 'Root');
  const declarations = [];
  const used = new Map();

  function uniqueName(base) {
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}${count + 1}`;
  }

  function union(types) {
    const list = [...new Set(types)];
    return list.length === 1 ? list[0] : list.join(' | ');
  }

  function typeOfValues(values, hint) {
    const objects = values.filter(isPlainObject);
    const types = [];
    if (objects.length) types.push(objectType(objects, hint));
    for (const v of values) {
      if (isPlainObject(v)) continue;
      if (v === null) types.push('null');
      else if (Array.isArray(v)) types.push(arrayType(v, hint));
      else if (['string', 'number', 'boolean'].includes(typeof v)) types.push(typeof v);
      else types.push('unknown');
    }
    return union(types);
  }

  function arrayType(items, hint) {
    if (!items.length) return 'unknown[]';
    const inner = typeOfValues(items, singular(hint));
    return inner.includes(' | ') ? `(${inner})[]` : `${inner}[]`;
  }

  function objectType(samples, hint) {
    const name = uniqueName(pascal(hint));
    const keys = [];
    for (const s of samples) for (const k of Object.keys(s)) if (!keys.includes(k)) keys.push(k);
    const lines = keys.map((key) => {
      const present = samples.filter((s) => Object.prototype.hasOwnProperty.call(s, key));
      const optional = present.length < samples.length ? '?' : '';
      const prop = IDENT.test(key) ? key : JSON.stringify(key);
      return `  ${prop}${optional}: ${typeOfValues(present.map((s) => s[key]), key)};`;
    });
    declarations.push(`${kw}interface ${name} {\n${lines.join('\n')}\n}`);
    return name;
  }

  if (isPlainObject(value)) {
    objectType([value], root);
  } else {
    used.set(root, 1);
    const type = Array.isArray(value) ? arrayType(value, `${root} item`) : typeOfValues([value], root);
    declarations.push(`${kw}type ${root} = ${type};`);
  }
  // Les déclarations sont produites des feuilles vers la racine : on affiche la racine en premier.
  return declarations.reverse().join('\n\n');
}
