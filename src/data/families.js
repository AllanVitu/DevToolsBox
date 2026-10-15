// Familles d'outils : une seule taxonomie, utilisée partout (catalogue, palette,
// tableau de bord). Chaque famille a sa couleur d'accent, comme les projets du portfolio.
export const FAMILIES = [
  { id: 'data', name: 'Données & SQL', icon: 'database', accent: 'indigo', desc: 'JSON, CSV, YAML, XML, SQL, schémas et migrations.' },
  { id: 'encoding', name: 'Encodage', icon: 'binary', accent: 'sky', desc: 'Base64, URL, entités HTML, JWT, hexadécimal, QR code.' },
  { id: 'crypto', name: 'Sécurité', icon: 'shield-check', accent: 'rose', desc: 'Empreintes, mots de passe, identifiants, 2FA, CSP.' },
  { id: 'time', name: 'Temps', icon: 'clock', accent: 'amber', desc: 'Timestamps Unix et expressions cron.' },
  { id: 'numbers', name: 'Nombres', icon: 'calculator', accent: 'violet', desc: 'Bases numériques et conversions d’unités.' },
  { id: 'design', name: 'Design & CSS', icon: 'palette', accent: 'emerald', desc: 'Couleurs, palettes, contraste, dégradés, ombres, rem.' },
  { id: 'text', name: 'Texte', icon: 'type', accent: 'orange', desc: 'Casse, Markdown, regex, diff, Unicode, listes.' },
  { id: 'sysnet', name: 'Système & DevOps', icon: 'server', accent: 'teal', desc: 'Permissions, réseau, Docker Compose, Nginx.' },
  { id: 'reference', name: 'Référence', icon: 'book-marked', accent: 'slate', desc: 'Codes HTTP, types MIME, ports, table ASCII.' },
  { id: 'minecraft', name: 'Minecraft', icon: 'pickaxe', accent: 'lime', desc: 'MOTD de serveur, coordonnées, chunks et régions.' },
];

export function getFamily(id) {
  return FAMILIES.find((f) => f.id === id) || null;
}
