// Assistant : il résume une recherche à partir des ressources du site,
// complète avec Wikipédia quand le site n'en dit pas assez,
// et passe par un agent IA si ASSISTANT_API est réglé.

const MIN_LOCAL = 3; // en dessous, l'assistant va chercher sur le web
const webCache = new Map();
const PLACE_WORDS = /comor|moheli|mwali|anjouan|ndzuwani|mayotte|maore|moroni|ngazidja|karthala|mutsamudu|fomboni|mamoudzou/;
const BOX = { s: -13.1, n: -11.3, w: 43.1, e: 45.4 }; // l'archipel
const inBox = (lat, lon) => lat > BOX.s && lat < BOX.n && lon > BOX.w && lon < BOX.e;
const ileAt = (lat, lon) => lon > 44.9 ? "maore" : lon > 44.1 ? "ndzuwani" : lon > 43.55 ? "mwali" : "ngazidja";
const stripTags = (html) => html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");

// Clé de comparaison des noms : sans accents, « ou » = « u » (Moutsamoudou = Mutsamudu).
const nameKey = (s) => normalize(s).replace(/ou/g, "u").replace(/[^a-z]/g, "");

// ── Localités connues du site (GeoNames + lieux de la carte) ─
const GAZETTEER = [
  ...LOCALITES.map(([name, ile, lat, lon, pop]) => ({ name, ile, lat, lon, pop, source: "GeoNames" })),
  ...PLACES.map((p) => ({ name: p.name, ile: p.ile, lat: p.lat, lon: p.lng, note: p.note, source: "carte du site" })),
].map((g) => ({ ...g, key: nameKey(g.name) }));

