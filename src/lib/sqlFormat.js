// Mise en forme SQL légère. Le texte est d'abord découpé en jetons : les chaînes,
// identifiants entre guillemets et commentaires ne sont jamais modifiés (l'ancienne
// version passait aussi en majuscules les mots-clés situés dans les chaînes).

const KEYWORDS = new Set(
  (
    'select from where and or not in is null as on join left right inner outer full cross group by order having limit offset union all ' +
    'insert into values update set delete create table alter add drop column primary key foreign references unique default check ' +
    'distinct count sum avg min max case when then else end asc desc like ilike between exists returning with recursive conflict do ' +
    'nothing index view if true false cascade constraint using natural window over partition interval cast coalesce filter'
  ).split(' '),
);
const FUNCTIONS = new Set(['count', 'sum', 'avg', 'min', 'max', 'cast', 'coalesce', 'filter', 'over']);

const CLAUSES = ['with', 'select', 'from', 'where', 'group by', 'order by', 'having', 'limit', 'offset', 'union all', 'union', 'values', 'set', 'returning', 'on conflict'];
const JOINS = ['left outer join', 'right outer join', 'full outer join', 'left join', 'right join', 'inner join', 'full join', 'cross join', 'join'];

export function tokenizeSql(sql) {
  const tokens = [];
  const re = /\s+|--[^\n]*|\/\*[\s\S]*?\*\/|'(?:[^']|'')*'|"(?:[^"]|"")*"|`[^`]*`|\$\$[\s\S]*?\$\$|[A-Za-z_][\w$]*|\d+(?:\.\d+)?|::|<>|<=|>=|!=|\|\||[(),;.*=<>+\-/%]|./gs;
  for (const m of sql.matchAll(re)) {
    const value = m[0];
    let type = 'other';
    if (/^\s+$/.test(value)) type = 'space';
    else if (value.startsWith('--') || value.startsWith('/*')) type = 'comment';
    else if (/^['"`$]/.test(value)) type = 'quoted';
    else if (/^[A-Za-z_]/.test(value)) type = KEYWORDS.has(value.toLowerCase()) ? 'keyword' : 'word';
    tokens.push({ type, value });
  }
  return tokens;
}

export function formatSql(sql, { uppercase = true } = {}) {
  const tokens = tokenizeSql(sql).filter((t) => t.type !== 'space');
  if (!tokens.length) return '';
  const lines = [];
  let current = null;
  let depth = 0;
  let pendingBetween = false;
  const word = (t) => (t.type === 'keyword' && uppercase ? t.value.toUpperCase() : t.value);
  const phraseAt = (i, list) =>
    list.find((p) => {
      const parts = p.split(' ');
      return parts.every((part, k) => tokens[i + k] && tokens[i + k].type === 'keyword' && tokens[i + k].value.toLowerCase() === part);
    });

  const flush = () => {
    if (current && current.text.trim()) lines.push('  '.repeat(current.depth) + current.text.trim());
    current = null;
  };
  const startLine = (text, extra = 0) => {
    flush();
    current = { depth: depth + extra, text };
  };
  const append = (value, glue = false) => {
    if (!current) current = { depth, text: '' };
    const space = current.text && !glue && !/[(]$/.test(current.text) && !/(\.|::)$/.test(current.text);
    current.text += (space ? ' ' : '') + value;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const lower = t.value.toLowerCase();

    if (t.type === 'keyword') {
      const phrase = phraseAt(i, JOINS) || phraseAt(i, CLAUSES);
      if (phrase) {
        const n = phrase.split(' ').length;
        startLine(tokens.slice(i, i + n).map(word).join(' '));
        i += n - 1;
        continue;
      }
      if (lower === 'between') pendingBetween = true;
      if (lower === 'and' || lower === 'or') {
        if (lower === 'and' && pendingBetween) {
          pendingBetween = false;
          append(word(t));
        } else startLine(word(t), 1);
        continue;
      }
    }

    if (t.type === 'comment') {
      flush();
      lines.push('  '.repeat(depth) + t.value.trim());
      continue;
    }

    switch (t.value) {
      case '(': {
        const prev = tokens[i - 1];
        const isCall = prev && (prev.type === 'word' || (prev.type === 'keyword' && FUNCTIONS.has(prev.value.toLowerCase())));
        append('(', isCall);
        depth++;
        break;
      }
      case ')':
        depth = Math.max(0, depth - 1);
        append(')', true);
        break;
      case ',':
        append(',', true);
        break;
      case ';':
        append(';', true);
        flush();
        lines.push('');
        break;
      case '.':
      case '::':
        append(t.value, true);
        break;
      default:
        append(word(t), /(\.|::)$/.test(current?.text ?? ''));
    }
  }
  flush();
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
