// Mise en forme XML. La validation passe par DOMParser (sans exécution de quoi que ce soit).

export function minifyXml(xml) {
  return xml
    .replace(/<!--[\s\S]*?-->/g, (c) => c) // les commentaires sont conservés tels quels
    .replace(/>\s+</g, '><')
    .trim();
}

export function formatXml(xml, indent = 2) {
  const pad = ' '.repeat(indent);
  const tokens = minifyXml(xml)
    .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
    .split('\n');
  let depth = 0;
  const out = [];
  for (const raw of tokens) {
    const token = raw.trim();
    if (!token) continue;
    const closing = /^<\//.test(token);
    const selfContained = /^<[^>]+>[^<]*<\/[^>]+>$/.test(token);
    const special = /\/>$/.test(token) || /^<[?!]/.test(token);
    const opening = /^<[^/!?]/.test(token) && !special && !selfContained;
    if (closing) depth = Math.max(0, depth - 1);
    out.push(pad.repeat(depth) + token);
    if (opening) depth += 1;
  }
  return out.join('\n');
}

export function validateXml(xml) {
  if (typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const error = doc.querySelector('parsererror');
  if (!error) return '';
  const text = (error.textContent || '').replace(/\s+/g, ' ').trim();
  const where = text.match(/line (\d+) at column (\d+)/i) || text.match(/ligne (\d+).*colonne (\d+)/i);
  return where ? `XML invalide : ligne ${where[1]}, colonne ${where[2]}.` : 'XML invalide.';
}
