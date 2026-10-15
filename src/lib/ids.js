import { randomBytes } from './random';

// Identifiants : UUID v4 (aléatoire), UUID v7 (RFC 9562, horodaté) et ULID.

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function uuidV4() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return formatUuid(b);
}

function formatUuid(bytes) {
  const hex = Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** UUID v7 : 48 bits de millisecondes Unix, version 7, variante RFC, 74 bits aléatoires. */
export function uuidV7(time = Date.now()) {
  const b = randomBytes(16);
  const ms = Math.floor(time);
  b[0] = Math.floor(ms / 2 ** 40) & 0xff;
  b[1] = Math.floor(ms / 2 ** 32) & 0xff;
  b[2] = Math.floor(ms / 2 ** 24) & 0xff;
  b[3] = Math.floor(ms / 2 ** 16) & 0xff;
  b[4] = Math.floor(ms / 2 ** 8) & 0xff;
  b[5] = ms & 0xff;
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  return formatUuid(b);
}

function encodeTime(ms) {
  let value = Math.floor(ms);
  let out = '';
  for (let i = 0; i < 10; i++) {
    out = CROCKFORD[value % 32] + out;
    value = Math.floor(value / 32);
  }
  return out;
}

/**
 * Générateur d'ULID monotone : dans une même milliseconde, la partie aléatoire est
 * incrémentée, si bien que les ULID restent strictement croissants.
 */
export function createUlidFactory() {
  let lastTime = -1;
  let lastRandom = null;
  return function ulid(time = Date.now()) {
    const ms = Math.floor(time);
    let random;
    if (ms === lastTime && lastRandom) {
      random = [...lastRandom];
      for (let i = random.length - 1; i >= 0; i--) {
        if (random[i] < 31) {
          random[i] += 1;
          break;
        }
        random[i] = 0;
      }
    } else {
      random = Array.from(randomBytes(16), (b) => b & 31);
    }
    lastTime = ms;
    lastRandom = random;
    return encodeTime(ms) + random.map((i) => CROCKFORD[i]).join('');
  };
}

/** Instant encodé dans un ULID ou un UUID v7 (ou null). */
export function timeOf(id) {
  const value = String(id).trim();
  if (/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value)) {
    let ms = 0;
    for (const c of value.slice(0, 10).toUpperCase()) ms = ms * 32 + CROCKFORD.indexOf(c);
    return new Date(ms);
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return new Date(parseInt(value.replace(/-/g, '').slice(0, 12), 16));
  }
  return null;
}
