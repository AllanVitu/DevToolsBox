// JSON ⇄ CSV (RFC 4180). Séparateur au choix : la virgule, ou le point-virgule
// qu'attend Excel en français.

function escapeCell(value, delimiter) {
  const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /["\r\n]/.test(text) || text.includes(delimiter) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function jsonToCsv(json, { delimiter = ',' } = {}) {
  const data = JSON.parse(json);
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return '';
  const headers = [];
  for (const row of rows) for (const key of Object.keys(row && typeof row === 'object' ? row : { valeur: row })) if (!headers.includes(key)) headers.push(key);
  const lines = [headers.map((h) => escapeCell(h, delimiter)).join(delimiter)];
  for (const row of rows) {
    const obj = row && typeof row === 'object' ? row : { valeur: row };
    lines.push(headers.map((h) => escapeCell(obj[h], delimiter)).join(delimiter));
  }
  return lines.join('\n');
}

/** Découpe un texte CSV en lignes de cellules (guillemets, retours à la ligne échappés). */
export function parseCsv(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += c;
    } else if (c === '"' && cell === '') quoted = true;
    else if (c === delimiter) {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (quoted) throw new Error('guillemet non fermé');
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/** Devine le séparateur (virgule, point-virgule ou tabulation) sur la première ligne. */
export function detectDelimiter(text) {
  const first = text.split(/\r?\n/, 1)[0] || '';
  const counts = [',', ';', '\t'].map((d) => [d, first.split(d).length - 1]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

function typed(value) {
  if (value === '') return '';
  if (value === 'true' || value === 'false') return value === 'true';
  if (value === 'null') return null;
  // Nombres « simples » uniquement : 007 ou 1e3 restent du texte (codes postaux, identifiants…).
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

export function csvToJson(text, { delimiter = 'auto', inferTypes = true } = {}) {
  const sep = delimiter === 'auto' ? detectDelimiter(text) : delimiter;
  const rows = parseCsv(text.trim(), sep);
  if (!rows.length) return '[]';
  const [headers, ...body] = rows;
  const objects = body
    .filter((r) => !(r.length === 1 && r[0] === ''))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, inferTypes ? typed(r[i] ?? '') : (r[i] ?? '')])));
  return JSON.stringify(objects, null, 2);
}
