// Carte interactive : fonds de carte libres (plan, satellite, relief) et repères des ressources.

const ISLAND_COLORS = { ngazidja: "#2a5db0", mwali: "#e3ad1c", ndzuwani: "#d2232a", maore: "#ffffff" };

// Ressources rattachées à chaque lieu (même île ou tout l'archipel, et nom du lieu cité).
for (const p of PLACES) {
  p.resources = RESOURCES.filter((r) => (r.ile === p.ile || r.ile === "archipel") && p.match.some((m) => r.hay.includes(m)));
}
const PLACED = new Set(PLACES.flatMap((p) => p.resources));

let map, markerLayer, lastIle = null;

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/";
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function baseLayers() {
  // Plan : la carte OpenStreetMap, la plus détaillée pour les villages comoriens.
  const plan = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: OSM_ATTR });
  // Plan de secours si OpenStreetMap ne répond pas.
  const planEsri = L.tileLayer(ESRI + "World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19, attribution: "&copy; Esri, HERE, Garmin, OpenStreetMap",
  });
  // Satellite, avec par-dessus les routes et les noms de lieux.
  const satellite = L.layerGroup([
    L.tileLayer(ESRI + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Images &copy; Esri, Maxar, Earthstar Geographics" }),
    L.tileLayer(ESRI + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }),
    L.tileLayer(ESRI + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }),
  ]);
  const relief = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17, attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA), ' + OSM_ATTR,
  });
  return { "Plan": plan, "Plan (Esri)": planEsri, "Satellite": satellite, "Relief": relief };
}

// Si le plan OpenStreetMap ne se charge pas, on passe sur le plan Esri.
function watchPlan(layers) {
  let loaded = 0, failed = 0;
  layers["Plan"].on("tileload", () => loaded++);
  layers["Plan"].on("tileerror", () => {
    failed++;
    if (failed >= 4 && loaded === 0 && map.hasLayer(layers["Plan"])) {
      map.removeLayer(layers["Plan"]);
      layers["Plan (Esri)"].addTo(map);
    }
  });
}

