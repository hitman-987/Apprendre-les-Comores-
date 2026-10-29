// Assistant : il résume une recherche à partir des ressources du site,
// complète avec Wikipédia quand le site n'en dit pas assez,
// et passe par un agent IA si ASSISTANT_API est réglé.

const MIN_LOCAL = 3; // en dessous, l'assistant va chercher sur le web
const webCache = new Map();
const PLACE_WORDS = /comor|moheli|mwali|anjouan|ndzuwani|mayotte|maore|moroni|ngazidja|karthala|mutsamudu|fomboni|mamoudzou/;

// ── Recherche web (Wikipédia, gratuite et sans clé) ──────
async function wikiSearch(q) {
  const key = normalize(q);
  if (webCache.has(key)) return webCache.get(key);
  const words = terms(q).join(" ") || q;
  const tries = [
    ["fr", PLACE_WORDS.test(normalize(words)) ? words : words + " Comores"],
    ["fr", words],
    ["en", words + " Comoros"],
  ];
  let found = null;
  for (const [lang, query] of tries) {
    const url = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action: "query", format: "json", origin: "*", generator: "search", gsrsearch: query, gsrlimit: "4",
      prop: "extracts|info", exintro: "1", explaintext: "1", exsentences: "6", inprop: "url",
    });
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {}).filter((p) => p.extract).sort((a, b) => a.index - b.index);
    if (pages.length) { found = { lang, pages }; break; }
  }
  webCache.set(key, found);
  return found;
}

function webBlock(web, q) {
  const more = `https://duckduckgo.com/?q=${encodeURIComponent(q + " Comores")}`;
  if (!web) {
    return `<div class="web-block"><p class="web-label">Recherche sur le web</p>
      <p>Wikipédia ne donne rien de pertinent. <a href="${more}" target="_blank" rel="noopener">Chercher sur le web</a>.</p></div>`;
  }
  const [first, ...others] = web.pages;
  const paras = first.extract.split(/\n+/).filter(Boolean).slice(0, 3);
  return `
    <div class="web-block">
      <p class="web-label">Trouvé sur le web · Wikipédia${web.lang === "en" ? " (anglais)" : ""}</p>
      <h4><a href="${esc(first.fullurl)}" target="_blank" rel="noopener">${esc(first.title)}</a></h4>
      ${paras.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${others.length ? `<p class="web-more">Autres articles : ${others.map((p) => `<a href="${esc(p.fullurl)}" target="_blank" rel="noopener">${esc(p.title)}</a>`).join(", ")}</p>` : ""}
      <p class="web-note">Ces informations viennent du web, pas des ressources du site : vérifiez-les. <a href="${more}" target="_blank" rel="noopener">Plus de résultats</a></p>
    </div>`;
}

// ── Agent IA (facultatif) ────────────────────────────────
async function askAgent(q, fiche, list, history) {
  const res = await fetch(ASSISTANT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: q,
      history: history.slice(-6),
      fiche: fiche ? `${fiche.title}\n${fiche.text.join("\n")}` : "",
      ressources: list.slice(0, 12).map((r) => ({ titre: r.title, details: r.meta, description: r.desc, lien: r.url })),
    }),
  });
  if (!res.ok) throw new Error("agent " + res.status);
  return res.json(); // { answer, web: [{ title, url }] }
}

function agentBlock(data) {
  const paras = data.answer.split(/\n+/).filter(Boolean);
  const web = data.web || [];
  return `
    <div class="ai-answer">
      <p class="web-label">Réponse rédigée par l'IA</p>
      ${paras.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${web.length ? `<p class="web-more">Sources web consultées : ${web.map((w) => `<a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.title)}</a>`).join(", ")}</p>` : ""}
      <p class="web-note">L'IA s'appuie sur les ressources du site${web.length ? " et sur le web" : ""}. Elle peut se tromper : vérifiez dans les sources.</p>
    </div>`;
}

// ── Composition de la réponse ────────────────────────────
function breakdown(list) {
  const counts = {};
  for (const r of list) counts[r.cat] = (counts[r.cat] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, n]) => `${n} en « ${CATEGORIES[k]} »`)
    .join(", ");
}

// Les ressources gratuites et recommandées d'abord, en gardant l'ordre de pertinence.
function bestFirst(list, n) {
  return list
    .map((r, i) => [r, i - (r.top ? 6 : 0) - (r.free ? 3 : 0)])
    .sort((a, b) => a[1] - b[1])
    .slice(0, n)
    .map(([r]) => r);
}

function localAnswer(q, fiche, list) {
  let html = `<h3>${esc(fiche ? fiche.title : `« ${q} »`)}</h3>`;
  if (fiche) html += fiche.text.map((p) => `<p>${esc(p)}</p>`).join("");

  if (list.length) {
    const top = bestFirst(list, 5);
    html += `
      <p class="answer-sub">${fiche ? "Ce que disent nos ressources" : "Ce que disent les ressources du site"}</p>
      <ul class="answer-list">${top.map((r) => `
        <li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>
          <span class="answer-meta">${esc(r.meta)}</span> : ${esc(r.desc)}</li>`).join("")}
      </ul>
      <p class="answer-count">${plural(list.length, "ressource", "ressources")} sur le site : ${esc(breakdown(list))}.</p>`;
  } else {
    html += `<p>Le site n'a pas encore de ressource sur ce sujet.</p>`;
  }
  return html;
}

