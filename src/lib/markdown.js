// Rendu Markdown côté navigateur (outil « Aperçu Markdown » et réponses de l'IA).
//
// Sécurité : tout le texte source est échappé avant d'insérer nos propres balises,
// et les liens n'acceptent que http(s), mailto, les ancres et les chemins relatifs —
// jamais javascript:, data: ou vbscript:. Le résultat peut donc passer par v-html.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

export function safeUrl(url) {
  const value = String(url).trim();
  if (/^(https?:|mailto:)/i.test(value)) return value;
  if (/^[#/?.]/.test(value) || !/^[a-z][a-z0-9+.-]*:/i.test(value)) return value; // ancre ou relatif
  return null;
}

function inline(source) {
  const slots = [];
  const keep = (html) => `\u0000${slots.push(html) - 1}\u0000`;
  let s = String(source);
  s = s.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${escapeHtml(code)}</code>`));
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => {
    const href = safeUrl(url);
    return href && /^https?:/i.test(href)
      ? keep(`<img src="${escapeHtml(href)}" alt="${escapeHtml(alt)}" loading="lazy">`)
      : keep(escapeHtml(alt));
  });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    const href = safeUrl(url);
    if (!href) return keep(escapeHtml(text));
    const external = /^https?:/i.test(href);
    return keep(
      `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(text)}</a>`,
    );
  });
  s = s.replace(/https?:\/\/[^\s<>"')\]]+/g, (url) => keep(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`));
  s = escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_(?!\s)(.+?)(?<!\s)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
}

const BULLET = /^(\s*)[-*+]\s+(.*)$/;
const NUMBER = /^(\s*)\d+[.)]\s+(.*)$/;

function cells(row) {
  return row
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map((c) => inline(c.trim().replace(/\\\|/g, '|')));
}

/** Markdown → HTML sûr. Les blocs de code clôturés sont gérés ici aussi. */
export function renderMarkdown(source) {
  const lines = String(source ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) out.push(`<p>${paragraph.map(inline).join('<br>')}</p>`);
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fence = line.match(/^\s*(```|~~~)\s*([\w+#.-]*)/);
    if (fence) {
      flush();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++]);
      const lang = fence[2] ? ` data-lang="${escapeHtml(fence[2])}"` : '';
      out.push(`<pre${lang}><code>${escapeHtml(body.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      flush();
      out.push('<hr>');
      continue;
    }

    if (/^\s*>/.test(line)) {
      flush();
      const quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ''));
      i--;
      out.push(`<blockquote>${renderMarkdown(quote.join('\n'))}</blockquote>`);
      continue;
    }

    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      flush();
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      i--;
      out.push(
        `<div class="md-table"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div>`,
      );
      continue;
    }

    if (BULLET.test(line) || NUMBER.test(line)) {
      flush();
      const ordered = NUMBER.test(line) && !BULLET.test(line);
      const pattern = ordered ? NUMBER : BULLET;
      const items = [];
      while (i < lines.length && (pattern.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const m = lines[i].match(pattern);
        if (m) items.push(m[2]);
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      i--;
      const tag = ordered ? 'ol' : 'ul';
      const html = items
        .map((item) => {
          const task = item.match(/^\[([ xX])\]\s+(.*)$/);
          if (task) {
            const checked = task[1] !== ' ' ? ' checked' : '';
            return `<li class="task"><input type="checkbox" disabled${checked}> ${inline(task[2])}</li>`;
          }
          return `<li>${inline(item)}</li>`;
        })
        .join('');
      out.push(`<${tag}>${html}</${tag}>`);
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return out.join('\n');
}

/**
 * Découpe un texte (éventuellement en cours de streaming) en segments Markdown et en
 * blocs de code, pour afficher ces derniers avec un vrai bouton « Copier ».
 */
export function splitFences(source) {
  const segments = [];
  const lines = String(source ?? '').replace(/\r\n?/g, '\n').split('\n');
  let text = [];
  for (let i = 0; i < lines.length; i++) {
    const fence = lines[i].match(/^\s*(```|~~~)\s*([\w+#.-]*)/);
    if (!fence) {
      text.push(lines[i]);
      continue;
    }
    if (text.length) segments.push({ type: 'md', text: text.join('\n') });
    text = [];
    const code = [];
    i++;
    while (i < lines.length && !lines[i].trim().startsWith(fence[1])) code.push(lines[i++]);
    segments.push({ type: 'code', lang: fence[2] || '', code: code.join('\n'), open: i >= lines.length });
  }
  if (text.length) segments.push({ type: 'md', text: text.join('\n') });
  return segments;
}
