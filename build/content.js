// Plugin Vite : transforme le contenu éditorial en modules JS au moment du build.
//
//   src/content/lessons/<id>.md         → la leçon complète (blocs rendus, code coloré)
//   src/content/lessons/<id>.md?meta    → ses seules métadonnées (pour les index et la recherche)
//   src/content/cheatsheets/<id>.yaml   → la fiche complète
//   src/content/cheatsheets/<id>.yaml?meta
//
// Le navigateur ne reçoit que du JSON prêt à afficher : ni parseur Markdown, ni YAML,
// ni coloration syntaxique ne sont embarqués dans l'application.
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { createHighlighter } from 'shiki';
import { escapeHtml, parseBlocks, renderInline, slugify, splitFrontMatter } from './markdown.js';

export const TRACKS = ['bases', 'front', 'back', 'securite', 'devops', 'creatif'];
export const CHEAT_CATEGORIES = ['cli', 'web', 'data', 'devops', 'prod', 'jeu'];

const LANGS = [
  'javascript', 'typescript', 'vue', 'html', 'css', 'json', 'bash', 'powershell', 'php', 'sql',
  'yaml', 'dockerfile', 'nginx', 'ini', 'dotenv', 'http', 'csharp', 'glsl', 'xml', 'diff', 'markdown',
];
const ALIASES = {
  js: 'javascript', ts: 'typescript', sh: 'bash', shell: 'bash', ps1: 'powershell', pwsh: 'powershell',
  yml: 'yaml', docker: 'dockerfile', env: 'dotenv', cs: 'csharp', 'c#': 'csharp', md: 'markdown',
};

