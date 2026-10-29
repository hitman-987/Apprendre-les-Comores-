// Carte interactive : fonds de carte libres (plan, satellite, relief) et repères des ressources.

const ISLAND_COLORS = { ngazidja: "#2a5db0", mwali: "#e3ad1c", ndzuwani: "#d2232a", maore: "#ffffff" };

// Ressources rattachées à chaque lieu (même île ou tout l'archipel, et nom du lieu cité).
for (const p of PLACES) {
  p.resources = RESOURCES.filter((r) => (r.ile === p.ile || r.ile === "archipel") && p.match.some((m) => r.hay.includes(m)));
}
const PLACED = new Set(PLACES.flatMap((p) => p.resources));

let map, markerLayer, lastIle = null;

function baseLayers() {
  const carto = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 19, subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  });
  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  const satellite = L.layerGroup([
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Images &copy; Esri, Maxar, Earthstar Geographics",
    }),
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19, subdomains: "abcd", attribution: "&copy; CARTO",
    }),
  ]);
  const relief = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17, attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
  });
  return { "Plan": carto, "Satellite": satellite, "Relief": relief, "OpenStreetMap": osm };
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
  L.control.layers(layers, null, { position: "topright" }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  new FullscreenControl().addTo(map);
  map.fitBounds(ARCHIPEL_BOUNDS);
  lastIle = "all";

  // La molette ne zoome qu'après un clic dans la carte, pour ne pas gêner le défilement de la page.
  map.on("click focus", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());

  let warned = false;
  map.on("tileerror", () => {
    if (warned) return;
    warned = true;
    $("mapMsg").textContent = "Le fond de carte ne se charge pas ici. Les repères restent utilisables ; essayez un autre fond avec le bouton en haut à droite.";
    $("mapMsg").hidden = false;
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
