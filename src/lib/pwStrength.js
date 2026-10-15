// Estimation de solidité d'un mot de passe, sans rien envoyer.
// L'entropie « théorique » (longueur × log2 de l'alphabet) surestime les mots de passe
// prévisibles : on applique donc des pénalités pour les schémas connus.

const COMMON = new Set(
  (
    'password motdepasse azerty azertyuiop qwerty 123456 1234567 12345678 123456789 1234567890 111111 000000 abc123 iloveyou ' +
    'admin welcome bonjour soleil doudou chouchou loulou marseille football princesse dragon master monkey letmein sunshine ' +
    'qwertyuiop passw0rd motdepasse1 password1 test toto azerty123 nicolas julien camille'
  ).split(' '),
);
const KEYBOARD_ROWS = ['azertyuiop', 'qsdfghjklm', 'wxcvbn', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

export function charsetSize(pw) {
  let n = 0;
  if (/[a-z]/.test(pw)) n += 26;
  if (/[A-Z]/.test(pw)) n += 26;
  if (/[0-9]/.test(pw)) n += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33;
  return n;
}

function hasSequence(pw, length = 4) {
  const lower = pw.toLowerCase();
  for (let i = 0; i + length <= lower.length; i++) {
    const chunk = lower.slice(i, i + length);
    let up = true;
    let down = true;
    for (let k = 1; k < chunk.length; k++) {
      if (chunk.charCodeAt(k) !== chunk.charCodeAt(k - 1) + 1) up = false;
      if (chunk.charCodeAt(k) !== chunk.charCodeAt(k - 1) - 1) down = false;
    }
    if (up || down) return true;
    if (KEYBOARD_ROWS.some((row) => row.includes(chunk))) return true;
  }
  return false;
}

export function analyzePassword(pw) {
  const length = [...pw].length;
  const pool = charsetSize(pw);
  let bits = pool > 1 ? length * Math.log2(pool) : 0;
  const warnings = [];
  const base = pw.toLowerCase().replace(/[^a-z]/g, '');

  if (COMMON.has(pw.toLowerCase()) || COMMON.has(base)) {
    bits = Math.min(bits, 10);
    warnings.push('Mot de passe très courant : il figure dans toutes les listes testées par les attaquants.');
  }
  if (/(.)\1{2,}/.test(pw)) {
    bits *= 0.75;
    warnings.push('Caractère répété plusieurs fois d’affilée.');
  }
  if (hasSequence(pw)) {
    bits *= 0.75;
    warnings.push('Suite prévisible (abcd, 1234, azerty…).');
  }
  if (/^[A-Z][a-z]+\d{1,4}[!?.]?$/.test(pw)) {
    bits *= 0.6;
    warnings.push('Schéma « Mot + chiffres » : le premier essayé par les outils de cassage.');
  }
  if (/(19|20)\d{2}/.test(pw)) warnings.push('Contient une année : facile à deviner si elle est liée à toi.');
  if (length < 12) warnings.push('Moins de 12 caractères : la longueur est le levier le plus efficace.');

  bits = Math.round(bits);
  let label;
  let level;
  if (bits < 28) [label, level] = ['Très faible', 0];
  else if (bits < 36) [label, level] = ['Faible', 1];
  else if (bits < 60) [label, level] = ['Correct', 2];
  else if (bits < 100) [label, level] = ['Fort', 3];
  else [label, level] = ['Très fort', 4];
  return { bits, length, pool, label, level, warnings };
}
