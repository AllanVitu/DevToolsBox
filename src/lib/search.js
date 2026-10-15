// Recherche floue partagée (palette de commandes, catalogue d'outils, fiches, snippets).
// Une correspondance exacte en début de mot l'emporte, puis les sous-chaînes, puis les
// lettres dans l'ordre (« jsf » trouve « JSON Formatter »).

export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function score(haystack, query) {
  const text = normalize(haystack);
  const q = normalize(query).trim();
  if (!q) return 0;
  const index = text.indexOf(q);
  if (index !== -1) {
    const wordStart = index === 0 || /[\s\-_./]/.test(text[index - 1]);
    return 1000 - index + (wordStart ? 60 : 0);
  }
  let from = 0;
  let last = -2;
  let streak = 0;
  let total = 0;
  for (const char of q) {
    if (char === ' ') continue;
    const at = text.indexOf(char, from);
    if (at === -1) return -1;
    if (at === last + 1) {
      streak += 1;
      total += 5 + streak;
    } else {
      streak = 0;
      total += 1;
    }
    last = at;
    from = at + 1;
  }
  return total;
}

/**
 * Filtre et trie une liste. `fields` renvoie le texte cherchable de chaque élément ;
 * le premier champ (le titre) pèse plus lourd que les autres.
 */
export function rank(items, query, fields) {
  const q = String(query ?? '').trim();
  if (!q) return items;
  return items
    .map((item) => {
      const [title, ...rest] = fields(item);
      const best = Math.max(score(title, q) * 1.5, score([title, ...rest].join(' '), q));
      return { item, best };
    })
    .filter((entry) => entry.best >= 0)
    .sort((a, b) => b.best - a.best)
    .map((entry) => entry.item);
}