function markerIcon(color, count, big) {
  const size = big ? 40 : count > 9 ? 34 : 30;
  return L.divIcon({
    className: "pin-wrap",
    html: `<span class="pin${big ? " pin-island" : ""}" style="--pin:${color}">${count}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function popupHtml(title, sub, note, items, q) {
  const shown = items.slice(0, 6);
  return `
    <div class="popup">
      <p class="popup-sub">${esc(sub)}</p>
      <h3>${esc(title)}</h3>
      ${note ? `<p class="popup-note">${esc(note)}</p>` : ""}
      <ul>${shown.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a></li>`).join("")}</ul>
      ${items.length > shown.length ? `<p class="popup-note">et ${items.length - shown.length} autre${items.length - shown.length > 1 ? "s" : ""}</p>` : ""}
      <button type="button" class="link" data-ask="${esc(q)}">Voir le résumé et les ressources</button>
    </div>`;
}

function drawMarkers(list) {
  markerLayer.clearLayers();
  const visible = new Set(list);

  const onIsland = (ile) => state.ile === "all" || state.ile === ile;

  for (const p of PLACES) {
    if (!onIsland(p.ile)) continue;
    const items = p.resources.filter((r) => visible.has(r));
    if (!items.length) continue;
    L.marker([p.lat, p.lng], { icon: markerIcon(ISLAND_COLORS[p.ile], items.length), title: p.name, alt: p.name, keyboard: true })
      .bindPopup(popupHtml(p.name, ileLabel(p.ile), p.note, items, p.name), { maxWidth: 300 })
      .addTo(markerLayer);
  }

  // Ressources d'une île sans lieu précis : un repère au centre de l'île.
  for (const [ile, view] of Object.entries(ISLAND_VIEW)) {
    if (!onIsland(ile)) continue;
    const items = list.filter((r) => r.ile === ile && !PLACED.has(r));
    if (!items.length) continue;
    const name = `${ILES[ile].nom} (${ILES[ile].fr})`;
    L.marker(view.center, { icon: markerIcon(ISLAND_COLORS[ile], items.length, true), title: name, alt: name, keyboard: true, zIndexOffset: -100 })
      .bindPopup(popupHtml(name, "Toute l'île", "Ressources sur l'île en général.", items, ILES[ile].fr), { maxWidth: 300 })
      .addTo(markerLayer);
  }
}

function fitIsland(ile) {
  if (ile === lastIle) return;
  lastIle = ile;
  map.flyToBounds(ile === "all" ? ARCHIPEL_BOUNDS : ISLAND_VIEW[ile].bounds, { padding: [20, 20], duration: 0.8 });
}

// Bouton plein écran (agrandit la carte dans la page).
const FullscreenControl = L.Control?.extend({
  options: { position: "topleft" },
  onAdd() {
    const btn = L.DomUtil.create("button", "map-full");
    btn.type = "button";
    btn.title = "Agrandir la carte";
    btn.setAttribute("aria-label", "Agrandir la carte");
    btn.innerHTML = "⤢";
    L.DomEvent.disableClickPropagation(btn);
    btn.addEventListener("click", () => {
      const on = $("mapFrame").classList.toggle("is-full");
      document.body.classList.toggle("map-open", on);
      btn.title = on ? "Réduire la carte" : "Agrandir la carte";
      btn.setAttribute("aria-label", btn.title);
      setTimeout(() => map.invalidateSize(), 50);
    });
    return btn;
  },
});

function setupMap() {
  if (!window.L) {
    $("mapMsg").textContent = "La carte n'a pas pu se charger. Vérifiez votre connexion puis rechargez la page.";
    $("mapMsg").hidden = false;
    return;
  }
  const layers = baseLayers();
  map = L.map("map", { zoomControl: true, scrollWheelZoom: false, worldCopyJump: false, minZoom: 7 });
  layers["Plan"].addTo(map);
  watchPlan(layers);
  L.control.layers(layers, null, { position: "topright" }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  new FullscreenControl().addTo(map);
  map.fitBounds(ARCHIPEL_BOUNDS);
  lastIle = "all";

  // La molette ne zoome qu'après un clic dans la carte, pour ne pas gêner le défilement de la page.
  map.on("click focus", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());

  // Prévenir seulement si aucun fond ne se charge (par exemple sans connexion).
  let anyTile = false, errors = 0;
  map.on("layeradd", (e) => {
    if (!e.layer.on || !e.layer.getTileUrl) return;
    e.layer.on("tileload", () => { anyTile = true; $("mapMsg").hidden = true; });
    e.layer.on("tileerror", () => {
      if (anyTile || ++errors < 12) return;
      $("mapMsg").textContent = "Le fond de carte ne se charge pas. Les repères restent utilisables ; essayez un autre fond avec le bouton en haut à droite.";
      $("mapMsg").hidden = false;
    });
  });

  markerLayer = L.layerGroup().addTo(map);
  drawMarkers(searchFor(state).list);
}

window.addEventListener("DOMContentLoaded", setupMap);
onRender.push(({ list }) => {
  if (!map) return;
  drawMarkers(list);
  fitIsland(state.ile);
});

// Un lieu trouvé par l'assistant (localité, recherche OpenStreetMap ou Wikidata) : repère temporaire.
let foundMarker = null;
function showOnMap(lat, lon, name, sub) {
  if (!map) return;
  if (foundMarker) foundMarker.remove();
  foundMarker = L.marker([lat, lon], {
    icon: L.divIcon({ className: "pin-wrap", html: '<span class="pin pin-found">★</span>', iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -17] }),
    title: name, alt: name, zIndexOffset: 1000,
  }).addTo(map).bindPopup(`<div class="popup"><p class="popup-sub">${esc(sub)}</p><h3>${esc(name)}</h3>
    <p class="popup-note"><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></p></div>`);
  $("carte").scrollIntoView({ behavior: "smooth" });
  map.flyTo([lat, lon], 14, { duration: 1 });
  setTimeout(() => foundMarker && foundMarker.openPopup(), 1100);
}
