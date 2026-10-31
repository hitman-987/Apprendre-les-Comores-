// Génère les pages lues par les moteurs de recherche à partir des données du site :
//   ressources.html : toutes les ressources en HTML simple (lisible sans JavaScript)
//   sitemap.xml     : le plan du site à déclarer dans Google Search Console
// Usage : node outils/generer-pages.js   (à relancer après chaque ajout de ressources)

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://hitman-987.github.io/Apprendre-les-Comores-/";
const ROOT = path.join(__dirname, "..");

const ctx = {};
vm.createContext(ctx);
for (const f of ["data/resources.js", "data/fiches.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8") + "\n;globalThis.RESOURCES = typeof RESOURCES !== 'undefined' ? RESOURCES : globalThis.RESOURCES; globalThis.CATEGORIES = typeof CATEGORIES !== 'undefined' ? CATEGORIES : globalThis.CATEGORIES; globalThis.ILES = typeof ILES !== 'undefined' ? ILES : globalThis.ILES; globalThis.FICHES = typeof FICHES !== 'undefined' ? FICHES : globalThis.FICHES;", ctx);
}
const { RESOURCES, CATEGORIES, ILES, FICHES } = ctx;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ile = (k) => (k === "archipel" ? "Tout l'archipel" : `${ILES[k].nom} (${ILES[k].fr})`);
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const today = new Date().toISOString().slice(0, 10);

const sections = Object.entries(CATEGORIES).map(([k, label]) => {
  const items = RESOURCES.filter((r) => r.cat === k);
  if (!items.length) return "";
  return `
  <section id="${slug(label)}">
    <h2>${esc(label)} <small>(${items.length})</small></h2>
    <ul>
${items.map((r) => `      <li><a href="${esc(r.url)}" rel="noopener">${esc(r.title)}</a> · <span class="meta">${esc(r.meta)} · ${esc(ile(r.ile))}${r.free ? " · gratuit" : ""}</span><br>${esc(r.desc)}</li>`).join("\n")}
    </ul>
  </section>`;
}).join("\n");

const fiches = FICHES.map((f) => `
  <article id="sujet-${f.id}">
    <h3>${esc(f.title)}</h3>
${f.text.map((p) => `    <p>${esc(p)}</p>`).join("\n")}
  </article>`).join("\n");

const desc = `Liste complète des ${RESOURCES.length} ressources pour apprendre les Comores : histoire, Grande Comore, Anjouan, Mohéli, Mayotte, shikomori, livres, vidéos, données.`;
const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toutes les ressources pour apprendre les Comores | Apprendre les Comores</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${SITE}ressources.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Apprendre les Comores">
  <meta property="og:title" content="Toutes les ressources pour apprendre les Comores">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${SITE}ressources.html">
  <meta property="og:image" content="${SITE}assets/img/apercu.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="assets/img/icone-192.png">
  <style>
    :root { --bg: #f3f6f5; --fg: #17201f; --muted: #586664; --accent: #0b5f5c; color-scheme: light dark; }
    @media (prefers-color-scheme: dark) { :root { --bg: #0d1615; --fg: #e5eeec; --muted: #9aaba8; --accent: #4cc0b4; } }
    body { margin: 0; background: var(--bg); color: var(--fg); font: 1rem/1.6 system-ui, sans-serif; }
    main { max-width: 860px; margin: 0 auto; padding: 32px max(16px, env(safe-area-inset-left, 0px)) 64px; }
    a { color: var(--accent); }
    h1 { font-size: 2rem; line-height: 1.15; }
    h2 { margin-top: 2.2em; } small, .meta { color: var(--muted); }
    li { margin-bottom: .9em; } nav a { margin-right: 12px; }
  </style>
</head>
<body>
<main>
  <p><a href="./">← Retour à Apprendre les Comores</a></p>
  <h1>Toutes les ressources pour apprendre les Comores</h1>
  <p>Cette page rassemble les ${RESOURCES.length} ressources du site <a href="./">Apprendre les Comores</a> sur les quatre îles de l'archipel : Ngazidja (Grande Comore), Mwali (Mohéli), Ndzuwani (Anjouan) et Maore (Mayotte). Pour chercher, filtrer par île et voir les lieux sur une carte, utilisez <a href="./">la page principale</a>.</p>
  <nav aria-label="Rubriques">${Object.values(CATEGORIES).map((l) => `<a href="#${slug(l)}">${esc(l)}</a>`).join(" ")}</nav>
${sections}
  <section id="sujets">
    <h2>Les Comores en quelques sujets</h2>
${fiches}
  </section>
  <p><a href="./">← Retour à Apprendre les Comores</a></p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, "ressources.html"), html);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE}ressources.html</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log(`ressources.html (${RESOURCES.length} ressources) et sitemap.xml générés.`);
