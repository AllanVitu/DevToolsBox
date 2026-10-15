// Expressions cron à 5 champs (minute heure jour-du-mois mois jour-de-semaine).
// Corrige l'ancienne version : « 1-7 » (lundi → dimanche) était refusé, car tous les 7
// étaient remplacés par 0 avant l'analyse. Gère aussi les noms (JAN, MON…) et les macros.

const FIELDS = [
  { key: 'minute', name: 'minute', min: 0, max: 59 },
  { key: 'hour', name: 'heure', min: 0, max: 23 },
  { key: 'dom', name: 'jour du mois', min: 1, max: 31 },
  { key: 'month', name: 'mois', min: 1, max: 12, names: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] },
  { key: 'dow', name: 'jour de semaine', min: 0, max: 7, names: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] },
];

export const MACROS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const MONTHS_FR = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function toNumber(token, field) {
  const lower = token.toLowerCase();
  if (field.names) {
    const index = field.names.indexOf(lower);
    if (index !== -1) return field.key === 'month' ? index + 1 : index;
  }
  if (!/^\d+$/.test(token)) throw new Error(`valeur invalide « ${token} » (${field.name})`);
  return Number(token);
}

function parseField(text, field) {
  const values = new Set();
  for (const part of text.split(',')) {
    const [range, stepText] = part.split('/');
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) throw new Error(`pas invalide « ${part} » (${field.name})`);
    let from;
    let to;
    if (range === '*') {
      from = field.min;
      to = field.key === 'dow' ? 6 : field.max;
    } else if (range.includes('-')) {
      const [a, b] = range.split('-');
      from = toNumber(a, field);
      to = toNumber(b, field);
    } else {
      from = toNumber(range, field);
      to = stepText === undefined ? from : field.key === 'dow' ? 6 : field.max;
    }
    if (from < field.min || to > field.max || from > to) throw new Error(`hors plage ${field.min}-${field.max} : « ${part} » (${field.name})`);
    for (let v = from; v <= to; v += step) values.add(field.key === 'dow' && v === 7 ? 0 : v);
  }
  return [...values].sort((a, b) => a - b);
}

export function parseCron(expression) {
  const raw = String(expression || '').trim();
  const expanded = MACROS[raw.toLowerCase()] || raw;
  if (raw.toLowerCase() === '@reboot') return { error: '@reboot s’exécute au démarrage de la machine : pas de date à calculer.' };
  const parts = expanded.split(/\s+/);
  if (parts.length !== 5) return { error: `Une expression cron compte 5 champs (reçu : ${parts.length}).` };
  try {
    const fields = {};
    FIELDS.forEach((field, i) => {
      fields[field.key] = { values: parseField(parts[i], field), any: parts[i] === '*' || parts[i] === '*/1', raw: parts[i] };
    });
    return { fields, expanded };
  } catch (e) {
    return { error: e.message };
  }
}

function dayMatches(fields, date) {
  const dom = fields.dom.values.includes(date.getDate());
  const dow = fields.dow.values.includes(date.getDay());
  // Règle POSIX : si les deux champs sont restreints, l'un OU l'autre suffit.
  if (!fields.dom.any && !fields.dow.any) return dom || dow;
  if (!fields.dom.any) return dom;
  if (!fields.dow.any) return dow;
  return true;
}

/** Prochaines exécutions (heure locale). Saute jour par jour puis heure par heure : rapide. */
export function nextRuns(fields, from = new Date(), count = 6) {
  const runs = [];
  const d = new Date(from);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const limit = new Date(from);
  limit.setFullYear(limit.getFullYear() + 5);
  while (runs.length < count && d < limit) {
    if (!fields.month.values.includes(d.getMonth() + 1)) {
      d.setMonth(d.getMonth() + 1, 1);
      d.setHours(0, 0, 0, 0);
      continue;
    }
    if (!dayMatches(fields, d)) {
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      continue;
    }
    if (!fields.hour.values.includes(d.getHours())) {
      d.setHours(d.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!fields.minute.values.includes(d.getMinutes())) {
      d.setMinutes(d.getMinutes() + 1, 0, 0);
      continue;
    }
    runs.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1, 0, 0);
  }
  return runs;
}

function list(values, format = (v) => v) {
  if (values.length <= 1) return values.map(format).join('');
  return `${values.slice(0, -1).map(format).join(', ')} et ${format(values[values.length - 1])}`;
}

function stepOf(field) {
  const m = field.raw.match(/^\*\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

/** Description en français, ex. « toutes les 15 minutes, de 9 h à 17 h, du lundi au vendredi ». */
export function describeCron({ minute, hour, dom, month, dow }) {
  const parts = [];
  const minStep = stepOf(minute);
  const hourRange = hour.raw.match(/^(\d+)-(\d+)$/);

  if (minute.any && hour.any) parts.push('chaque minute');
  else if (minStep) parts.push(`toutes les ${minStep} minutes`);
  else if (minute.values.length === 1 && hour.any) parts.push(`à la minute ${minute.values[0]} de chaque heure`);
  else if (minute.values.length === 1 && hour.values.length <= 4 && !hourRange) {
    parts.push(`à ${list(hour.values, (h) => `${h} h ${String(minute.values[0]).padStart(2, '0')}`)}`);
  } else if (!minute.any) parts.push(`aux minutes ${list(minute.values)}`);

  if (!hour.any && (minStep || minute.any || hourRange || minute.values.length > 1)) {
    if (hourRange) parts.push(`de ${hourRange[1]} h à ${hourRange[2]} h`);
    else parts.push(`à ${list(hour.values, (h) => `${h} h`)}`);
  }
  if (!dom.any) parts.push(`le ${list(dom.values)} du mois`);
  if (!month.any) parts.push(`en ${list(month.values, (m) => MONTHS_FR[m])}`);
  if (!dow.any) {
    const range = dow.raw.match(/^(\w+)-(\w+)$/);
    if (range && dow.values.length > 2) parts.push(`du ${DAYS_FR[dow.values[0]]} au ${DAYS_FR[dow.values[dow.values.length - 1]]}`);
    else parts.push(`le ${list(dow.values, (d) => DAYS_FR[d])}`);
  }
  if (!dom.any && !dow.any) parts.push('(jour du mois OU jour de semaine)');
  const text = parts.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