function findLocality(q) {
  const words = normalize(q).split(/[^a-z0-9']+/).filter(Boolean);
  const keys = new Set();
  for (let i = 0; i < words.length; i++) {
    keys.add(nameKey(words[i]));
    if (words[i + 1]) keys.add(nameKey(words[i] + words[i + 1]));
    if (words[i + 2]) keys.add(nameKey(words[i] + words[i + 1] + words[i + 2]));
  }
  return GAZETTEER.find((g) => g.key.length >= 4 && keys.has(g.key)) || null;
}

// ── Sources du web, gratuites et sans clé ────────────────
async function getJSON(url, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
const api = (host, params) => `https://${host}/w/api.php?` + new URLSearchParams({ format: "json", origin: "*", ...params });

// Articles Wikipédia : en français d'abord, puis en anglais.
async function wikiArticles(words) {
  const biased = PLACE_WORDS.test(normalize(words)) ? words : words + " Comores";
  for (const [lang, query] of [["fr", biased], ["en", words + " Comoros"]]) {
    const data = await getJSON(api(`${lang}.wikipedia.org`, {
      action: "query", generator: "search", gsrsearch: query, gsrlimit: "5",
      prop: "extracts|info", exintro: "1", explaintext: "1", exsentences: "6", inprop: "url",
    }));
    const pages = Object.values(data?.query?.pages || {}).filter((p) => p.extract).sort((a, b) => a.index - b.index);
    if (pages.length) return { lang, pages };
  }
  return null;
}

// Passages de Wikipédia qui citent le nom (utile pour les villages sans article).
async function wikiMentions(words) {
  const data = await getJSON(api("fr.wikipedia.org", {
    action: "query", list: "search", srsearch: `"${words}" Comores`, srlimit: "6", srprop: "snippet",
  }));
  return (data?.query?.search || []).map((r) => ({
    title: r.title, snippet: stripTags(r.snippet),
    url: "https://fr.wikipedia.org/wiki/" + encodeURIComponent(r.title.replace(/ /g, "_")),
  }));
}

// Wikidata : villages, montagnes, personnes… liés aux Comores, avec leurs coordonnées.
async function wikidataItems(words) {
  const found = await getJSON(api("www.wikidata.org", { action: "wbsearchentities", search: words, language: "fr", uselang: "fr", type: "item", limit: "8" }));
  const ids = (found?.search || []).map((x) => x.id);
  if (!ids.length) return [];
  const data = await getJSON(api("www.wikidata.org", { action: "wbgetentities", ids: ids.join("|"), props: "labels|descriptions|claims|sitelinks", languages: "fr|en" }));
  const COMOROS = "Q970", MAYOTTE = "Q17063";
  const items = [];
  for (const id of ids) {
    const e = data?.entities?.[id];
    if (!e) continue;
    const claim = (p) => (e.claims?.[p] || []).map((c) => c.mainsnak?.datavalue?.value).filter(Boolean);
    const coord = claim("P625")[0];
    const refs = [...claim("P17"), ...claim("P27"), ...claim("P131"), ...claim("P19")].map((v) => v.id);
    const desc = e.descriptions?.fr?.value || e.descriptions?.en?.value || "";
    const linked = refs.includes(COMOROS) || refs.includes(MAYOTTE) || /comor|mayott|anjouan|moh[eé]li/i.test(desc) ||
      (coord && inBox(coord.latitude, coord.longitude));
    if (!linked) continue;
    const frwiki = e.sitelinks?.frwiki?.title;
    items.push({
      label: e.labels?.fr?.value || e.labels?.en?.value || id,
      desc,
      lat: coord?.latitude, lon: coord?.longitude,
      url: frwiki ? "https://fr.wikipedia.org/wiki/" + encodeURIComponent(frwiki.replace(/ /g, "_")) : "https://www.wikidata.org/wiki/" + id,
    });
  }
  return items;
}

// OpenStreetMap (Nominatim) : tous les lieux nommés de l'archipel, même les plus petits.
const OSM_TYPES = { village: "village", town: "ville", city: "ville", hamlet: "hameau", peak: "sommet", volcano: "volcan",
  beach: "plage", bay: "baie", water: "lac", lake: "lac", island: "île", islet: "îlot", place_of_worship: "lieu de culte",
  restaurant: "restaurant", hotel: "hôtel", school: "école", suburb: "quartier", neighbourhood: "quartier", waterfall: "cascade" };
async function osmPlaces(words) {
  const data = await getJSON("https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
    q: words, countrycodes: "km,yt", format: "jsonv2", limit: "5", "accept-language": "fr",
  }));
  return (data || []).map((r) => ({
    name: r.name || r.display_name.split(",")[0],
    where: r.display_name,
    kind: OSM_TYPES[r.type] || r.type?.replace(/_/g, " ") || "",
    lat: +r.lat, lon: +r.lon,
  }));
}

async function webSearch(q) {
  const key = normalize(q);
  if (webCache.has(key)) return webCache.get(key);
  const words = terms(q).join(" ") || q;
  const [articles, mentions, wikidata, osm] = await Promise.all([
    wikiArticles(words), wikiMentions(words), wikidataItems(words), osmPlaces(words),
  ]);
  // Un article n'est retenu que s'il parle vraiment des mots cherchés.
  const wkeys = terms(q);
  const relevant = (text) => { const n = normalize(text); return wkeys.some((w) => n.includes(w)); };
  const pages = (articles?.pages || []).filter((p) => relevant(p.title + " " + p.extract));
  const result = {
    lang: articles?.lang,
    pages,
    mentions: mentions.filter((m) => !pages.some((p) => p.title === m.title)).slice(0, 4),
    wikidata: wikidata.slice(0, 4),
    osm,
  };
  webCache.set(key, result);
  return result;
}

// ── Affichage des résultats du web ───────────────────────
function mapButton(lat, lon, name, sub) {
  return `<button type="button" class="link map-btn" data-map="${lat},${lon}" data-name="${esc(name)}" data-sub="${esc(sub)}">Voir sur la carte</button>`;
}

function placeBlock(loc, osm, wikidata) {
  let p = null;
  if (loc) p = { name: loc.name, lat: loc.lat, lon: loc.lon, sub: `${ileLabel(loc.ile)}${loc.pop ? ` · environ ${loc.pop.toLocaleString("fr-FR")} habitants` : ""}`, note: loc.note, source: loc.source };
  else if (osm[0]) p = { name: osm[0].name, lat: osm[0].lat, lon: osm[0].lon, sub: `${osm[0].kind ? osm[0].kind + " · " : ""}${ileLabel(ileAt(osm[0].lat, osm[0].lon))}`, note: osm[0].where, source: "OpenStreetMap" };
  else {
    const w = wikidata.find((x) => x.lat && inBox(x.lat, x.lon));
    if (w) p = { name: w.label, lat: w.lat, lon: w.lon, sub: `${w.desc} · ${ileLabel(ileAt(w.lat, w.lon))}`, source: "Wikidata" };
  }
  if (!p) return "";
  return `
    <div class="place-found">
      <p class="web-label">Lieu trouvé · ${esc(p.source)}</p>
      <h4>${esc(p.name)}</h4>
      <p class="answer-meta">${esc(p.sub)}</p>
      ${p.note ? `<p class="web-more">${esc(p.note)}</p>` : ""}
      <p>${mapButton(p.lat, p.lon, p.name, p.sub)} · <a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}" target="_blank" rel="noopener">Google Maps</a></p>
    </div>`;
}

function webBlock(web, q, loc) {
  const google = `https://www.google.com/search?q=${encodeURIComponent(q + " Comores")}`;
  const links = `<p class="web-links">Aller plus loin : <a href="${google}" target="_blank" rel="noopener">Google</a> ·
    <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q + " Comores")}" target="_blank" rel="noopener">images</a> ·
    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(q + " Comores")}" target="_blank" rel="noopener">vidéos YouTube</a></p>`;
  const place = placeBlock(loc, web?.osm || [], web?.wikidata || []);
  if (!web || (!web.pages.length && !web.mentions.length && !web.wikidata.length && !web.osm.length)) {
    return `${place}<div class="web-block"><p class="web-label">Recherche sur le web</p>
      <p>Wikipédia, Wikidata et OpenStreetMap ne donnent rien sur ce nom. Vérifiez l'orthographe ou essayez une autre graphie (ou/u, dj/j…).</p>${links}</div>`;
  }
  const [first, ...others] = web.pages;
  let html = place + `<div class="web-block"><p class="web-label">Trouvé sur le web</p>`;
  if (first) {
    html += `
      <h4><a href="${esc(first.fullurl)}" target="_blank" rel="noopener">${esc(first.title)}</a> <span class="answer-meta">Wikipédia${web.lang === "en" ? " (anglais)" : ""}</span></h4>
      ${first.extract.split(/\n+/).filter(Boolean).slice(0, 3).map((p) => `<p>${esc(p)}</p>`).join("")}`;
    if (others.length) html += `<p class="web-more">Autres articles : ${others.map((p) => `<a href="${esc(p.fullurl)}" target="_blank" rel="noopener">${esc(p.title)}</a>`).join(", ")}</p>`;
  }
  if (web.wikidata.length) {
    html += `<p class="answer-sub">Fiches Wikidata</p><ul class="answer-list">${web.wikidata.map((w) => `
      <li><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.label)}</a>${w.desc ? ` : ${esc(w.desc)}` : ""}
        ${w.lat && inBox(w.lat, w.lon) ? " · " + mapButton(w.lat, w.lon, w.label, w.desc) : ""}</li>`).join("")}</ul>`;
  }
  if (web.mentions.length) {
    html += `<p class="answer-sub">Cité dans Wikipédia</p><ul class="answer-list">${web.mentions.map((m) => `
      <li><a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.title)}</a> : « … ${esc(m.snippet)} … »</li>`).join("")}</ul>`;
  }
  if (web.osm.length > 1) {
    html += `<p class="answer-sub">Sur OpenStreetMap</p><ul class="answer-list">${web.osm.slice(0, 4).map((o) => `
      <li>${esc(o.name)}${o.kind ? ` (${esc(o.kind)})` : ""} · ${mapButton(o.lat, o.lon, o.name, o.where)}</li>`).join("")}</ul>`;
  }
  html += `<p class="web-note">Ces informations viennent du web (Wikipédia, Wikidata, OpenStreetMap), pas des ressources du site : vérifiez-les.</p>${links}</div>`;
  return html;
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
// « explicit » : la question a été validée (Entrée, bouton, chat). Sinon, pas d'appel au web
// pendant la frappe (les services gratuits demandent de ne pas les interroger à chaque lettre).
async function answerInto(el, q, { fiche, list }, { history = [], attr = "data-ask", isCurrent = () => true, explicit = true } = {}) {
  const loc = q ? findLocality(q) : null;
  const wantWeb = q && (list.length < MIN_LOCAL || (!fiche && list.length < 6) || loc);
  const autoWeb = explicit && wantWeb;
  el.innerHTML = `
    <div class="answer-local">${localAnswer(q, fiche, list)}</div>
    <div class="answer-extra">${autoWeb || (ASSISTANT_API && explicit) ? '<p class="loading">Recherche en cours…</p>' : loc ? placeBlock(loc, [], []) : ""}</div>
    ${q && !autoWeb && !(ASSISTANT_API && explicit) ? `<button type="button" class="link web-btn">Chercher aussi sur le web</button>` : ""}
    ${seeAlso(fiche, attr)}`;

  const extra = el.querySelector(".answer-extra");
  const runWeb = async () => {
    extra.innerHTML = '<p class="loading">Recherche sur Wikipédia, Wikidata et OpenStreetMap…</p>';
    const web = await webSearch(q);
    if (isCurrent()) extra.innerHTML = webBlock(web, q, loc);
  };
  el.querySelector(".web-btn")?.addEventListener("click", (e) => { e.target.remove(); runWeb(); });

  if (ASSISTANT_API && q && explicit) {
    try {
      const data = await askAgent(q, fiche, list, history);
      if (!isCurrent()) return;
      extra.innerHTML = placeBlock(loc, [], []) + agentBlock(data);
      return data.answer;
    } catch {
      // L'agent ne répond pas : on retombe sur la recherche web.
    }
  }
  if (autoWeb) await runWeb();
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
    answerInto($("assistantBody"), state.q, { fiche, list }, { isCurrent: () => id === summaryId, explicit: state.q === submittedQuery });
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
    const m = e.target.closest("[data-map]");
    if (m) {
      const [lat, lon] = m.dataset.map.split(",").map(Number);
      if (!$("chat").hidden && window.innerWidth < 700) closeChat();
      return showOnMap(lat, lon, m.dataset.name, m.dataset.sub);
    }
    const c = e.target.closest("[data-chat]");
    if (c) return sendChat(c.dataset.chat);
    const s = e.target.closest("[data-show]");
    if (s) { closeChat(); setSearch(s.dataset.show); }
  });
});
