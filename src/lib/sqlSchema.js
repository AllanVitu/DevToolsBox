// Analyse de CREATE TABLE : colonnes, clés, contraintes, et conseils PostgreSQL.

const KNOWN_TYPES = new Set(
  (
    'int integer int2 int4 int8 bigint smallint tinyint mediumint serial bigserial smallserial varchar char character text citext ' +
    'boolean bool date datetime timestamp timestamptz time timetz interval numeric decimal real double float float4 float8 money ' +
    'json jsonb uuid blob bytea enum inet cidr macaddr xml tsvector point'
  ).split(' '),
);

// Types SQL en plusieurs mots (sinon « TIMESTAMP WITH TIME ZONE » serait lu « TIMESTAMP »).
const MULTI_WORD_TYPE =
  /^(?:timestamp|time)(?:\s*\(\d+\))?\s+with(?:out)?\s+time\s+zone|^double\s+precision|^character\s+varying(?:\s*\(\d+\))?|^bit\s+varying(?:\s*\(\d+\))?/i;

/** Découpe sur les virgules de premier niveau (hors parenthèses et chaînes). */
export function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = '';
  for (const c of body) {
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === "'" || c === '"') quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    if (c === ',' && depth === 0 && !quote) {
      parts.push(current);
      current = '';
    } else current += c;
  }
  if (current.trim()) parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}

const stripComments = (sql) => sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

/** Toutes les tables d'un script : { name, body }. */
export function findTables(sql) {
  const tables = [];
  const clean = stripComments(sql);
  const re = /create\s+table\s+(?:if\s+not\s+exists\s+)?([\w."`]+)\s*\(/gi;
  let m;
  while ((m = re.exec(clean)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < clean.length && depth > 0; i++) {
      if (clean[i] === '(') depth++;
      else if (clean[i] === ')') depth--;
    }
    const name = m[1].replace(/["`]/g, '').split('.').pop();
    tables.push({ name, body: clean.slice(re.lastIndex, i - 1) });
    re.lastIndex = i;
  }
  return tables;
}

export function parseColumns(body) {
  const columns = [];
  const constraints = [];
  for (const part of splitTopLevel(body)) {
    if (/^(constraint|primary\s+key|foreign\s+key|unique|check|key|index|exclude)\b/i.test(part)) {
      constraints.push(part);
      continue;
    }
    const m = part.match(/^["`]?(\w+)["`]?\s+([\s\S]*)$/);
    if (!m) continue;
    const after = m[2];
    const typeMatch = after.match(MULTI_WORD_TYPE) || after.match(/^[a-zA-Z_]\w*(?:\s*\([^)]*\))?(?:\[\])?/);
    if (!typeMatch) continue;
    const typeWords = typeMatch[0];
    const rest = after.slice(typeWords.length);
    const ref = part.match(/references\s+["`]?(\w+)["`]?(?:\s*\(\s*["`]?(\w+)["`]?\s*\))?/i);
    columns.push({
      name: m[1],
      type: typeWords.replace(/\s+/g, ' ').trim(),
      pk: /primary\s+key/i.test(rest),
      notNull: /not\s+null/i.test(rest) || /primary\s+key/i.test(rest),
      unique: /\bunique\b/i.test(rest),
      identity: /generated\s+(always|by\s+default)\s+as\s+identity/i.test(rest),
      default: (rest.match(/default\s+([^\s,]+(?:\([^)]*\))?)/i) || [])[1] || null,
      fk: ref ? { table: ref[1], column: ref[2] || null } : null,
    });
  }
  return { columns, constraints };
}

/** Analyse le premier CREATE TABLE trouvé et renvoie colonnes + remarques. */
export function analyzeSchema(sql) {
  const [table] = findTables(sql || '');
  if (!table) return { error: 'Aucun CREATE TABLE détecté.' };
  const { columns, constraints } = parseColumns(table.body);
  const issues = [];
  const seen = new Set();
  let hasPk = columns.some((c) => c.pk) || constraints.some((c) => /primary\s+key/i.test(c));

  for (const col of columns) {
    const base = col.type.toLowerCase().replace(/\(.*\)/, '').replace(/\[\]$/, '').trim();
    const first = base.split(' ')[0];
    if (!KNOWN_TYPES.has(first) && !KNOWN_TYPES.has(base)) issues.push({ level: 'warn', message: `Type inconnu « ${col.type} » (colonne « ${col.name} »).` });
    if (seen.has(col.name.toLowerCase())) issues.push({ level: 'error', message: `Colonne en double : « ${col.name} ».` });
    seen.add(col.name.toLowerCase());

    // Conseils PostgreSQL (non bloquants).
    if (/^(big|small)?serial$/.test(first)) {
      issues.push({ level: 'tip', message: `« ${col.name} » : en PostgreSQL 10+, préfère « GENERATED ALWAYS AS IDENTITY » à ${col.type.toUpperCase()} (norme SQL, droits plus simples).` });
    }
    if (first === 'timestamp' && !/with\s+time\s+zone/i.test(col.type)) {
      issues.push({ level: 'tip', message: `« ${col.name} » : TIMESTAMP n’a pas de fuseau ; TIMESTAMPTZ stocke un instant non ambigu.` });
    }
    if ((first === 'float' || first === 'real' || first === 'double' || first === 'money') && /prix|price|montant|amount|total|solde|balance/i.test(col.name)) {
      issues.push({ level: 'tip', message: `« ${col.name} » : pour de l’argent, utilise NUMERIC(12,2) — les flottants arrondissent (0,1 + 0,2 ≠ 0,3).` });
    }
    if ((first === 'varchar' || first === 'character') && !/\(\d+\)/.test(col.type) && /varchar|varying/i.test(col.type)) {
      issues.push({ level: 'tip', message: `« ${col.name} » : VARCHAR sans longueur équivaut à TEXT en PostgreSQL.` });
    }
    if (col.fk && !col.notNull) {
      issues.push({ level: 'tip', message: `« ${col.name} » référence « ${col.fk.table} » mais accepte NULL : est-ce voulu ?` });
    }
  }

  if (!columns.length) issues.push({ level: 'error', message: 'Aucune colonne détectée.' });
  if (!hasPk) issues.push({ level: 'warn', message: 'Aucune clé primaire (PRIMARY KEY).' });

  return { table: table.name, columns, constraints, issues, valid: !issues.some((i) => i.level === 'error') };
}
