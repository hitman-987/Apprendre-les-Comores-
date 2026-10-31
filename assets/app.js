// ── Réglages ─────────────────────────────────────────────
// Dépôt GitHub qui reçoit les propositions quand aucun Google Form n'est réglé.
const REPO = "hitman-987/Apprendre-les-Comores-";

// Google Form de proposition (voir outils/google-form.md). Laisser à null tant qu'il n'existe pas.
// Exemple : { action: "https://docs.google.com/forms/d/e/…/formResponse",
//             entries: { title: "entry.1", url: "entry.2", cat: "entry.3", ile: "entry.4", desc: "entry.5", name: "entry.6" } }
const GOOGLE_FORM = null;

// Agent IA facultatif (voir outils/assistant-ia.md et outils/agent-ia-worker.js).
// Exemple : "https://assistant-comores.<votre-compte>.workers.dev". Laisser à null pour l'assistant sans IA.
const ASSISTANT_API = null;

// ── Outils ───────────────────────────────────────────────
const state = { cat: "all", ile: "all", freeOnly: false, q: "" };
const $ = (id) => document.getElementById(id);
const onRender = []; // la carte et l'assistant s'abonnent au rendu
let submittedQuery = ""; // dernière recherche validée (Entrée, bouton, suggestion)

// Recherche insensible aux accents et à la casse.
const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const host = (url) => { try { return new URL(url).hostname.replace(/^(www|m)\./, ""); } catch { return ""; } };
const ileLabel = (k) => k === "archipel" ? "Tout l'archipel" : `${ILES[k].nom} · ${ILES[k].fr}`;
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

// Mots sans intérêt pour la recherche (« qui était Ali Soilihi ? » → « ali soilihi »).
const STOP = new Set(("a au aux avec c ce ces comment d dans de des du en est et etait fait faire il je l la le les leur ma me mes moi mon ne on ou par parle pas plus pour pourquoi qu que quel quelle quelles quels qui quoi sa se ses son sur ta te tes toi ton tu un une vos votre vous y " +
  "dis donne explique raconte infos info information informations savoir veux voudrais connaitre apprendre decouvrir aller visiter voir trouver meilleur meilleure meilleurs meilleures bon bonne bons bonnes " +
  "comores comore comorien comorienne comoriens").split(" "));

function terms(q) {
  return normalize(q).replace(/[^a-z0-9' -]/g, " ").split(/[\s']+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));
}

for (const r of RESOURCES) {
  r.hay = normalize([r.title, r.meta, r.desc, CATEGORIES[r.cat], ILES[r.ile].nom, ILES[r.ile].fr, host(r.url)].join(" "));
}
const FICHE_BY_ID = Object.fromEntries(FICHES.map((f) => [f.id, f]));

// ── Recherche ────────────────────────────────────────────
// Fiches larges : un sujet précis de la même question passe avant elles.
const GENERAL = new Set(["archipel", "ngazidja", "mwali", "ndzuwani", "maore", "randonnees", "plages", "restaurants", "nature"]);

