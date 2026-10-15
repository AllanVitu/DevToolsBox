// Base64 en UTF-8 (btoa/atob ne gèrent que le Latin-1) et sa variante « URL-safe »
// (RFC 4648 §5 : + → -, / → _, sans remplissage =).

function bytesToBinary(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return binary;
}

export function encodeBase64(text, { urlSafe = false } = {}) {
  const b64 = btoa(bytesToBinary(new TextEncoder().encode(text)));
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

/** Décode du Base64 standard ou URL-safe, avec ou sans remplissage. */
export function decodeBase64(input) {
  let b64 = String(input).replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(b64)) throw new Error('caractères invalides pour du Base64');
  b64 = b64.replace(/=+$/, '');
  if (b64.length % 4 === 1) throw new Error('longueur invalide');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function transformBase64(input, mode, options = {}) {
  if (!input) return { text: '', error: '' };
  try {
    return { text: mode === 'encode' ? encodeBase64(input, options) : decodeBase64(input), error: '' };
  } catch (e) {
    const reason = e instanceof TypeError ? 'le résultat n’est pas du texte UTF-8 valide' : e.message;
    return { text: '', error: `Base64 invalide : ${reason}.` };
  }
}

export function encodeShareState(state) {
  return encodeBase64(JSON.stringify(state), { urlSafe: true });
}

export function decodeShareState(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    return JSON.parse(decodeBase64(value));
  } catch {
    return null;
  }
}
