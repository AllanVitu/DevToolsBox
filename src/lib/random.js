// Aléatoire cryptographique, sans biais de modulo : un tirage « valeur % n » avantage
// légèrement les petites valeurs ; on rejette donc la zone qui crée ce biais.

const buffer = new Uint32Array(1);

export function randomInt(max) {
  if (!Number.isInteger(max) || max <= 0) throw new RangeError('max doit être un entier positif');
  const limit = 0x100000000 - (0x100000000 % max);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function randomBytes(n) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return bytes;
}
