// Accès au localStorage, toujours sous le préfixe « devtoolbox: ».
// Toutes les lectures/écritures sont protégées : navigation privée, quota plein ou
// stockage bloqué ne doivent jamais casser l'application.

export const PREFIX = 'devtoolbox:';

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readRaw(key) {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeRaw(key, value) {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* stockage indisponible : la valeur reste en mémoire pour la session */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignoré */
  }
}

/** Toutes les clés DevToolbox présentes (avec le préfixe). */
export function allKeys() {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
  } catch {
    /* ignoré */
  }
  return keys;
}

/** Supprime les saisies d'un outil (clés « devtoolbox:<id>:… » et « devtoolbox:<id> »). */
export function clearToolKeys(toolId) {
  if (!toolId) return 0;
  const exact = PREFIX + toolId;
  const keys = allKeys().filter((k) => k === exact || k.startsWith(exact + ':'));
  try {
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    return 0;
  }
  return keys.length;
}
