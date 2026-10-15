// Conversion entre bases 2 à 36, en précision illimitée (BigInt).
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
const PREFIXES = { '0x': 16, '0b': 2, '0o': 8 };

/** Lit une valeur (préfixes 0x / 0b / 0o et séparateurs _ ou espaces acceptés). */
export function parseBigInt(input, base) {
  let text = String(input).trim().toLowerCase().replace(/[_\s]/g, '');
  if (!text) return null;
  let negative = false;
  if (text.startsWith('-')) {
    negative = true;
    text = text.slice(1);
  }
  let radix = Number(base);
  const prefix = text.slice(0, 2);
  if (PREFIXES[prefix] && (PREFIXES[prefix] === radix || radix === 10)) {
    radix = PREFIXES[prefix];
    text = text.slice(2);
  }
  if (!text) return null;
  const big = BigInt(radix);
  let value = 0n;
  for (const c of text) {
    const digit = DIGITS.indexOf(c);
    if (digit < 0 || digit >= radix) return null;
    value = value * big + BigInt(digit);
  }
  return { value: negative ? -value : value, radix };
}

export function toBase(value, base) {
  if (value === 0n) return '0';
  const negative = value < 0n;
  let n = negative ? -value : value;
  const big = BigInt(base);
  let out = '';
  while (n > 0n) {
    out = DIGITS[Number(n % big)] + out;
    n /= big;
  }
  return (negative ? '-' : '') + out;
}

/** Groupe les chiffres pour la lisibilité : par 4 en binaire/hexa, par 3 ailleurs. */
export function group(text, base) {
  const size = base === 2 || base === 16 ? 4 : 3;
  const negative = text.startsWith('-');
  const digits = negative ? text.slice(1) : text;
  const parts = [];
  for (let i = digits.length; i > 0; i -= size) parts.unshift(digits.slice(Math.max(0, i - size), i));
  return (negative ? '-' : '') + parts.join(base === 10 ? ' ' : '_');
}
