/**
 * Agent IA de « Apprendre les Comores » — Cloudflare Worker (offre gratuite).
 *
 * Le site lui envoie : { question, history, fiche, ressources: [{ titre, details, description, lien }] }
 * Il répond : { answer, web: [{ title, url }] }
 *
 * Fonctionnement :
 * 1. il lit les ressources du site trouvées pour la question ;
 * 2. si elles sont peu nombreuses, il cherche sur Wikipédia (français, puis anglais) ;
 * 3. il demande à un modèle de langage (Workers AI) de rédiger un résumé en français,
 *    en distinguant ce qui vient du site et ce qui vient du web.
 *
 * Mise en place : voir outils/assistant-ia.md
 */

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const ALLOWED_ORIGINS = ["https://hitman-987.github.io"];
const MAX_QUESTION = 400;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Utilisez POST." }, 405, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Requête illisible." }, 400, cors); }
    const question = String(body.question || "").slice(0, MAX_QUESTION).trim();
    if (!question) return json({ error: "Question vide." }, 400, cors);
    const ressources = Array.isArray(body.ressources) ? body.ressources.slice(0, 12) : [];
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    const fiche = String(body.fiche || "").slice(0, 3000);

    const web = ressources.length < 3 || !fiche ? await wikiSearch(question) : [];

    const context = [
      fiche && `FICHE DU SITE :\n${fiche}`,
      ressources.length && `RESSOURCES DU SITE :\n${ressources.map((r, i) => `[S${i + 1}] ${r.titre} (${r.details}) : ${r.description}`).join("\n")}`,
      web.length && `RÉSULTATS DU WEB (Wikipédia) :\n${web.map((w, i) => `[W${i + 1}] ${w.title} : ${w.extract}`).join("\n")}`,
    ].filter(Boolean).join("\n\n");

    const messages = [
      {
        role: "system",
        content:
          "Tu es l'assistant du site « Apprendre les Comores ». Réponds en français, de façon claire et factuelle, " +
          "en 2 à 4 paragraphes courts. Appuie-toi d'abord sur la fiche et les ressources du site. " +
          "Si tu utilises les résultats du web, commence la phrase par « D'après le web, ». " +
          "N'invente rien : si les informations manquent, dis-le simplement. Pas de listes à puces, pas de titres.",
      },
      ...history.filter((m) => m && (m.role === "user" || m.role === "assistant")).map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) })),
      { role: "user", content: `${context || "Aucune information sur le site."}\n\nQUESTION : ${question}` },
    ];

    try {
      const out = await env.AI.run(MODEL, { messages, max_tokens: 700, temperature: 0.3 });
      const answer = (out.response || "").trim();
      return json({ answer, web: web.map(({ title, url }) => ({ title, url })) }, 200, cors);
    } catch (e) {
      return json({ error: "Le modèle n'a pas répondu." }, 502, cors);
    }
  },
};

async function wikiSearch(question) {
  const tries = [["fr", question + " Comores"], ["fr", question], ["en", question + " Comoros"]];
  for (const [lang, q] of tries) {
    const url = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action: "query", format: "json", generator: "search", gsrsearch: q, gsrlimit: "3",
      prop: "extracts|info", exintro: "1", explaintext: "1", exsentences: "6", inprop: "url",
    });
    try {
      const res = await fetch(url, { headers: { "User-Agent": "ApprendreLesComores/1.0 (assistant)" } });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {}).filter((p) => p.extract).sort((a, b) => a.index - b.index);
      if (pages.length) return pages.map((p) => ({ title: p.title, url: p.fullurl, extract: p.extract.slice(0, 1200) }));
    } catch {
      // On essaie la recherche suivante.
    }
  }
  return [];
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
}
