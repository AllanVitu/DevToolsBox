// Parseur Markdown volontairement restreint, exécuté au build (jamais dans le navigateur).
// Il couvre exactement ce que les leçons utilisent : titres ##/###, paragraphes, listes,
// blocs de code, encadrés « > [!info] », tableaux, et en ligne : **gras**, *italique*,
// ~~barré~~, `code`, [[Touche]] et [liens](/outil-interne ou https://…).

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

function emphasis(html) {
  return html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>');
}

/** Rend une ligne de Markdown en HTML sûr : tout le texte source est échappé. */
export function renderInline(source) {
  const slots = [];
  const keep = (html) => `\u0000${slots.push(html) - 1}\u0000`;
  let s = String(source);

  s = s.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${escapeHtml(code)}</code>`));
  s = s.replace(/\[\[([^\]]+)\]\]/g, (_, key) => keep(`<kbd>${escapeHtml(key)}</kbd>`));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    const label = emphasis(escapeHtml(text));
    if (url.startsWith('/')) {
      // Lien interne : href en hash pour fonctionner sans JS, data-route pour le routeur.
      return keep(`<a href="#${escapeHtml(url)}" data-route="${escapeHtml(url)}">${label}</a>`);
    }
    if (/^https?:\/\//i.test(url)) {
      return keep(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    }
    return keep(label);
  });

  s = emphasis(escapeHtml(s));
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
}

export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const LIST_ITEM = /^\s*[-*]\s+/;
const ORDERED_ITEM = /^\s*\d+\.\s+/;

function splitRow(row) {
  return row
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, '|'));
}

/** Découpe le corps d'une leçon en blocs (Markdown brut, pas encore rendu). */
export function parseBlocks(body, file = 'leçon') {
  const lines = body.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'text', md: paragraph.join(' ') });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fence = line.match(/^```\s*([\w+#.-]*)\s*(.*)$/);
    if (fence) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
      if (i >= lines.length) throw new Error(`${file} : bloc de code non fermé`);
      const lang = fence[1] || 'text';
      blocks.push({ type: 'code', lang, label: fence[2].trim() || lang, code: code.join('\n') });
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flush();
      blocks.push({ type: heading[1].length === 2 ? 'heading' : 'subheading', md: heading[2].trim() });
      continue;
    }

    const callout = line.match(/^>\s*\[!(info|tip|warn|danger)\]\s*(.*)$/);
    if (callout) {
      flush();
      const parts = callout[2] ? [callout[2]] : [];
      while (i + 1 < lines.length && /^>/.test(lines[i + 1])) parts.push(lines[++i].replace(/^>\s?/, ''));
      blocks.push({ type: 'callout', variant: callout[1], md: parts.join(' ').trim() });
      continue;
    }

    if (LIST_ITEM.test(line) || ORDERED_ITEM.test(line)) {
      flush();
      const ordered = ORDERED_ITEM.test(line);
      const marker = ordered ? ORDERED_ITEM : LIST_ITEM;
      const items = [];
      while (i < lines.length && marker.test(lines[i])) {
        let item = lines[i].replace(marker, '');
        while (
          i + 1 < lines.length &&
          /^\s{2,}\S/.test(lines[i + 1]) &&
          !LIST_ITEM.test(lines[i + 1]) &&
          !ORDERED_ITEM.test(lines[i + 1])
        ) {
          item += ' ' + lines[++i].trim();
        }
        items.push(item);
        i++;
      }
      i--;
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    if (/^\|/.test(line)) {
      flush();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      i--;
      if (rows.length < 2 || !/^\|?\s*:?-{2,}/.test(rows[1])) throw new Error(`${file} : tableau sans ligne de séparation`);
      blocks.push({ type: 'table', head: splitRow(rows[0]), rows: rows.slice(2).map(splitRow) });
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

/** Sépare le front matter YAML (entre deux lignes ---) du corps. */
export function splitFrontMatter(source, file = 'fichier') {
  const match = source.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file} : front matter --- manquant`);
  return { front: match[1], body: match[2] };
}
