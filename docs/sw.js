// Généré par build/service-worker.js — ne pas modifier à la main.
const CACHE = 'devtoolbox-df5fd365ce89';
const PRECACHE = [
  "./assets/AiAssistant-BVzB_ZDZ.css",
  "./assets/AiAssistant-CtETTJjN.js",
  "./assets/AsciiTable-Cgmctqqm.js",
  "./assets/Base64Tool-Ce6j89Vo.js",
  "./assets/BaseConverter-mIro9Lnt.js",
  "./assets/BoxShadow-CZ9RW6BW.js",
  "./assets/CaseConverter-BmjIqBtX.js",
  "./assets/CheatsheetView-1wwIhfWN.js",
  "./assets/CheatsheetView-DA5OiEEw.css",
  "./assets/CheatsheetsIndex-Bf4xuVaj.css",
  "./assets/CheatsheetsIndex-R7MjOFlk.js",
  "./assets/ChmodCalculator-BU0BTErJ.js",
  "./assets/CidrCalculator-D1rwtNM5.js",
  "./assets/ColorConverter-CBCentNG.js",
  "./assets/ComposeBuilder-vFLkYIG2.js",
  "./assets/ContrastChecker-cdIZc0nn.js",
  "./assets/CopyButton-DjwYhvL9.js",
  "./assets/CronParser-C0HPV86S.js",
  "./assets/CspBuilder-D2XqOojm.js",
  "./assets/Dashboard-6EDsPsOy.css",
  "./assets/Dashboard-CBHPwm1m.js",
  "./assets/DiffTool-BwbQ-_qY.js",
  "./assets/DotenvJson-BntBlugs.js",
  "./assets/ErdVisualizer-5XsDkn6R.js",
  "./assets/ErdVisualizer-BMiBok3x.css",
  "./assets/GradientGenerator-DUnq8Bkh.js",
  "./assets/HashTool-DXL4vnn9.js",
  "./assets/HexText-BK29vqMw.js",
  "./assets/HtmlEntities-BYUHGIE2.js",
  "./assets/HttpStatus-CyEnqhCH.js",
  "./assets/ImageToBase64-DBie4SqH.js",
  "./assets/JsonCsv-DbMGba1u.js",
  "./assets/JsonDiff-CcsAta8f.css",
  "./assets/JsonDiff-KezTXdmr.js",
  "./assets/JsonFormatter-BRml32r-.js",
  "./assets/JsonToTs-mSzJUUKZ.js",
  "./assets/JsonYaml-5eFAOJ7L.js",
  "./assets/JwtDecoder-CwOUNq8r.js",
  "./assets/Landing-0iZceCVF.js",
  "./assets/Landing-CXpAnP09.css",
  "./assets/LessonView-C-X6_3RM.css",
  "./assets/LessonView-DcTUqg1B.js",
  "./assets/LessonsIndex-BuuKYffI.js",
  "./assets/LessonsIndex-DrRiwbnx.css",
  "./assets/LineTools-DtKwpRfR.js",
  "./assets/LoremIpsum-JXqgaUET.js",
  "./assets/MarkdownPreview-BVZEY9L6.js",
  "./assets/MarkdownView-BKmHA1tk.js",
  "./assets/MarkdownView-DaQ8M0P9.css",
  "./assets/MimeTypes-Cq9Nv-Kk.js",
  "./assets/MinecraftCoords-DsNf-M8C.js",
  "./assets/MinecraftMotd-BBWn0251.js",
  "./assets/MockData-DxeKACPB.js",
  "./assets/NginxBuilder-CmXH-m-I.js",
  "./assets/NotFound-BfrOHsAW.js",
  "./assets/NotFound-C14N8S59.css",
  "./assets/OutputBox-C0t0KBUE.js",
  "./assets/PaletteGenerator-DAfV2DWo.js",
  "./assets/PasswordGenerator-e1Q__yVx.js",
  "./assets/PasswordStrength-CO6vcMF_.js",
  "./assets/PipelineButton-CM7mgDf_.js",
  "./assets/PipelineButton-Cu4TWVYf.css",
  "./assets/Ports-Ddt1d2iD.js",
  "./assets/Privacy-CZW5MCgL.js",
  "./assets/Privacy-lePADYcc.css",
  "./assets/ProgressRing-0YGeHe6w.css",
  "./assets/ProgressRing-c20_SKH4.js",
  "./assets/PxRem-BUip_JPv.js",
  "./assets/QrCode-BaKVvV2K.js",
  "./assets/QueryBuilder-B4x4HmFR.js",
  "./assets/QueryBuilder-CILV811r.css",
  "./assets/RegexTester-B3rqH_GF.js",
  "./assets/Segmented-BWmMmTiw.js",
  "./assets/Snippets-BU8D2MK6.js",
  "./assets/Snippets-CSha_c2v.css",
  "./assets/SortableIds-DhOKZLn9.js",
  "./assets/SqlFormatter-B2HpJxun.js",
  "./assets/SqlMigrate-DWzpRuCG.js",
  "./assets/SqlSchema-CWsz2sNe.js",
  "./assets/SqlSchema-CjR6qMZ9.css",
  "./assets/TextTools-DEAX-1Qo.js",
  "./assets/TimestampConverter-CW21B96s.js",
  "./assets/ToolShell-BpDQIlMr.css",
  "./assets/ToolShell-DbbiVulA.js",
  "./assets/ToolsIndex-BvTdaXgy.css",
  "./assets/ToolsIndex-Dq7wuKUy.js",
  "./assets/TotpGenerator-CyfJK_as.js",
  "./assets/UnicodeInspector-_-FUIq5b.js",
  "./assets/UnitConverter-6NqMCX7t.js",
  "./assets/UrlTool-CCRqPI6H.js",
  "./assets/UuidGenerator-Bwr7HPPP.js",
  "./assets/XmlFormatter-weqoUVS6.js",
  "./assets/architecture-Cyc5asHU.js",
  "./assets/async-BcK_tTWo.js",
  "./assets/avatar-Ddu0Ibwk.webp",
  "./assets/catalog-VoiP7aao.js",
  "./assets/cli-BXUSKECx.js",
  "./assets/css-grid-mj08f0JB.js",
  "./assets/css-unites-BxzOM7sA.js",
  "./assets/env-npm-B1ZoZLH8.js",
  "./assets/error-BTdmRKoB.js",
  "./assets/flexbox-CFog2xmZ.js",
  "./assets/flexbox-ojHCVNfW.js",
  "./assets/fullstack-BZJEQcLZ.js",
  "./assets/git-BjUN21wE.js",
  "./assets/git-BuZUfxNV.js",
  "./assets/grid-ByN0-fNR.js",
  "./assets/http-headers-DDNV4Ql1.js",
  "./assets/http-rest-CVidS4ip.js",
  "./assets/indentation-DmVScHnY.js",
  "./assets/index-C0sUZFg_.css",
  "./assets/index-e1P-DHg1.js",
  "./assets/inter-tight-latin-ext-wght-normal-B4u9PlvR.woff2",
  "./assets/inter-tight-latin-wght-normal-DX-nOvPD.woff2",
  "./assets/javascript-Cmil834X.js",
  "./assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2",
  "./assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2",
  "./assets/markdown-CVhN7teY.js",
  "./assets/markdown-n-s2MhI5.js",
  "./assets/node.browser-BuqcnotF.js",
  "./assets/node.browser-HQ5SKBOf.js",
  "./assets/permissions-BxGwl17z.js",
  "./assets/php-DmnNl-nv.js",
  "./assets/projet-complet-CIspwWRf.js",
  "./assets/regex-2YPmo0vn.js",
  "./assets/reseau-ip-Cjmf-V3H.js",
  "./assets/sdk-xAeG6lNd.js",
  "./assets/sql-BCQmVo-u.js",
  "./assets/sql-l-ChtQeC.js",
  "./assets/sqlSchema-DM-h7QPx.js",
  "./assets/terminal-BFtufyOP.js",
  "./assets/useClaude-DkpHaYZX.js",
  "./assets/useClipboard-AVuFbI8o.js",
  "./assets/usePersistentRef-BCaBSRhj.js",
  "./assets/usePipeline-CpPjqy7a.js",
  "./assets/useShareLink-Bq9v12HM.js",
  "./assets/useToolAI-D5SonVaB.css",
  "./assets/useToolAI-DOIqAMek.js",
  "./assets/vscode-mxHZDlP3.js",
  "./assets/vue-page-DZ5x-uXH.js",
  "./icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-32.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./theme-init.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))),
  );
});

// Pas d'activation automatique : la page affiche « Nouvelle version disponible » et
// envoie SKIP_WAITING quand l'utilisateur choisit de recharger. Les anciens fichiers
// restent ainsi disponibles tant qu'une page de l'ancienne version est ouverte.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('devtoolbox') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // API Anthropic & co : jamais interceptées

  if (request.mode === 'navigate') {
    // Routage par hash : toute navigation sert le même index.html, pris dans le cache.
    event.respondWith(
      caches
        .match('./index.html')
        .then((cached) => cached || fetch(request))
        .catch(() => Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.ok && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => Response.error()),
    ),
  );
});
