// Timestamps Unix (secondes ou millisecondes) ⇄ dates.

const rtf = typeof Intl !== 'undefined' ? new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }) : null;
const UNITS = [
  ['year', 31_536_000_000],
  ['month', 2_592_000_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
];

export function relative(ms, now = Date.now()) {
  const diff = ms - now;
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size || unit === 'second') return rtf ? rtf.format(Math.round(diff / size), unit) : `${Math.round(diff / size)} ${unit}`;
  }
  return '';
}

/** Devine l'unité : au-delà de 10^11, c'est forcément des millisecondes (an 5138 en secondes). */
export function guessUnit(value) {
  return Math.abs(Number(value)) >= 1e11 ? 'ms' : 's';
}

export function fromTimestamp(input, unit = 'auto', now = Date.now()) {
  const text = String(input).trim();
  if (!text || !/^-?\d+(\.\d+)?$/.test(text)) return null;
  const value = Number(text);
  const resolved = unit === 'auto' ? guessUnit(value) : unit;
  const ms = resolved === 's' ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return {
    unit: resolved,
    local: date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' }),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    relative: relative(ms, now),
    seconds: Math.floor(ms / 1000),
    millis: Math.round(ms),
  };
}

/** Valeur pour un <input type="datetime-local"> en heure LOCALE (l'ancienne version mettait l'heure UTC). */
export function toLocalInputValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function fromLocalInput(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : { seconds: Math.floor(date.getTime() / 1000), millis: date.getTime(), iso: date.toISOString() };
}
