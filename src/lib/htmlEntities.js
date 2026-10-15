// Échappement HTML. L'ancienne version encodait chaque moitié d'une paire de
// substitution UTF-16 séparément (&#55357;&#56395;), ce qui casse les emojis :
// on itère désormais par point de code (&#128075;).

const NAMED = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** mode 'special' : seulement & < > " ' — mode 'all' : tout ce qui n'est pas ASCII imprimable. */
export function encodeEntities(text, mode = 'special') {
  let out = '';
  for (const char of String(text)) {
    if (NAMED[char]) out += NAMED[char];
    else if (mode === 'all' && char.codePointAt(0) > 126) out += `&#${char.codePointAt(0)};`;
    else out += char;
  }
  return out;
}

/** Décode toutes les entités HTML (nommées et numériques) sans exécuter de HTML. */
export function decodeEntities(text) {
  if (typeof DOMParser === 'undefined') {
    return String(text)
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&(amp|lt|gt|quot|#39|apos);/g, (m) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" })[m]);
  }
  // Un document inerte (DOMParser) n'exécute ni scripts ni gestionnaires d'événements.
  const doc = new DOMParser().parseFromString(`<!doctype html><body><textarea>${String(text).replace(/<\/textarea/gi, '&lt;/textarea')}</textarea>`, 'text/html');
  return doc.querySelector('textarea')?.value ?? '';
}
