import { ref } from 'vue';
import { readJSON, writeJSON } from '@/lib/storage';

const snippets = ref(readJSON('snippets', []) || []);

function save() {
  writeJSON('snippets', snippets.value);
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `snip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useSnippets() {
  function add({ title, lang = 'text', content }) {
    const snippet = { id: newId(), title: title.trim(), lang, content, createdAt: Date.now() };
    snippets.value = [snippet, ...snippets.value];
    save();
    return snippet;
  }
  function update(id, patch) {
    snippets.value = snippets.value.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s));
    save();
  }
  function remove(id) {
    snippets.value = snippets.value.filter((s) => s.id !== id);
    save();
  }
  return { snippets, add, update, remove };
}
