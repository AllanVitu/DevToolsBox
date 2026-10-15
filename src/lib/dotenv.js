// .env ⇄ JSON. Gère `export`, les commentaires, les guillemets simples/doubles
// (avec \n et \" dans les doubles) et les commentaires en fin de ligne non quotée.

export function parseDotenv(text) {
  const result = {};
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][\w.-]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue;
    const quote = value[0];
    if (quote === '"' || quote === "'" || quote === '`') {
      // Valeur quotée, éventuellement sur plusieurs lignes.
      let body = value.slice(1);
      while (!new RegExp(`(^|[^\\\\])${quote}\\s*(#.*)?$`).test(body) && i + 1 < lines.length) body += '\n' + lines[++i];
      body = body.replace(new RegExp(`${quote}\\s*(#.*)?$`), '');
      value = quote === '"' ? body.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : body;
    } else {
      value = value.replace(/\s+#.*$/, '').trim();
    }
    result[key] = value;
  }
  return result;
}

export function stringifyDotenv(object) {
  return Object.entries(object)
    .map(([key, raw]) => {
      let value = raw == null ? '' : typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
      if (/[\s#"'=\\]/.test(value) || value.includes('\n')) {
        value = `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
      }
      return `${key}=${value}`;
    })
    .join('\n');
}

export function convertDotenv(input, mode) {
  if (!String(input).trim()) return { text: '', error: '' };
  try {
    if (mode === 'env2json') return { text: JSON.stringify(parseDotenv(input), null, 2), error: '' };
    const parsed = JSON.parse(input);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { text: '', error: 'Le JSON doit être un objet { "CLÉ": "valeur" }.' };
    }
    return { text: stringifyDotenv(parsed), error: '' };
  } catch (e) {
    return { text: '', error: e.message };
  }
}
