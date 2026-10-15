import { randomInt } from './random';

// Jeux de données factices réalistes (prénoms, villes… français).
const FIRST = ['Allan', 'Léa', 'Hugo', 'Emma', 'Noah', 'Jade', 'Lucas', 'Chloé', 'Adam', 'Manon', 'Gabriel', 'Inès', 'Raphaël', 'Louise', 'Arthur', 'Alice', 'Nolan', 'Zoé', 'Sacha', 'Lina'];
const LAST = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'Roux', 'Fournier', 'Girard'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Nice', 'Strasbourg', 'Rennes', 'Montpellier', 'Mulhouse', 'Grenoble', 'Dijon'];
const ROLES = ['admin', 'éditeur', 'lecteur', 'modérateur'];

const pick = (list) => list[randomInt(list.length)];
const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function isoDateWithin(days) {
  return new Date(Date.now() - randomInt(days * 86_400_000)).toISOString().slice(0, 10);
}

export function mockPerson(id) {
  const prenom = pick(FIRST);
  const nom = pick(LAST);
  return {
    id,
    prenom,
    nom,
    email: `${ascii(prenom)}.${ascii(nom)}${randomInt(90) + 10}@example.com`,
    ville: pick(CITIES),
    age: 18 + randomInt(52),
    role: pick(ROLES),
    actif: randomInt(10) > 2,
    inscrit_le: isoDateWithin(730),
  };
}

function csvCell(value) {
  const s = String(value);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function generateMock(count, format = 'json') {
  const n = Math.min(Math.max(Number(count) || 1, 1), 500);
  const rows = Array.from({ length: n }, (_, i) => mockPerson(i + 1));
  if (format === 'csv') {
    const headers = Object.keys(rows[0]);
    return [headers.join(','), ...rows.map((r) => headers.map((h) => csvCell(r[h])).join(','))].join('\n');
  }
  if (format === 'sql') {
    const headers = Object.keys(rows[0]);
    const lit = (v) => (typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : `'${String(v).replace(/'/g, "''")}'`);
    return `INSERT INTO utilisateurs (${headers.join(', ')}) VALUES\n${rows.map((r) => `  (${headers.map((h) => lit(r[h])).join(', ')})`).join(',\n')};`;
  }
  return JSON.stringify(rows, null, 2);
}
