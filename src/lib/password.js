import { randomInt } from './random';

export const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~',
};
const AMBIGUOUS = /[Il1O0o|`'"]/g;

export function buildPools({ lower, upper, digits, symbols, noAmbiguous }) {
  const pools = [];
  for (const [key, on] of Object.entries({ lower, upper, digits, symbols })) {
    if (!on) continue;
    const chars = noAmbiguous ? CHARSETS[key].replace(AMBIGUOUS, '') : CHARSETS[key];
    if (chars) pools.push(chars);
  }
  return pools;
}

/**
 * Mot de passe aléatoire (crypto, sans biais) contenant au moins un caractère de
 * chaque famille cochée — les politiques de mot de passe l'exigent souvent.
 */
export function generatePassword(length, options) {
  const pools = buildPools(options);
  if (!pools.length) return '';
  const all = pools.join('');
  const n = Math.min(Math.max(Number(length) || 16, pools.length, 4), 128);
  const chars = pools.map((pool) => pool[randomInt(pool.length)]);
  while (chars.length < n) chars.push(all[randomInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** Entropie (bits) d'un secret tiré uniformément : longueur × log2(taille de l'alphabet). */
export function entropyBits(length, alphabetSize) {
  return alphabetSize < 2 ? 0 : Math.round(length * Math.log2(alphabetSize));
}

/** Phrase de passe : mots tirés au hasard dans une liste. */
export function generatePassphrase(words, count = 5, separator = '-') {
  return Array.from({ length: count }, () => words[randomInt(words.length)]).join(separator);
}

export function strengthLabel(bits) {
  if (bits < 40) return { label: 'Faible', level: 1, tone: 'danger' };
  if (bits < 60) return { label: 'Correct', level: 2, tone: 'warn' };
  if (bits < 90) return { label: 'Fort', level: 3, tone: 'ok' };
  return { label: 'Excellent', level: 4, tone: 'ok' };
}
