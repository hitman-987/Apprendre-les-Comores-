// Interface : préférences d'affichage (thème, texte, dyslexie…), navigation,
// retour en haut de page et animations.

const root = document.documentElement;
const DYS_CSS = "https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic@5.2.5/";
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const prefersCalm = matchMedia("(prefers-reduced-motion: reduce)");
const calm = () => root.classList.contains("calm") || prefersCalm.matches;

// ── Préférences d'affichage ─────────────────────────────
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem("affichage") || "{}"); } catch { return {}; }
}
function savePrefs(p) {
  try { localStorage.setItem("affichage", JSON.stringify(p)); } catch {}
}

function loadDyslexicFont() {
  if (document.getElementById("dysFont")) return;
  for (const w of ["400", "700"]) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = DYS_CSS + `latin-${w}.css`;
    if (w === "400") l.id = "dysFont";
    document.head.appendChild(l);
  }
}

function applyPrefs(p) {
  if (p.theme === "light" || p.theme === "dark") root.dataset.theme = p.theme;
  else delete root.dataset.theme;
  if (p.text) root.dataset.text = p.text; else delete root.dataset.text;
  for (const k of ["dys", "spacing", "contrast", "calm"]) root.classList.toggle(k, !!p[k]);
  if (p.dys) loadDyslexicFont();
  updateThemeButton();
}

const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : prefersDark.matches;

function updateThemeButton() {
  const btn = $("themeToggle");
  if (!btn) return;
  const dark = isDark();
  btn.classList.toggle("is-dark", dark);
  btn.setAttribute("aria-label", dark ? "Passer en mode clair" : "Passer en mode sombre");
  btn.title = btn.getAttribute("aria-label");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0d1615" : "#0b5f5c");
}

function setupPrefs() {
  let prefs = loadPrefs();
  applyPrefs(prefs);
  const panel = $("a11yPanel");

  const syncForm = () => {
    panel.querySelector(`input[name="theme"][value="${prefs.theme || "auto"}"]`).checked = true;
    panel.querySelector(`input[name="text"][value="${prefs.text || ""}"]`).checked = true;
    for (const k of ["dys", "spacing", "contrast", "calm"]) panel.querySelector(`input[name="${k}"]`).checked = !!prefs[k];
  };
  syncForm();

  panel.addEventListener("change", (e) => {
    const { name, value, checked, type } = e.target;
    prefs = { ...prefs, [name]: type === "checkbox" ? checked : value };
    if (prefs.theme === "auto") delete prefs.theme;
    savePrefs(prefs);
    applyPrefs(prefs);
  });

  $("themeToggle").addEventListener("click", () => {
    prefs = { ...prefs, theme: isDark() ? "light" : "dark" };
    savePrefs(prefs);
    applyPrefs(prefs);
    syncForm();
  });

  $("a11yReset").addEventListener("click", () => {
    prefs = {};
    savePrefs(prefs);
    applyPrefs(prefs);
    syncForm();
  });

  const open = () => { panel.hidden = false; $("a11yOpen").setAttribute("aria-expanded", "true"); panel.querySelector("input:checked")?.focus(); };
  const close = () => { panel.hidden = true; $("a11yOpen").setAttribute("aria-expanded", "false"); $("a11yOpen").focus(); };
  $("a11yOpen").setAttribute("aria-expanded", "false");
  $("a11yOpen").addEventListener("click", () => (panel.hidden ? open() : close()));
  $("a11yClose").addEventListener("click", close);
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !e.target.closest("#a11yOpen")) close();
  });

  prefersDark.addEventListener("change", updateThemeButton);
}

// ── Navigation ──────────────────────────────────────────
// Le site s'ouvre toujours en haut de page, même après un rechargement.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function goTo(id) {
  const target = id === "top" ? document.body : $(id);
  if (!target) return;
  const behavior = calm() ? "auto" : "smooth";
  if (id === "top") window.scrollTo({ top: 0, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
  // Le focus suit, pour les lecteurs d'écran et le clavier.
  const focusable = id === "top" ? $("q") : target.querySelector("h2, h1");
  if (focusable) {
    if (!focusable.matches("input")) focusable.setAttribute("tabindex", "-1");
    focusable.focus({ preventScroll: true });
  }
}

function setupNav() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-goto]");
    if (!a) return;
    e.preventDefault();
    goTo(a.dataset.goto);
  });

  // Bouton « haut de page » : il apparaît après un peu de défilement.
  const toTop = $("toTop");
  const onScroll = () => { toTop.hidden = window.scrollY < 600; };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => goTo("top"));

  // Lien actif dans la barre de navigation.
  const links = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      links.forEach((l) => l.toggleAttribute("aria-current", l.dataset.goto === en.target.id));
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  for (const l of links) { const t = $(l.dataset.goto); if (t) spy.observe(t); }
}

// ── Animations ──────────────────────────────────────────
function countUp(el, to) {
  if (calm()) { el.textContent = to; return; }
  const start = performance.now(), dur = 900;
  const step = (now) => {
    const k = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setupStats() {
  const stats = [
    [RESOURCES.length, "ressources"],
    [RESOURCES.filter((r) => r.free).length, "gratuites"],
    [PLACES.length + LOCALITES.length, "lieux reconnus"],
    [Object.keys(CATEGORIES).length, "rubriques"],
  ];
  $("stats").innerHTML = stats.map(([n, label]) => `<li><strong data-n="${n}">${n}</strong> ${label}</li>`).join("");
  $("stats").querySelectorAll("strong").forEach((el) => countUp(el, +el.dataset.n));
}

// Exemples qui défilent dans la barre de recherche, tant qu'elle est vide et sans le focus.
function setupPlaceholder() {
  const input = $("q");
  const examples = ["Essayez : Karthala", "Essayez : Djoumbé Fatima", "Essayez : un nom de village", "Essayez : le twarab", "Essayez : recette du mataba", "Essayez : plages de Mohéli"];
  let i = 0;
  setInterval(() => {
    if (calm() || document.activeElement === input || input.value) return;
    i = (i + 1) % examples.length;
    input.placeholder = examples[i];
  }, 3200);
}

// Les sections glissent doucement à leur arrivée à l'écran.
function setupReveal() {
  const els = document.querySelectorAll(".map-section, .picks, .today, .contribute, footer");
  els.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach((el) => io.observe(el));
}

window.addEventListener("DOMContentLoaded", () => {
  // Une ancre laissée dans l'adresse (#proposer…) ne doit pas ouvrir la page en bas.
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  // Sauf pour un lien de recherche (?q=…), qui descend vers les résultats.
  if (!new URLSearchParams(location.search).has("q")) window.scrollTo(0, 0);
  setupPrefs();
  setupNav();
  setupStats();
  setupPlaceholder();
  setupReveal();
});