let highlighterPromise;
async function highlight(code, lang) {
  highlighterPromise ??= createHighlighter({ themes: ['github-light', 'github-dark'], langs: LANGS });
  const highlighter = await highlighterPromise;
  const id = ALIASES[lang] ?? lang;
  if (!highlighter.getLoadedLanguages().includes(id)) {
    return code.split('\n').map((line) => `<span class="line">${escapeHtml(line)}</span>`).join('\n');
  }
  const html = highlighter.codeToHtml(code, {
    lang: id,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
  return html.replace(/^<pre[^>]*><code>/, '').replace(/<\/code><\/pre>\s*$/, '');
}

function fail(file, message) {
  throw new Error(`[contenu] ${path.basename(file)} : ${message}`);
}

function checkQuiz(quiz, file) {
  if (!Array.isArray(quiz)) fail(file, 'quiz doit être une liste');
  quiz.forEach((q, i) => {
    const where = `question ${i + 1}`;
    if (!q.q || !q.explain) fail(file, `${where} : « q » et « explain » sont obligatoires`);
    if (!Array.isArray(q.options) || q.options.length < 2) fail(file, `${where} : au moins deux options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      fail(file, `${where} : « answer » doit désigner une option existante`);
    }
  });
}

function wordsOf(blocks) {
  let words = 0;
  for (const b of blocks) {
    const text = b.md ?? (b.items ? b.items.join(' ') : b.code ?? (b.rows ? b.rows.flat().join(' ') : ''));
    words += String(text).split(/\s+/).filter(Boolean).length;
  }
  return words;
}

async function buildLesson(source, file) {
  const { front, body } = splitFrontMatter(source, file);
  const meta = parseYaml(front) ?? {};
  for (const key of ['id', 'title', 'icon', 'summary', 'track']) {
    if (!meta[key]) fail(file, `champ « ${key} » manquant`);
  }
  if (path.basename(file, '.md') !== meta.id) fail(file, `l'id « ${meta.id} » doit correspondre au nom du fichier`);
  if (!TRACKS.includes(meta.track)) fail(file, `parcours « ${meta.track} » inconnu (${TRACKS.join(', ')})`);
  checkQuiz(meta.quiz ?? [], file);

  const raw = parseBlocks(body, file);
  const blocks = [];
  const toc = [];
  for (const b of raw) {
    switch (b.type) {
      case 'heading':
      case 'subheading': {
        const id = slugify(b.md);
        if (b.type === 'heading') toc.push({ id, html: renderInline(b.md) });
        blocks.push({ type: b.type, id, html: renderInline(b.md) });
        break;
      }
      case 'text':
        blocks.push({ type: 'text', html: renderInline(b.md) });
        break;
      case 'callout':
        blocks.push({ type: 'callout', variant: b.variant, html: renderInline(b.md) });
        break;
      case 'list':
        blocks.push({ type: 'list', ordered: b.ordered, items: b.items.map(renderInline) });
        break;
      case 'table':
        blocks.push({ type: 'table', head: b.head.map(renderInline), rows: b.rows.map((r) => r.map(renderInline)) });
        break;
      case 'code':
        blocks.push({ type: 'code', lang: b.lang, label: b.label, code: b.code, html: await highlight(b.code, b.lang) });
        break;
      default:
        fail(file, `bloc inconnu ${b.type}`);
    }
  }

  const quiz = (meta.quiz ?? []).map((q) => ({
    q: renderInline(q.q),
    options: q.options.map((o) => renderInline(String(o))),
    answer: q.answer,
    explain: renderInline(q.explain),
  }));

  return {
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    summary: meta.summary,
    track: meta.track,
    order: meta.order ?? 99,
    keywords: meta.keywords ?? [],
    tools: meta.tools ?? [],
    added: meta.added ? String(meta.added) : null,
    readingTime: Math.max(2, Math.round(wordsOf(raw) / 180)),
    quiz,
    toc,
    blocks,
  };
}

function lessonMeta(lesson) {
  const { quiz, toc, blocks, ...meta } = lesson;
  return { ...meta, quizCount: quiz.length };
}

function buildCheatsheet(source, file) {
  const data = parseYaml(source) ?? {};
  for (const key of ['id', 'title', 'icon', 'summary', 'category', 'groups']) {
    if (!data[key]) fail(file, `champ « ${key} » manquant`);
  }
  if (path.basename(file).replace(/\.ya?ml$/, '') !== data.id) fail(file, `l'id « ${data.id} » doit correspondre au nom du fichier`);
  if (!CHEAT_CATEGORIES.includes(data.category)) fail(file, `catégorie « ${data.category} » inconnue`);
  const groups = data.groups.map((g) => {
    if (!g.title || !Array.isArray(g.items)) fail(file, 'chaque groupe a un titre et des items');
    return {
      title: g.title,
      items: g.items.map((item) => {
        if (item.code == null || !item.desc) fail(file, `item incomplet dans « ${g.title} »`);
        return { code: String(item.code), desc: renderInline(item.desc) };
      }),
    };
  });
  return {
    id: data.id,
    title: data.title,
    icon: data.icon,
    summary: data.summary,
    category: data.category,
    keywords: data.keywords ?? [],
    added: data.added ? String(data.added) : null,
    count: groups.reduce((n, g) => n + g.items.length, 0),
    groups,
  };
}

export default function content() {
  return {
    name: 'devtoolbox-content',
    enforce: 'pre',
    async transform(code, id) {
      const [rawFile, query = ''] = id.split('?');
      const file = rawFile.replace(/\\/g, '/');
      const wantsMeta = new URLSearchParams(query).has('meta');

      if (file.includes('/src/content/lessons/') && file.endsWith('.md')) {
        const lesson = await buildLesson(code, file);
        return { code: `export default ${JSON.stringify(wantsMeta ? lessonMeta(lesson) : lesson)};`, map: null };
      }
      if (file.includes('/src/content/cheatsheets/') && /\.ya?ml$/.test(file)) {
        const sheet = buildCheatsheet(code, file);
        const { groups, ...meta } = sheet;
        return { code: `export default ${JSON.stringify(wantsMeta ? meta : sheet)};`, map: null };
      }
      return null;
    },
  };
}
