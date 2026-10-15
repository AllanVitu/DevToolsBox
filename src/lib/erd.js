import { escapeHtml } from './markdown';
import { findTables, parseColumns } from './sqlSchema';

// Diagramme entité-relation en SVG, généré depuis des CREATE TABLE.

export function parseErd(sql) {
  const tables = [];
  const relations = [];
  for (const t of findTables(sql || '')) {
    const { columns, constraints } = parseColumns(t.body);
    for (const c of columns) if (c.fk) relations.push({ from: t.name, fromCol: c.name, to: c.fk.table });
    for (const c of constraints) {
      const fk = c.match(/foreign\s+key\s*\(\s*["`]?(\w+)["`]?\s*\)\s*references\s+["`]?(\w+)["`]?/i);
      if (fk) {
        relations.push({ from: t.name, fromCol: fk[1], to: fk[2] });
        const col = columns.find((x) => x.name === fk[1]);
        if (col) col.fk = { table: fk[2] };
      }
      const pk = c.match(/primary\s+key\s*\(([^)]*)\)/i);
      if (pk) pk[1].split(',').map((s) => s.trim().replace(/["`]/g, '')).forEach((name) => {
        const col = columns.find((x) => x.name === name);
        if (col) col.pk = true;
      });
    }
    tables.push({ name: t.name, columns });
  }
  return { tables, relations };
}

const PALETTES = {
  light: { bg: '#ffffff', card: '#ffffff', stroke: '#d9dae0', head: '#5b5bf0', headText: '#ffffff', text: '#111216', muted: '#5a5f6e', line: '#8b8fa0' },
  dark: { bg: '#16171c', card: '#1c1d23', stroke: '#2e3039', head: '#5b5bf0', headText: '#ffffff', text: '#f1f2f5', muted: '#a2a6b3', line: '#6b7080' },
};

export function renderErd({ tables, relations }, { theme = 'light', columnsPerRow = 3 } = {}) {
  if (!tables.length) return '';
  const p = PALETTES[theme] || PALETTES.light;
  const W = 220;
  const HEAD = 34;
  const ROW = 22;
  const GAP_X = 70;
  const GAP_Y = 60;
  const PAD = 24;
  const height = (t) => HEAD + Math.max(1, t.columns.length) * ROW + 10;

  const rowHeights = [];
  tables.forEach((t, i) => {
    const r = Math.floor(i / columnsPerRow);
    rowHeights[r] = Math.max(rowHeights[r] || 0, height(t));
  });
  const rowY = [];
  let y = PAD;
  rowHeights.forEach((h, r) => {
    rowY[r] = y;
    y += h + GAP_Y;
  });
  const box = {};
  tables.forEach((t, i) => {
    box[t.name] = { x: PAD + (i % columnsPerRow) * (W + GAP_X), y: rowY[Math.floor(i / columnsPerRow)], w: W, h: height(t) };
  });
  const cols = Math.min(columnsPerRow, tables.length);
  const totalW = PAD * 2 + cols * W + (cols - 1) * GAP_X;
  const totalH = y - GAP_Y + PAD;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="12">`;
  svg += `<rect width="${totalW}" height="${totalH}" fill="${p.bg}"/>`;
  for (const rel of relations) {
    const a = box[rel.from];
    const b = box[rel.to];
    if (!a || !b) continue;
    const x1 = a.x + a.w / 2;
    const y1 = a.y + a.h / 2;
    const x2 = b.x + b.w / 2;
    const y2 = b.y + b.h / 2;
    svg += `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="${p.line}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  }
  for (const t of tables) {
    const b = box[t.name];
    svg += `<g><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${p.card}" stroke="${p.stroke}"/>`;
    svg += `<path d="M${b.x} ${b.y + HEAD} V${b.y + 12} a12 12 0 0 1 12 -12 H${b.x + b.w - 12} a12 12 0 0 1 12 12 V${b.y + HEAD} Z" fill="${p.head}"/>`;
    svg += `<text x="${b.x + 14}" y="${b.y + 22}" fill="${p.headText}" font-weight="700">${escapeHtml(t.name)}</text>`;
    t.columns.forEach((c, i) => {
      const ty = b.y + HEAD + 16 + i * ROW;
      const mark = c.pk ? 'PK ' : c.fk ? 'FK ' : '';
      svg += `<text x="${b.x + 14}" y="${ty}" fill="${c.pk ? p.head : p.text}"${c.pk ? ' font-weight="700"' : ''}>${escapeHtml(mark + c.name)}</text>`;
      svg += `<text x="${b.x + b.w - 14}" y="${ty}" fill="${p.muted}" text-anchor="end">${escapeHtml(c.type.toLowerCase())}</text>`;
    });
    svg += '</g>';
  }
  return svg + '</svg>';
}
