// Couleurs : lecture de HEX / rgb() / hsl() / oklch(), conversions, contraste WCAG.
// OKLCH (CSS Color 4) est un espace perceptuel : à luminosité L égale, deux teintes
// paraissent aussi claires l'une que l'autre — idéal pour construire des palettes.

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const round = (v, digits = 0) => Number(v.toFixed(digits));

export function hexToRgb(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (/^[0-9a-f]{3,4}$/i.test(h)) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
    a: h.length === 8 ? round(parseInt(h.slice(6, 8), 16) / 255, 3) : 1,
  };
}

export function rgbToHex({ r, g, b, a = 1 }) {
  const parts = [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'));
  if (a < 1) parts.push(Math.round(a * 255).toString(16).padStart(2, '0'));
  return '#' + parts.join('');
}

export function rgbToHsl({ r, g, b }) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb({ h, s, l }) {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

// sRGB ⇄ linéaire ⇄ OKLab (Björn Ottosson, 2020) ⇄ OKLCH
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklch({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: C < 0.0001 ? 0 : H };
}

export function oklchToRgb({ l, c, h }) {
  const hr = (h * Math.PI) / 180;
  const A = c * Math.cos(hr);
  const B = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  const inGamut = [lr, lg, lb].every((v) => v >= -0.0005 && v <= 1.0005);
  const [r, g, b] = [lr, lg, lb].map((v) => Math.round(clamp(fromLinear(clamp(v))) * 255));
  return { r, g, b, inGamut };
}

/** Accepte #hex, rgb()/rgba(), hsl()/hsla() et oklch(). Renvoie { r, g, b, a } ou null. */
export function parseColor(input) {
  const text = String(input || '').trim().toLowerCase();
  if (!text) return null;
  if (text.startsWith('#') || /^[0-9a-f]{3,8}$/.test(text)) return hexToRgb(text);
  const nums = (s) => s.split(/[\s,/]+/).filter(Boolean);
  let m = text.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const [r, g, b, a] = nums(m[1]);
    const ch = (v) => (v.endsWith('%') ? (parseFloat(v) * 255) / 100 : parseFloat(v));
    const out = { r: ch(r), g: ch(g), b: ch(b), a: a === undefined ? 1 : a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a) };
    return [out.r, out.g, out.b].every((v) => v >= 0 && v <= 255) ? { ...out, r: Math.round(out.r), g: Math.round(out.g), b: Math.round(out.b) } : null;
  }
  m = text.match(/^hsla?\(([^)]+)\)$/);
  if (m) {
    const [h, s, l, a] = nums(m[1]);
    const rgb = hslToRgb({ h: parseFloat(h), s: parseFloat(s), l: parseFloat(l) });
    return { ...rgb, a: a === undefined ? 1 : a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a) };
  }
  m = text.match(/^oklch\(([^)]+)\)$/);
  if (m) {
    const [l, c, h, a] = nums(m[1]);
    const L = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
    const rgb = oklchToRgb({ l: L, c: parseFloat(c), h: parseFloat(h) || 0 });
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: a === undefined ? 1 : a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a) };
  }
  return null;
}

export function formats(rgb) {
  const hsl = rgbToHsl(rgb);
  const ok = rgbToOklch(rgb);
  const alpha = rgb.a !== undefined && rgb.a < 1 ? ` / ${round(rgb.a, 2)}` : '';
  return {
    hex: rgbToHex(rgb),
    rgb: `rgb(${rgb.r} ${rgb.g} ${rgb.b}${alpha})`,
    hsl: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%${alpha})`,
    oklch: `oklch(${round(ok.l * 100, 1)}% ${round(ok.c, 3)} ${round(ok.h, 1)}${alpha})`,
  };
}

/** Luminance relative WCAG 2.x (seuil 0,04045 du texte actuel de la norme). */
export function luminance({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Échelle 50 → 950 en OKLCH : teinte constante, luminosité régulière, chroma adoucie aux extrêmes. */
export function oklchScale(rgb) {
  const base = rgbToOklch(rgb);
  const STEPS = [
    [50, 0.97],
    [100, 0.93],
    [200, 0.87],
    [300, 0.79],
    [400, 0.7],
    [500, 0.62],
    [600, 0.54],
    [700, 0.46],
    [800, 0.38],
    [900, 0.3],
    [950, 0.24],
  ];
  return STEPS.map(([step, l]) => {
    const edge = Math.min(1, Math.abs(l - 0.62) / 0.35);
    const c = base.c * (1 - 0.55 * edge * edge);
    const out = oklchToRgb({ l, c, h: base.h });
    return { step, hex: rgbToHex(out), oklch: `oklch(${round(l * 100)}% ${round(c, 3)} ${round(base.h, 1)})` };
  });
}

export function harmonies(rgb) {
  const base = rgbToOklch(rgb);
  const turn = (deg) => rgbToHex(oklchToRgb({ ...base, h: (base.h + deg + 360) % 360 }));
  return {
    'Complémentaire': [turn(180)],
    Analogues: [turn(-30), turn(30)],
    Triadiques: [turn(120), turn(240)],
    'Complémentaires divisées': [turn(150), turn(210)],
  };
}