function findFiche(q) {
  const nq = " " + normalize(q).replace(/[^a-z0-9' -]/g, " ") + " ";
  let best = null, bestScore = 0;
  for (const f of FICHES) {
    let score = 0;
    for (const k of f.keys) if (nq.includes(" " + k)) score = Math.max(score, k.split(" ").length * 2 + k.length / 20);
    if (GENERAL.has(f.id)) score *= 0.8;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}

function filterBy(s) {
  return (r) => {
    if (s.cat !== "all" && r.cat !== s.cat) return false;
    // Une ressource « archipel » concerne toutes les îles.
    if (s.ile !== "all" && r.ile !== s.ile && r.ile !== "archipel") return false;
    if (s.freeOnly && !r.free) return false;
    return true;
  };
}

// Toutes les ressources qui contiennent tous les mots, puis, à défaut, celles qui en contiennent le plus.
function textMatch(list, words, fiche) {
  if (!words.length) return fiche ? list.filter((r) => fiche.find.some((w) => r.hay.includes(w))) : list;
  const all = list.filter((r) => words.every((w) => r.hay.includes(w)));
  if (all.length) return all;
  const pool = fiche ? [...new Set([...words, ...fiche.find])] : words;
  // Pour un nom complet (« Mohamed Taki Abdoulkarim »), un seul mot commun ne suffit pas.
  const min = !fiche && words.length >= 3 ? 2 : 1;
  return list
    .map((r) => [r, pool.filter((w) => r.hay.includes(w)).length])
    .filter(([, n]) => n >= min)
    .sort((a, b) => b[1] - a[1])
    .map(([r]) => r);
}

// Recherche pour un état donné (celui de la page, ou celui d'une question de l'assistant).
function searchFor(s) {
  const fiche = s.q ? findFiche(s.q) : null;
  const base = RESOURCES.filter(filterBy(s));
  const list = s.q ? textMatch(base, terms(s.q), fiche) : base;
  return { fiche, list };
}

// ── Affichage des ressources ─────────────────────────────
function card(r) {
  return `
    <a class="card" href="${esc(r.url)}" target="_blank" rel="noopener">
      <div class="card-top">
        <span class="dot ${r.ile}" aria-hidden="true"></span>
        <span>${esc(ileLabel(r.ile))}</span>
        ${r.lang === "en" ? '<span class="badge en" title="En anglais">EN</span>' : ""}
        ${r.free ? '<span class="badge free">Gratuit</span>' : '<span class="badge paid">Payant</span>'}
      </div>
      <h4>${esc(r.title)}</h4>
      <p class="meta">${esc(r.meta)}</p>
      <p class="desc">${esc(r.desc)}</p>
      <span class="host">${esc(host(r.url))}</span>
    </a>`;
}

function renderTabs(pool) {
  const counts = pool.reduce((a, r) => ((a[r.cat] = (a[r.cat] || 0) + 1), a), {});
  const tabs = [["all", "Tout", pool.length], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v, counts[k] || 0])];
  $("tabs").innerHTML = tabs
    .map(([k, label, n]) => `<button class="tab" role="tab" data-cat="${k}" aria-selected="${state.cat === k}">${label}<small>${n}</small></button>`)
    .join("");
}

function render() {
  const result = searchFor(state);
  const { list } = result;
  const groups = Object.keys(CATEGORIES)
    .map((k) => [k, list.filter((r) => r.cat === k)])
    .filter(([, items]) => items.length);

  $("results").innerHTML = groups
    .map(([k, items]) => `
      <section class="group" aria-label="${esc(CATEGORIES[k])}">
        <div class="group-head"><h3>${esc(CATEGORIES[k])}</h3><span>${items.length}</span></div>
        <div class="grid">${items.map(card).join("")}</div>
      </section>`)
    .join("");

  $("empty").hidden = list.length > 0;
  $("count").textContent = plural(list.length, "ressource", "ressources");
  const filtering = state.q !== "" || state.cat !== "all";
  $("picks").hidden = filtering;
  $("today").hidden = filtering;
  $("activeIle").hidden = state.ile === "all";
  if (state.ile !== "all") $("activeIle").textContent = `${ileLabel(state.ile)} ×`;

  // Les compteurs des onglets suivent la recherche et l'île, pas la rubrique.
  renderTabs(searchFor({ ...state, cat: "all" }).list);
  document.querySelectorAll(".ichip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.ile === state.ile));

  for (const fn of onRender) fn(result);
}

function setSearch(q, { scroll = true } = {}) {
  $("q").value = q;
  state.q = q;
  submittedQuery = q;
  state.cat = "all";
  render();
  if (scroll) $("explorer").scrollIntoView({ behavior: document.documentElement.classList.contains("calm") ? "auto" : "smooth" });
}

function setIsland(ile) {
  state.ile = ile;
  render();
}

// ── Formulaire de proposition ────────────────────────────
function suggestionText(d) {
  return [
    `Titre : ${d.title}`,
    `Lien : ${d.url}`,
    `Rubrique : ${CATEGORIES[d.cat]}`,
    `Île : ${ileLabel(d.ile)}`,
    d.desc && `Pourquoi : ${d.desc}`,
    d.name && `Proposé par : ${d.name}`,
  ].filter(Boolean).join("\n");
}

function readForm() {
  const f = $("suggestForm");
  return Object.fromEntries(["title", "url", "cat", "ile", "desc", "name"].map((k) => [k, f.elements[k].value.trim()]));
}

function validate(d) {
  const f = $("suggestForm");
  let ok = true;
  f.elements.title.setAttribute("aria-invalid", !d.title);
  if (!d.title) ok = false;

  let urlMsg = "";
  if (!/^https?:\/\/\S+\.\S+/.test(d.url)) urlMsg = "Collez un lien complet, qui commence par https://";
  else if (RESOURCES.some((r) => r.url.replace(/\/$/, "") === d.url.replace(/\/$/, ""))) urlMsg = "Cette ressource est déjà sur le site. Merci !";
  f.elements.url.setAttribute("aria-invalid", !!urlMsg);
  $("sUrlMsg").textContent = urlMsg;
  if (urlMsg) ok = false;

  if (!ok) (d.title ? f.elements.url : f.elements.title).focus();
  return ok;
}

async function sendToGoogleForm(d) {
  const body = new URLSearchParams();
  const values = { ...d, cat: CATEGORIES[d.cat], ile: ileLabel(d.ile) };
  for (const [k, entry] of Object.entries(GOOGLE_FORM.entries)) body.append(entry, values[k] || "");
  // Google Forms n'autorise pas la lecture de sa réponse : l'envoi part, sans accusé de réception.
  await fetch(GOOGLE_FORM.action, { method: "POST", mode: "no-cors", body });
}

function sendToGitHub(d) {
  const params = new URLSearchParams({
    template: "nouvelle-ressource.yml",
    title: `[Ressource] ${d.title}`,
    lien: d.url,
    rubrique: CATEGORIES[d.cat],
    ile: ileLabel(d.ile),
    description: d.desc,
    auteur: d.name,
  });
  const url = `https://github.com/${REPO}/issues/new?${params}`;
  window.open(url, "_blank", "noopener");
  $("formStatus").innerHTML = `Votre proposition est prête sur GitHub. Si la page ne s'est pas ouverte, <a href="${esc(url)}" target="_blank" rel="noopener">ouvrez-la ici</a>, puis cliquez sur « Create » pour l'envoyer.`;
}

function setupForm() {
  $("sCat").innerHTML = Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("sIle").innerHTML = Object.keys(ILES).map((k) => `<option value="${k}">${ileLabel(k)}</option>`).join("");
  $("sIle").value = "archipel";

  if (GOOGLE_FORM) {
    $("sendBtn").textContent = "Envoyer la proposition";
    $("formHelp").textContent = "Aucun compte n'est nécessaire. Chaque proposition est relue avant d'être ajoutée.";
  }

  $("suggestForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = readForm();
    if (!validate(d)) return;
    if (!GOOGLE_FORM) return sendToGitHub(d);
    $("sendBtn").disabled = true;
    try {
      await sendToGoogleForm(d);
      $("suggestForm").reset();
      $("sIle").value = "archipel";
      $("formStatus").textContent = "Merci ! Votre proposition a été envoyée. Elle sera ajoutée au site après vérification.";
    } catch {
      $("formStatus").textContent = "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou copiez la proposition.";
    } finally {
      $("sendBtn").disabled = false;
    }
  });

  $("copyBtn").addEventListener("click", async () => {
    const d = readForm();
    if (!validate(d)) return;
    const text = suggestionText(d);
    try {
      await navigator.clipboard.writeText(text);
      $("formStatus").textContent = "Proposition copiée. Collez-la dans un message à l'équipe du site.";
    } catch {
      $("formStatus").textContent = text;
    }
  });
}

// ── Démarrage ────────────────────────────────────────────
function init() {
  const free = RESOURCES.filter((r) => r.free).length;
  $("lead").textContent = "Livres, vidéos, randonnées, plages, histoire, langue, cuisine, grandes figures et avancées récentes : tout ce qu'il faut pour découvrir l'archipel, sur une carte et avec un assistant.";
  $("topRail").innerHTML = RESOURCES.filter((r) => r.top && r.cat !== "innovations").map(card).join("");

  const today = FICHE_BY_ID.innovations;
  $("todayText").innerHTML = today.text.map((p) => `<p>${esc(p)}</p>`).join("");
  $("todayRail").innerHTML = RESOURCES.filter((r) => r.cat === "innovations").slice(0, 8).map(card).join("");
  $("todayAll").addEventListener("click", () => {
    state.cat = "innovations";
    render();
    $("explorer").scrollIntoView({ behavior: "smooth" });
  });

  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
  });
  $("freeOnly").addEventListener("change", (e) => { state.freeOnly = e.target.checked; render(); });
  $("activeIle").addEventListener("click", () => setIsland("all"));

  let timer;
  $("q").addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 200);
  });
  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    setSearch($("q").value.trim());
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ask]");
    if (b) setSearch(b.dataset.ask);
  });
  $("islandChips").addEventListener("click", (e) => {
    const b = e.target.closest(".ichip");
    if (b) setIsland(b.dataset.ile);
  });

  setupForm();
  render();
}

window.addEventListener("DOMContentLoaded", init);
