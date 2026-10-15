import { ref, watch } from 'vue';
import { readRaw, writeRaw } from '@/lib/storage';

export const ACCENTS = [
  { id: 'indigo', name: 'Indigo' },
  { id: 'violet', name: 'Violet' },
  { id: 'sky', name: 'Ciel' },
  { id: 'teal', name: 'Sarcelle' },
  { id: 'emerald', name: 'Émeraude' },
  { id: 'amber', name: 'Ambre' },
  { id: 'rose', name: 'Rose' },
];

// Les versions précédentes stockaient l'accent en hexadécimal (ou « auto »).
const LEGACY_ACCENTS = {
  auto: 'indigo',
  '#4493f8': 'sky',
  '#a371f7': 'violet',
  '#f778ba': 'rose',
  '#fb923c': 'amber',
  '#f85149': 'rose',
  '#39c5cf': 'teal',
};

const THEME_COLORS = { light: '#eeeef1', dark: '#0b0b0e' };
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function initialTheme() {
  const stored = readRaw('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return media && media.matches ? 'dark' : 'light';
}

function initialAccent() {
  const stored = readRaw('accent');
  if (ACCENTS.some((a) => a.id === stored)) return stored;
  return LEGACY_ACCENTS[stored] || 'indigo';
}

const theme = ref(initialTheme());
const accent = ref(initialAccent());
let explicitTheme = readRaw('theme') === 'light' || readRaw('theme') === 'dark';

function applyTheme(value) {
  const root = document.documentElement;
  root.dataset.theme = value;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_COLORS[value]));
}

if (typeof document !== 'undefined') {
  applyTheme(theme.value);
  document.documentElement.dataset.accent = accent.value;
  writeRaw('accent', accent.value); // migre une ancienne valeur hexadécimale

  watch(theme, (value) => {
    applyTheme(value);
    if (explicitTheme) writeRaw('theme', value);
  });
  watch(accent, (value) => {
    document.documentElement.dataset.accent = value;
    writeRaw('accent', value);
  });
  // Tant que l'utilisateur n'a rien choisi, on suit le réglage du système.
  media?.addEventListener('change', (e) => {
    if (!explicitTheme) theme.value = e.matches ? 'dark' : 'light';
  });
}

export function useTheme() {
  function setTheme(value) {
    explicitTheme = true;
    theme.value = value;
  }
  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  }
  function setAccent(value) {
    if (ACCENTS.some((a) => a.id === value)) accent.value = value;
  }
  return { theme, accent, toggle, setTheme, setAccent, ACCENTS };
}
