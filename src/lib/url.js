// Encodage d'URL et décomposition. « composant » = encodeURIComponent (une valeur de
// paramètre) ; « URL complète » = encodeURI (garde : / ? # & =).

export function transformUrl(input, mode, scope = 'component') {
  if (!input) return { text: '', error: '' };
  try {
    if (mode === 'encode') return { text: scope === 'full' ? encodeURI(input) : encodeURIComponent(input), error: '' };
    // decodeURIComponent ne décode pas « + » : en query string, il vaut un espace.
    const plusAsSpace = scope === 'form' ? input.replace(/\+/g, ' ') : input;
    return { text: scope === 'full' ? decodeURI(plusAsSpace) : decodeURIComponent(plusAsSpace), error: '' };
  } catch (e) {
    return { text: '', error: `Séquence % invalide : ${e.message}` };
  }
}

export function parseUrl(input) {
  try {
    const url = new URL(input.trim());
    return {
      protocol: url.protocol,
      username: url.username,
      host: url.hostname,
      port: url.port || '(par défaut)',
      pathname: url.pathname,
      hash: url.hash,
      params: [...url.searchParams.entries()],
      origin: url.origin,
    };
  } catch {
    return null;
  }
}