function seeAlso(fiche, attr) {
  const see = fiche ? fiche.see.map((id) => FICHE_BY_ID[id]).filter(Boolean) : [];
  if (!see.length) return "";
  return `<div class="assistant-next"><span>Pour aller plus loin</span>${see.map((s) => `<button type="button" class="chip" ${attr}="${esc(s.title)}">${esc(s.title)}</button>`).join("")}</div>`;
}

// Remplit un conteneur avec la réponse : d'abord ce que le site sait, puis le web ou l'IA.
async function answerInto(el, q, { fiche, list }, { history = [], attr = "data-ask", isCurrent = () => true } = {}) {
  const needWeb = q && (list.length < MIN_LOCAL || (!fiche && list.length < 6));
  el.innerHTML = `
    <div class="answer-local">${localAnswer(q, fiche, list)}</div>
    <div class="answer-extra">${needWeb || ASSISTANT_API ? '<p class="loading">Recherche en cours…</p>' : ""}</div>
    ${!needWeb && q && !ASSISTANT_API ? `<button type="button" class="link web-btn">Compléter avec une recherche sur le web</button>` : ""}
    ${seeAlso(fiche, attr)}`;

  const extra = el.querySelector(".answer-extra");
  const runWeb = async () => {
    extra.innerHTML = '<p class="loading">Recherche sur le web…</p>';
    try {
      const web = await wikiSearch(q);
      if (isCurrent()) extra.innerHTML = webBlock(web, q);
    } catch {
      if (isCurrent()) extra.innerHTML = `<p class="web-note">La recherche sur le web n'a pas abouti. Vérifiez votre connexion.</p>`;
    }
  };
  el.querySelector(".web-btn")?.addEventListener("click", (e) => { e.target.remove(); runWeb(); });

  if (ASSISTANT_API && q) {
    try {
      const data = await askAgent(q, fiche, list, history);
      if (!isCurrent()) return;
      extra.innerHTML = agentBlock(data);
      return data.answer;
    } catch {
      // L'agent ne répond pas : on retombe sur la recherche web.
    }
  }
  if (needWeb) await runWeb();
}

// ── Résumé au-dessus des résultats ───────────────────────
let summaryId = 0;
function summaryFiche() {
  if (state.cat !== "all" && FICHE_RUBRIQUE[state.cat]) return FICHE_BY_ID[FICHE_RUBRIQUE[state.cat]];
  if (state.ile !== "all") return FICHE_BY_ID[FICHE_ILE[state.ile]];
  return null;
}

onRender.push(({ fiche, list }) => {
  const box = $("assistant");
  const id = ++summaryId;
  if (state.q) {
    box.hidden = false;
    answerInto($("assistantBody"), state.q, { fiche, list }, { isCurrent: () => id === summaryId });
    return;
  }
  const f = summaryFiche();
  if (!f) { box.hidden = true; return; }
  box.hidden = false;
  $("assistantBody").innerHTML = `<div class="answer-local">${localAnswer("", f, list)}</div>${seeAlso(f, "data-ask")}`;
});

// ── Chat ─────────────────────────────────────────────────
const chatHistory = [];

function openChat(prefill) {
  $("chat").hidden = false;
  $("askOpen").hidden = true;
  if (prefill) sendChat(prefill);
  else $("chatInput").focus();
}

function closeChat() {
  $("chat").hidden = true;
  $("askOpen").hidden = false;
  $("askOpen").focus();
}

async function sendChat(q) {
  q = q.trim();
  if (!q) return;
  $("chatSuggest").hidden = true;
  const log = $("chatLog");
  log.insertAdjacentHTML("beforeend", `<div class="msg user"><p>${esc(q)}</p></div>`);
  const bot = document.createElement("div");
  bot.className = "msg bot";
  log.appendChild(bot);

  const result = searchFor({ cat: "all", ile: "all", freeOnly: false, q });
  const history = chatHistory.slice();
  chatHistory.push({ role: "user", content: q });
  const answer = await answerInto(bot, q, result, { history, attr: "data-chat" });
  chatHistory.push({ role: "assistant", content: answer || (result.fiche ? result.fiche.text.join(" ") : "") });

  if (result.list.length) {
    bot.insertAdjacentHTML("beforeend", `<button type="button" class="link show-all" data-show="${esc(q)}">Voir les ${result.list.length} ressources sur la page</button>`);
  }
  bot.scrollIntoView({ block: "start", behavior: "smooth" });
}

window.addEventListener("DOMContentLoaded", () => {
  $("askOpen").addEventListener("click", () => openChat());
  $("chatClose").addEventListener("click", closeChat);
  $("continueChat").addEventListener("click", () => openChat(state.q || ""));
  $("chat").addEventListener("keydown", (e) => { if (e.key === "Escape") closeChat(); });
  $("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("chatInput").value;
    $("chatInput").value = "";
    sendChat(q);
  });
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-chat]");
    if (c) return sendChat(c.dataset.chat);
    const s = e.target.closest("[data-show]");
    if (s) { closeChat(); setSearch(s.dataset.show); }
  });
});
