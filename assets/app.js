// Dépôt où arrivent les propositions de ressources.
const REPO = "hitman-987/Apprendre-les-Comores-";

const state = { cat: "all", ile: "all", freeOnly: false, q: "" };
const $ = (id) => document.getElementById(id);

// Recherche insensible aux accents et à la casse.
const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const host = (url) => { try { return new URL(url).hostname.replace(/^(www|m)\./, ""); } catch { return ""; } };
const ileLabel = (k) => k === "archipel" ? "Tout l'archipel" : `${ILES[k].nom} · ${ILES[k].fr}`;

for (const r of RESOURCES) {
  r.hay = normalize([r.title, r.meta, r.desc, CATEGORIES[r.cat], ILES[r.ile].nom, ILES[r.ile].fr, host(r.url)].join(" "));
}

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

function matches(r, ignoreCat = false) {
  if (!ignoreCat && state.cat !== "all" && r.cat !== state.cat) return false;
  // Une ressource « archipel » concerne toutes les îles.
  if (state.ile !== "all" && r.ile !== state.ile && r.ile !== "archipel") return false;
  if (state.freeOnly && !r.free) return false;
  if (state.q) return normalize(state.q).split(/\s+/).every((w) => r.hay.includes(w));
  return true;
}

function renderTabs() {
  const pool = RESOURCES.filter((r) => matches(r, true));
  const counts = pool.reduce((a, r) => ((a[r.cat] = (a[r.cat] || 0) + 1), a), {});
  const tabs = [["all", "Tout", pool.length], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v, counts[k] || 0])];
  $("tabs").innerHTML = tabs
    .map(([k, label, n]) => `<button class="tab" role="tab" data-cat="${k}" aria-selected="${state.cat === k}">${label}<small>${n}</small></button>`)
    .join("");
}

function render() {
  const list = RESOURCES.filter((r) => matches(r));
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
  $("count").textContent = `${list.length} ressource${list.length > 1 ? "s" : ""}`;
  $("picks").hidden = state.q !== "" || state.cat !== "all";
  renderTabs();

  document.querySelectorAll(".island").forEach((g) => g.classList.toggle("on", g.dataset.ile === state.ile));
  $("mapStatus").textContent = state.ile === "all" ? "Toutes les îles" : ileLabel(state.ile);
  $("mapReset").hidden = state.ile === "all";
}

function selectIsland(ile) {
  state.ile = state.ile === ile ? "all" : ile;
  render();
}

/* ── Formulaire de proposition ───────── */
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

function setupForm() {
  $("sCat").innerHTML = Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("sIle").innerHTML = Object.keys(ILES).map((k) => `<option value="${k}">${ileLabel(k)}</option>`).join("");
  $("sIle").value = "archipel";

  $("suggestForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = readForm();
    if (!validate(d)) return;
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

/* ── Démarrage ───────────────────────── */
function init() {
  const free = RESOURCES.filter((r) => r.free).length;
  $("lead").textContent = `${RESOURCES.length} ressources sur les quatre îles, dont ${free} gratuites : livres, vidéos, randonnées, plages, histoire, langue, cuisine et grandes figures de l'archipel.`;
  $("topRail").innerHTML = RESOURCES.filter((r) => r.top).map(card).join("");

  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
  });
  $("freeOnly").addEventListener("change", (e) => { state.freeOnly = e.target.checked; render(); });
  $("q").addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); });
  $("q").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("explorer").scrollIntoView();
  });

  document.querySelectorAll(".island").forEach((g) => {
    g.addEventListener("click", () => selectIsland(g.dataset.ile));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectIsland(g.dataset.ile); }
    });
  });
  $("mapReset").addEventListener("click", () => selectIsland(state.ile));

  setupForm();
  render();
}

init();
