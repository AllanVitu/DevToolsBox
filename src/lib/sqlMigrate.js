import { findTables, parseColumns } from './sqlSchema';

// Génère les ALTER TABLE (syntaxe PostgreSQL) pour passer d'un schéma à un autre.
export function migrate(beforeSql, afterSql) {
  const [before] = findTables(beforeSql || '');
  const [after] = findTables(afterSql || '');
  if (!before) return { error: 'Schéma actuel : aucun CREATE TABLE détecté.' };
  if (!after) return { error: 'Schéma cible : aucun CREATE TABLE détecté.' };

  const table = after.name;
  const oldCols = new Map(parseColumns(before.body).columns.map((c) => [c.name.toLowerCase(), c]));
  const newCols = new Map(parseColumns(after.body).columns.map((c) => [c.name.toLowerCase(), c]));
  const statements = [];

  if (before.name !== after.name) statements.push(`ALTER TABLE ${before.name} RENAME TO ${after.name};`);

  for (const [key, col] of newCols) {
    if (oldCols.has(key)) continue;
    let def = `${col.name} ${col.type.toUpperCase()}`;
    if (col.default) def += ` DEFAULT ${col.default}`;
    if (col.notNull && !col.pk) def += ' NOT NULL';
    statements.push(`ALTER TABLE ${table} ADD COLUMN ${def};`);
    if (col.notNull && !col.default && !col.pk) {
      statements.push(`-- ⚠ ${col.name} est NOT NULL sans DEFAULT : l’ajout échouera si la table contient déjà des lignes.`);
    }
  }
  for (const [key, col] of oldCols) {
    if (!newCols.has(key)) statements.push(`ALTER TABLE ${table} DROP COLUMN ${col.name};`);
  }
  for (const [key, col] of newCols) {
    const old = oldCols.get(key);
    if (!old) continue;
    if (old.type.toLowerCase() !== col.type.toLowerCase()) {
      statements.push(`ALTER TABLE ${table} ALTER COLUMN ${col.name} TYPE ${col.type.toUpperCase()} USING ${col.name}::${col.type.toUpperCase()};`);
    }
    if (old.notNull !== col.notNull && !col.pk) {
      statements.push(`ALTER TABLE ${table} ALTER COLUMN ${col.name} ${col.notNull ? 'SET' : 'DROP'} NOT NULL;`);
    }
    if ((old.default || null) !== (col.default || null)) {
      statements.push(
        col.default ? `ALTER TABLE ${table} ALTER COLUMN ${col.name} SET DEFAULT ${col.default};` : `ALTER TABLE ${table} ALTER COLUMN ${col.name} DROP DEFAULT;`,
      );
    }
  }
  return { table, statements };
}
