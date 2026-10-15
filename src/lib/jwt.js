import { decodeBase64 } from './base64';

// JWT : décodage (en-tête, charge utile, dates) et vérification des signatures HMAC
// (HS256/384/512) avec Web Crypto. Les signatures asymétriques (RS*, ES*) demandent
// une clé publique : hors du périmètre de cet outil.

export function decodeJwt(token) {
  const value = String(token || '').trim();
  if (!value) return { error: '' };
  const parts = value.split('.');
  if (parts.length !== 3) return { error: 'Un JWT compte trois parties séparées par des points (en-tête.charge.signature).' };
  try {
    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));
    return { header, payload, signature: parts[2], parts, error: '' };
  } catch (e) {
    return { error: `Jeton illisible : ${e.message}` };
  }
}

const fmt = (seconds) =>
  new Date(seconds * 1000).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'medium' });

export function claimsTimeline(payload, now = Math.floor(Date.now() / 1000)) {
  if (!payload) return [];
  const items = [];
  if (typeof payload.iat === 'number') items.push({ label: 'Émis le (iat)', value: fmt(payload.iat), state: 'info' });
  if (typeof payload.nbf === 'number') {
    items.push({ label: 'Valide à partir du (nbf)', value: fmt(payload.nbf), state: payload.nbf > now ? 'warn' : 'info' });
  }
  if (typeof payload.exp === 'number') {
    const expired = payload.exp < now;
    items.push({ label: expired ? 'Expiré le (exp)' : 'Expire le (exp)', value: fmt(payload.exp), state: expired ? 'danger' : 'ok' });
  }
  return items;
}

const HMAC = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };

function base64UrlToBytes(value) {
  let b64 = value.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/** Vérifie une signature HMAC. Renvoie { ok, message }. */
export async function verifyHmac(parts, alg, secret) {
  const hash = HMAC[alg];
  if (!hash) return { ok: false, message: `Algorithme ${alg} : vérification non prise en charge ici (seuls HS256/384/512).` };
  if (!secret) return { ok: false, message: 'Saisis le secret partagé pour vérifier la signature.' };
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash }, false, ['verify']);
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  return valid ? { ok: true, message: 'Signature valide pour ce secret.' } : { ok: false, message: 'Signature invalide : mauvais secret, ou jeton modifié.' };
}
