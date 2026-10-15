import { ref } from 'vue';
import { readJSON, writeJSON } from '@/lib/storage';

const MAX_RECENTS = 8;

const favorites = ref((readJSON('favorites', []) || []).filter((id) => typeof id === 'string'));

// Anciennes versions : simples ids d'outils ; aujourd'hui { type, id }.
function normalizeRecents(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => (typeof item === 'string' ? { type: 'tool', id: item } : item))
    .filter((item) => item && item.id && item.type);
}
const recents = ref(normalizeRecents(readJSON('recents', [])));

export function isFavorite(id) {
  return favorites.value.includes(id);
}

export function toggleFavorite(id) {
  favorites.value = isFavorite(id) ? favorites.value.filter((f) => f !== id) : [...favorites.value, id];
  writeJSON('favorites', favorites.value);
}

export function reorderFavorites(ids) {
  favorites.value = ids.filter((id) => favorites.value.includes(id));
  writeJSON('favorites', favorites.value);
}

export function addRecent(type, id) {
  recents.value = [{ type, id }, ...recents.value.filter((r) => !(r.type === type && r.id === id))].slice(0, MAX_RECENTS);
  writeJSON('recents', recents.value);
}

export function useFavorites() {
  return { favorites, recents, isFavorite, toggleFavorite, reorderFavorites, addRecent };
}
