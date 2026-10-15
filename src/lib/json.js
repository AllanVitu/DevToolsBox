// Formatage / validation JSON, avec localisation de l'erreur (ligne, colonne).

/** Retrouve la position d'une erreur de JSON.parse dans le texte source. */
export function locateJsonError(text, message) {
  let index = null;
  const pos = message.match(/position (\d+)/i);
  const lineCol = message.match(/line (\d+) column (\d+)/i);
  if (pos) index = Number(pos[1]);
  else if (lineCol) {
    const [line, col] = [Number(lineCol[1]), Number(lineCol[2])];
    const lines = text.split('\n');
    index = lines.slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0) + col - 1;
  }
  if (index === null || Number.isNaN(index)) return null;
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const column = index - before.lastIndexOf('\n');
  return { index, line, column };
}

export function formatJson(text, { indent = 2, minify = false, sortKeys = false } = {}) {
  if (!text.trim()) return { text: '', error: '' };
  try {
    let value = JSON.parse(text);
    if (sortKeys) value = sortDeep(value);
    return { text: JSON.stringify(value, null, minify ? 0 : Number(indent) || 2), error: '' };
  } catch (e) {
    const where = locateJsonError(text, e.message);
    return { text: '', error: where ? `Ligne ${where.line}, colonne ${where.column} : ${e.message}` : e.message };
  }
}

export function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort((a, b) => a.localeCompare(b))
        .map((k) => [k, sortDeep(value[k])]),
    );
  }
  return value;
}
