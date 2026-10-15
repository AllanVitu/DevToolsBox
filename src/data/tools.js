// Registre des outils. Chaque outil est un composant chargé à la demande : seul celui
// qu'on ouvre est téléchargé. `emits` / `accepts` décrivent le type de donnée qu'un
// outil produit ou sait lire, pour le bouton « Envoyer vers… ». `added` marque les
// nouveautés de la version 3.
const t = (loader) => loader;

export const TOOLS = [
  // ── Données & SQL ────────────────────────────────────────────────────────────
  { id: 'json', name: 'JSON Formatter', icon: 'braces', family: 'data', desc: 'Formater, minifier et valider du JSON.', keywords: ['json', 'format', 'beautify', 'minify', 'valider', 'indenter'], emits: 'json', accepts: ['json'], component: t(() => import('@/tools/JsonFormatter.vue')) },
  { id: 'jsoncsv', name: 'JSON ⇄ CSV', icon: 'table', family: 'data', desc: 'Convertir un tableau d’objets JSON en CSV, et inversement.', keywords: ['csv', 'json', 'tableur', 'excel', 'convertir'], accepts: ['json'], component: t(() => import('@/tools/JsonCsv.vue')) },
  { id: 'jsonyaml', name: 'JSON ⇄ YAML', icon: 'file-code', family: 'data', desc: 'Convertir entre JSON et YAML, avec validation.', keywords: ['yaml', 'yml', 'json', 'config', 'compose', 'convertir'], accepts: ['json', 'yaml'], component: t(() => import('@/tools/JsonYaml.vue')) },
  { id: 'jsonts', name: 'JSON → TypeScript', icon: 'file-type', family: 'data', desc: 'Générer des interfaces TypeScript depuis un exemple JSON.', keywords: ['typescript', 'ts', 'interface', 'type', 'json'], accepts: ['json'], component: t(() => import('@/tools/JsonToTs.vue')) },
  { id: 'mock', name: 'Données factices', icon: 'dices', family: 'data', desc: 'Générer des jeux de données de test réalistes (JSON ou CSV).', keywords: ['mock', 'fake', 'factice', 'test', 'données', 'seed'], component: t(() => import('@/tools/MockData.vue')) },
  { id: 'dotenv', name: '.env ⇄ JSON', icon: 'key-round', family: 'data', desc: 'Convertir un fichier .env en JSON, et inversement.', keywords: ['env', 'dotenv', 'json', 'config', 'variables', 'environnement'], component: t(() => import('@/tools/DotenvJson.vue')) },
  { id: 'xml', name: 'XML Formatter', icon: 'code-xml', family: 'data', desc: 'Indenter, valider et minifier du XML.', keywords: ['xml', 'format', 'indenter', 'minifier', 'valider'], component: t(() => import('@/tools/XmlFormatter.vue')) },
  { id: 'sqlformat', name: 'SQL Formatter', icon: 'align-left', family: 'data', desc: 'Mettre en forme une requête SQL : mots-clés et clauses.', keywords: ['sql', 'format', 'requête', 'indenter', 'base de données'], emits: 'sql', accepts: ['sql'], component: t(() => import('@/tools/SqlFormatter.vue')) },
  { id: 'jsondiff', name: 'JSON Diff', icon: 'git-compare', family: 'data', desc: 'Comparer deux objets JSON et lister les différences.', keywords: ['json', 'diff', 'comparer', 'différence', 'changements'], accepts: ['json'], component: t(() => import('@/tools/JsonDiff.vue')) },
  { id: 'sqlschema', name: 'Schéma SQL', icon: 'table-properties', family: 'data', desc: 'Analyser un CREATE TABLE : clés, types, contraintes.', keywords: ['sql', 'schema', 'create table', 'valider', 'colonnes', 'postgresql'], accepts: ['sql'], component: t(() => import('@/tools/SqlSchema.vue')) },
  { id: 'sqlmigrate', name: 'Migrations SQL', icon: 'git-merge', family: 'data', desc: 'Générer les ALTER TABLE entre deux versions d’un schéma.', keywords: ['sql', 'migration', 'alter table', 'schema', 'diff'], emits: 'sql', component: t(() => import('@/tools/SqlMigrate.vue')) },
  { id: 'erd', name: 'Visualiseur ERD', icon: 'workflow', family: 'data', desc: 'Diagramme entité-relation depuis des CREATE TABLE.', keywords: ['erd', 'diagramme', 'schema', 'relation', 'foreign key', 'sql', 'svg'], accepts: ['sql'], component: t(() => import('@/tools/ErdVisualizer.vue')) },
  { id: 'querybuilder', name: 'Query Builder', icon: 'list-filter', family: 'data', desc: 'Construire une requête SELECT pas à pas.', keywords: ['sql', 'query', 'builder', 'select', 'requête', 'join', 'where'], emits: 'sql', component: t(() => import('@/tools/QueryBuilder.vue')) },

  // ── Encodage ─────────────────────────────────────────────────────────────────
  { id: 'base64', name: 'Base64', icon: 'binary', family: 'encoding', desc: 'Encoder / décoder du Base64 en UTF-8, standard ou URL-safe.', keywords: ['base64', 'encode', 'decode', 'btoa', 'atob', 'url-safe'], component: t(() => import('@/tools/Base64Tool.vue')) },
  { id: 'url', name: 'URL Tools', icon: 'link', family: 'encoding', desc: 'Encoder / décoder et décomposer une URL.', keywords: ['url', 'uri', 'encode', 'decode', 'query', 'params'], emits: 'url', component: t(() => import('@/tools/UrlTool.vue')) },
  { id: 'html', name: 'Entités HTML', icon: 'ampersand', family: 'encoding', desc: 'Échapper / déséchapper des caractères pour le HTML.', keywords: ['html', 'entités', 'escape', 'échapper', 'caractères', 'xss'], component: t(() => import('@/tools/HtmlEntities.vue')) },
  { id: 'jwt', name: 'JWT Decoder', icon: 'id-card', family: 'encoding', desc: 'Décoder un JWT et vérifier une signature HS256.', keywords: ['jwt', 'token', 'bearer', 'auth', 'décoder', 'signature', 'hs256'], component: t(() => import('@/tools/JwtDecoder.vue')) },
  { id: 'qr', name: 'QR code', icon: 'qr-code', family: 'encoding', desc: 'Générer un QR code en PNG ou SVG, sans connexion.', keywords: ['qr', 'qrcode', 'flashcode', 'url', 'png', 'svg'], accepts: ['url', 'text'], component: t(() => import('@/tools/QrCode.vue')) },
  { id: 'image64', name: 'Image → Base64', icon: 'image', family: 'encoding', desc: 'Convertir une image en data URL pour l’embarquer en CSS ou HTML.', keywords: ['image', 'base64', 'data url', 'png', 'embarquer'], component: t(() => import('@/tools/ImageToBase64.vue')) },
  { id: 'hextext', name: 'Hex ⇄ Texte', icon: 'scan-text', family: 'encoding', desc: 'Convertir du texte en hexadécimal (UTF-8) et inversement.', keywords: ['hex', 'hexadécimal', 'texte', 'ascii', 'octets', 'bytes'], component: t(() => import('@/tools/HexText.vue')) },

  // ── Sécurité ─────────────────────────────────────────────────────────────────
  { id: 'hash', name: 'Hash', icon: 'fingerprint', family: 'crypto', desc: 'Empreintes SHA-256 / 384 / 512 (et SHA-1 historique).', keywords: ['hash', 'sha', 'sha256', 'empreinte', 'checksum', 'digest'], component: t(() => import('@/tools/HashTool.vue')) },
  { id: 'uuid', name: 'UUID', icon: 'hash', family: 'crypto', desc: 'Générer des UUID v4 aléatoires, en masse.', keywords: ['uuid', 'guid', 'identifiant', 'random', 'v4'], component: t(() => import('@/tools/UuidGenerator.vue')) },
  { id: 'password', name: 'Mot de passe', icon: 'key-square', family: 'crypto', desc: 'Générer des mots de passe forts, aléatoire cryptographique.', keywords: ['mot de passe', 'password', 'aléatoire', 'sécurité', 'entropie'], component: t(() => import('@/tools/PasswordGenerator.vue')) },
  { id: 'sortableids', name: 'ID triables', icon: 'list-ordered', family: 'crypto', desc: 'Générer des ULID et des UUID v7 horodatés.', keywords: ['ulid', 'uuid', 'uuidv7', 'identifiant', 'triable', 'horodaté'], component: t(() => import('@/tools/SortableIds.vue')) },
  { id: 'pwstrength', name: 'Force de mot de passe', icon: 'gauge', family: 'crypto', desc: 'Estimer la solidité d’un mot de passe, localement.', keywords: ['mot de passe', 'password', 'entropie', 'force', 'sécurité', 'strength'], component: t(() => import('@/tools/PasswordStrength.vue')) },
  { id: 'totp', name: 'Codes 2FA (TOTP)', icon: 'smartphone', family: 'crypto', desc: 'Générer des codes TOTP (RFC 6238) et l’URI otpauth à scanner.', keywords: ['2fa', 'totp', 'otp', 'authenticator', 'double authentification', 'mfa', 'otpauth'], emits: 'url', added: '2026-10', component: t(() => import('@/tools/TotpGenerator.vue')) },
  { id: 'csp', name: 'Politique CSP', icon: 'shield-half', family: 'crypto', desc: 'Composer une Content-Security-Policy et les en-têtes de sécurité.', keywords: ['csp', 'content-security-policy', 'en-têtes', 'headers', 'xss', 'hsts', 'sécurité'], added: '2026-10', component: t(() => import('@/tools/CspBuilder.vue')) },

  // ── Temps ────────────────────────────────────────────────────────────────────
  { id: 'timestamp', name: 'Timestamp', icon: 'calendar-clock', family: 'time', desc: 'Convertir un timestamp Unix en date lisible, et inversement.', keywords: ['timestamp', 'unix', 'epoch', 'date', 'heure', 'iso'], component: t(() => import('@/tools/TimestampConverter.vue')) },
  { id: 'cron', name: 'Cron', icon: 'timer', family: 'time', desc: 'Expliquer une expression cron et lister ses prochaines exécutions.', keywords: ['cron', 'crontab', 'planification', 'schedule', 'tâche'], component: t(() => import('@/tools/CronParser.vue')) },

  // ── Nombres ──────────────────────────────────────────────────────────────────
  { id: 'base', name: 'Bases numériques', icon: 'sigma', family: 'numbers', desc: 'Binaire, octal, décimal, hexa — précision illimitée.', keywords: ['base', 'binaire', 'hexadécimal', 'hex', 'octal', 'décimal', 'bigint'], component: t(() => import('@/tools/BaseConverter.vue')) },
  { id: 'units', name: 'Unités', icon: 'ruler', family: 'numbers', desc: 'Longueur, masse, vitesse, temps, données, température.', keywords: ['unité', 'conversion', 'mètre', 'kilo', 'température', 'octet'], component: t(() => import('@/tools/UnitConverter.vue')) },

  // ── Design & CSS ─────────────────────────────────────────────────────────────
  { id: 'color', name: 'Couleurs', icon: 'pipette', family: 'design', desc: 'Convertir HEX, RGB, HSL et OKLCH avec aperçu.', keywords: ['couleur', 'color', 'hex', 'rgb', 'hsl', 'oklch'], component: t(() => import('@/tools/ColorConverter.vue')) },
  { id: 'palette', name: 'Palette de couleurs', icon: 'swatch-book', family: 'design', desc: 'Générer une échelle de teintes et des harmonies.', keywords: ['palette', 'couleur', 'teintes', 'nuances', 'harmonie', 'design', 'tokens'], component: t(() => import('@/tools/PaletteGenerator.vue')) },
  { id: 'contrast', name: 'Contraste', icon: 'contrast', family: 'design', desc: 'Vérifier le contraste WCAG entre deux couleurs.', keywords: ['contraste', 'wcag', 'accessibilité', 'lisibilité', 'a11y'], component: t(() => import('@/tools/ContrastChecker.vue')) },
  { id: 'gradient', name: 'Dégradés', icon: 'blend', family: 'design', desc: 'Composer un dégradé CSS avec aperçu.', keywords: ['gradient', 'dégradé', 'css', 'linear', 'radial', 'couleur'], component: t(() => import('@/tools/GradientGenerator.vue')) },
  { id: 'boxshadow', name: 'Box-shadow', icon: 'box-select', family: 'design', desc: 'Composer une ombre CSS avec aperçu.', keywords: ['ombre', 'shadow', 'box-shadow', 'css', 'élévation'], component: t(() => import('@/tools/BoxShadow.vue')) },
  { id: 'pxrem', name: 'px ⇄ rem', icon: 'scaling', family: 'design', desc: 'Convertir des pixels en rem et inversement.', keywords: ['px', 'rem', 'em', 'css', 'unité', 'responsive', 'taille'], component: t(() => import('@/tools/PxRem.vue')) },

  // ── Texte ────────────────────────────────────────────────────────────────────
  { id: 'text', name: 'Texte', icon: 'letter-text', family: 'text', desc: 'Casse, slug, comptage et nettoyage de texte.', keywords: ['texte', 'case', 'slug', 'majuscule', 'minuscule', 'compter', 'mots'], component: t(() => import('@/tools/TextTools.vue')) },
  { id: 'markdown', name: 'Markdown', icon: 'file-text', family: 'text', desc: 'Prévisualiser du Markdown en direct.', keywords: ['markdown', 'md', 'preview', 'readme', 'aperçu'], component: t(() => import('@/tools/MarkdownPreview.vue')) },
  { id: 'case', name: 'Casse de code', icon: 'case-sensitive', family: 'text', desc: 'Convertir entre camelCase, snake_case, kebab-case…', keywords: ['casse', 'camelcase', 'snake_case', 'kebab', 'pascalcase', 'nommage'], component: t(() => import('@/tools/CaseConverter.vue')) },
  { id: 'unicode', name: 'Inspecteur Unicode', icon: 'whole-word', family: 'text', desc: 'Décomposer un texte en points de code et en octets UTF-8.', keywords: ['unicode', 'utf-8', 'point de code', 'caractère', 'emoji', 'codepoint'], component: t(() => import('@/tools/UnicodeInspector.vue')) },
  { id: 'regex', name: 'Regex', icon: 'regex', family: 'text', desc: 'Tester une expression régulière JavaScript en direct.', keywords: ['regex', 'regexp', 'expression', 'pattern', 'match'], component: t(() => import('@/tools/RegexTester.vue')) },
  { id: 'diff', name: 'Diff de texte', icon: 'diff', family: 'text', desc: 'Comparer deux textes ligne par ligne.', keywords: ['diff', 'comparer', 'différence', 'compare', 'changement'], component: t(() => import('@/tools/DiffTool.vue')) },
  { id: 'lines', name: 'Outils de lignes', icon: 'arrow-up-down', family: 'text', desc: 'Trier, dédupliquer, mélanger et nettoyer des listes.', keywords: ['lignes', 'trier', 'dédupliquer', 'doublons', 'mélanger', 'sort'], component: t(() => import('@/tools/LineTools.vue')) },
  { id: 'lorem', name: 'Lorem Ipsum', icon: 'pilcrow', family: 'text', desc: 'Générer du faux texte pour des maquettes.', keywords: ['lorem', 'ipsum', 'placeholder', 'faux texte', 'remplissage'], component: t(() => import('@/tools/LoremIpsum.vue')) },

  // ── Système & DevOps ─────────────────────────────────────────────────────────
  { id: 'chmod', name: 'Permissions chmod', icon: 'lock', family: 'sysnet', desc: 'Convertir les permissions Unix entre octal et rwx.', keywords: ['chmod', 'permissions', 'unix', 'linux', 'octal', 'rwx'], component: t(() => import('@/tools/ChmodCalculator.vue')) },
  { id: 'cidr', name: 'Sous-réseau CIDR', icon: 'network', family: 'sysnet', desc: 'Calculer un sous-réseau IPv4 : masque, plage, diffusion.', keywords: ['cidr', 'ip', 'ipv4', 'sous-réseau', 'subnet', 'masque'], component: t(() => import('@/tools/CidrCalculator.vue')) },
  { id: 'compose', name: 'Docker Compose', icon: 'container', family: 'sysnet', desc: 'Générer un compose.yaml : base, API, front, mails de test.', keywords: ['docker', 'compose', 'conteneur', 'postgres', 'nginx', 'mailpit', 'yaml'], emits: 'yaml', added: '2026-10', component: t(() => import('@/tools/ComposeBuilder.vue')) },
  { id: 'nginx', name: 'Configuration Nginx', icon: 'server-cog', family: 'sysnet', desc: 'Générer un bloc server : SPA, proxy d’API, PHP-FPM, en-têtes.', keywords: ['nginx', 'serveur', 'proxy', 'spa', 'php-fpm', 'try_files', 'reverse proxy'], added: '2026-10', component: t(() => import('@/tools/NginxBuilder.vue')) },

  // ── Référence ────────────────────────────────────────────────────────────────
  { id: 'httpstatus', name: 'Codes HTTP', icon: 'globe', family: 'reference', desc: 'Les codes de statut HTTP, avec leur nom RFC 9110.', keywords: ['http', 'status', 'code', '404', '500', 'référence'], component: t(() => import('@/tools/HttpStatus.vue')) },
  { id: 'mime', name: 'Types MIME', icon: 'files', family: 'reference', desc: 'Associer une extension de fichier à son Content-Type.', keywords: ['mime', 'content-type', 'extension', 'fichier', 'référence'], component: t(() => import('@/tools/MimeTypes.vue')) },
  { id: 'ports', name: 'Ports réseau', icon: 'plug', family: 'reference', desc: 'Les ports et services réseau courants.', keywords: ['port', 'réseau', 'tcp', 'udp', 'service', 'ssh', 'minecraft'], component: t(() => import('@/tools/Ports.vue')) },
  { id: 'ascii', name: 'Table ASCII', icon: 'keyboard', family: 'reference', desc: 'Les 128 caractères ASCII en décimal, hexa et octal.', keywords: ['ascii', 'caractère', 'code', 'décimal', 'hexadécimal'], component: t(() => import('@/tools/AsciiTable.vue')) },

  // ── Minecraft ────────────────────────────────────────────────────────────────
  { id: 'mcmotd', name: 'MOTD Minecraft', icon: 'message-square-quote', family: 'minecraft', desc: 'Prévisualiser un MOTD coloré et l’écrire pour server.properties.', keywords: ['minecraft', 'motd', 'serveur', 'couleurs', 'section', 'server.properties'], added: '2026-10', component: t(() => import('@/tools/MinecraftMotd.vue')) },
  { id: 'mccoords', name: 'Coordonnées Minecraft', icon: 'map-pin', family: 'minecraft', desc: 'Nether ⇄ Overworld, chunk, fichier de région.', keywords: ['minecraft', 'coordonnées', 'nether', 'chunk', 'région', 'mca', 'forceload'], added: '2026-10', component: t(() => import('@/tools/MinecraftCoords.vue')) },
];

export function getTool(id) {
  return TOOLS.find((tool) => tool.id === id) || null;
}

export function toolsOfFamily(familyId) {
  return TOOLS.filter((tool) => tool.family === familyId);
}
