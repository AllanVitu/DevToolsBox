// Construit une requête SELECT à partir de champs saisis.
export function buildSelect({ table, columns = [], distinct = false, joins = [], wheres = [], groupBy = '', orderBy = '', limit = '' } = {}) {
  if (!table || !table.trim()) return '';
  const cols = columns.map((c) => c.trim()).filter(Boolean);
  let sql = `SELECT ${distinct ? 'DISTINCT ' : ''}${cols.length ? cols.join(', ') : '*'}\nFROM ${table.trim()}`;
  for (const j of joins) {
    if (j && j.table && j.on) sql += `\n${(j.type || 'JOIN').toUpperCase()} ${j.table.trim()} ON ${j.on.trim()}`;
  }
  const conds = wheres.map((w) => w.trim()).filter(Boolean);
  if (conds.length) sql += `\nWHERE ${conds.join('\n  AND ')}`;
  if (groupBy && groupBy.trim()) sql += `\nGROUP BY ${groupBy.trim()}`;
  if (orderBy && orderBy.trim()) sql += `\nORDER BY ${orderBy.trim()}`;
  if (limit !== '' && limit != null && String(limit).trim()) sql += `\nLIMIT ${String(limit).trim()}`;
  return sql + ';';
}
