// Conversions d'unités. Facteurs exacts quand une définition légale existe
// (pouce = 0,0254 m, livre = 0,45359237 kg, nœud = 1852 m/h…).

export const CATEGORIES = {
  Longueur: { units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, 'mille marin': 1852 } },
  Masse: { units: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237 } },
  Vitesse: { units: { 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704, nœud: 1852 / 3600 } },
  Temps: { units: { ms: 0.001, s: 1, min: 60, h: 3600, jour: 86400, semaine: 604800 } },
  Données: { units: { bit: 0.125, octet: 1, Ko: 1e3, Mo: 1e6, Go: 1e9, To: 1e12, Kio: 1024, Mio: 1024 ** 2, Gio: 1024 ** 3, Tio: 1024 ** 4 } },
  Débit: { units: { 'kbit/s': 125, 'Mbit/s': 125_000, 'Gbit/s': 125_000_000, 'Ko/s': 1000, 'Mo/s': 1e6 } },
  Température: { units: { '°C': 1, '°F': 1, K: 1 }, special: true },
};

function toCelsius(value, unit) {
  if (unit === '°F') return ((value - 32) * 5) / 9;
  if (unit === 'K') return value - 273.15;
  return value;
}

function fromCelsius(value, unit) {
  if (unit === '°F') return (value * 9) / 5 + 32;
  if (unit === 'K') return value + 273.15;
  return value;
}

export function convertAll(category, value, from) {
  const cat = CATEGORIES[category];
  if (!cat || !Number.isFinite(value)) return [];
  return Object.keys(cat.units).map((unit) => {
    const result = cat.special ? fromCelsius(toCelsius(value, from), unit) : (value * cat.units[from]) / cat.units[unit];
    return { unit, value: result, active: unit === from };
  });
}

export function formatNumber(n) {
  if (!Number.isFinite(n)) return '—';
  if (n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e15)) return n.toExponential(6).replace('.', ',');
  return Number(n.toPrecision(12)).toLocaleString('fr-FR', { maximumFractionDigits: 10 });
}
