// Différences structurelles entre deux valeurs JSON (chemins façon JSONPath : $.a.b[0]).

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  if (isObject(a) && isObject(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }
  return false;
}

const keyPath = (base, key) => (/^[A-Za-z_$][\w$]*$/.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`);

export function diffJson(a, b, path = '$', out = []) {
  if (deepEqual(a, b)) return out;
  if (isObject(a) && isObject(b)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = keyPath(path, key);
      if (!(key in b)) out.push({ path: p, type: 'removed', oldVal: a[key] });
      else if (!(key in a)) out.push({ path: p, type: 'added', newVal: b[key] });
      else diffJson(a[key], b[key], p, out);
    }
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) out.push({ path: p, type: 'added', newVal: b[i] });
      else if (i >= b.length) out.push({ path: p, type: 'removed', oldVal: a[i] });
      else diffJson(a[i], b[i], p, out);
    }
    return out;
  }
  out.push({ path, type: 'changed', oldVal: a, newVal: b });
  return out;
}

export function summarize(entries) {
  const counts = { added: 0, removed: 0, changed: 0 };
  for (const e of entries) counts[e.type] += 1;
  return counts;
}
