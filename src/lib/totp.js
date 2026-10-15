import { randomBytes } from './random';

// Codes à usage unique : HOTP (RFC 4226) et TOTP (RFC 6238), secrets en Base32 (RFC 4648).
// C'est exactement ce que calculent Google Authenticator, Aegis ou 2FAS à partir du
// QR code « otpauth:// » scanné lors de l'activation de la double authentification.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(bytes) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text) {
  const clean = String(text).toUpperCase().replace(/[\s-]/g, '').replace(/=+$/, '');
  if (!clean) throw new Error('secret vide');
  let bits = 0;
  let value = 0;
  const out = [];
  for (const c of clean) {
    const index = ALPHABET.indexOf(c);
    if (index === -1) throw new Error(`caractère « ${c} » invalide en Base32 (A-Z et 2-7)`);
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** Secret aléatoire de 20 octets (160 bits, taille recommandée par la RFC 4226). */
export function generateSecret(bytes = 20) {
  return base32Encode(randomBytes(bytes));
}

const HASHES = { SHA1: 'SHA-1', SHA256: 'SHA-256', SHA512: 'SHA-512' };

export async function hotp(secretBytes, counter, { digits = 6, algorithm = 'SHA1' } = {}) {
  const message = new Uint8Array(8);
  let c = BigInt(counter);
  for (let i = 7; i >= 0; i--) {
    message[i] = Number(c & 0xffn);
    c >>= 8n;
  }
  const key = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: HASHES[algorithm] }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, message));
  // Troncature dynamique (RFC 4226 §5.3).
  const offset = mac[mac.length - 1] & 0x0f;
  const binary = ((mac[offset] & 0x7f) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
  return String(binary % 10 ** digits).padStart(digits, '0');
}

export async function totp(secretBytes, { time = Date.now(), period = 30, digits = 6, algorithm = 'SHA1' } = {}) {
  const counter = Math.floor(time / 1000 / period);
  return hotp(secretBytes, counter, { digits, algorithm });
}

export function secondsLeft(period = 30, time = Date.now()) {
  return period - (Math.floor(time / 1000) % period);
}

/** URI à encoder dans un QR code pour une application d'authentification. */
export function otpauthUri({ secret, issuer, account, digits = 6, period = 30, algorithm = 'SHA1' }) {
  const label = encodeURIComponent(issuer ? `${issuer}:${account}` : account);
  const params = new URLSearchParams({ secret, issuer: issuer || '', algorithm, digits: String(digits), period: String(period) });
  if (!issuer) params.delete('issuer');
  return `otpauth://totp/${label}?${params.toString()}`;
}
