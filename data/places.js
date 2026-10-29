// Lieux affichés sur la carte. Les positions sont approximatives (à quelques kilomètres près).
// Une ressource est rattachée à un lieu quand son titre, sa description ou ses détails
// contiennent l'un des mots de « match » (sans accents) et qu'elle concerne la même île.
//   ile   : ngazidja | mwali | ndzuwani | maore
//   kind  : ville | nature | plage | patrimoine

const PLACES = [
  // Ngazidja
  { id: "moroni", name: "Moroni", ile: "ngazidja", lat: -11.702, lng: 43.255, kind: "ville",
    note: "Capitale de l'Union des Comores, médina et vieux port.", match: ["moroni"] },
  { id: "itsandra", name: "Itsandra", ile: "ngazidja", lat: -11.665, lng: 43.262, kind: "plage",
    note: "Plage et ancienne cité royale au nord de Moroni.", match: ["itsandra"] },
  { id: "iconi", name: "Iconi", ile: "ngazidja", lat: -11.765, lng: 43.243, kind: "patrimoine",
    note: "Ancienne capitale de sultanat au sud de Moroni.", match: ["iconi"] },
  { id: "karthala", name: "Karthala", ile: "ngazidja", lat: -11.75, lng: 43.38, kind: "nature",
    note: "Volcan actif, 2 361 m, et sa caldeira.", match: ["karthala"] },
  { id: "mitsamiouli", name: "Mitsamiouli et Maloudja", ile: "ngazidja", lat: -11.38, lng: 43.295, kind: "plage",
    note: "Les plages du nord : Maloudja, Galawa, le Trou du Prophète.", match: ["mitsamiouli", "maloudja", "galawa", "trou du prophete"] },
  { id: "lac-sale", name: "Lac Salé", ile: "ngazidja", lat: -11.378, lng: 43.375, kind: "nature",
    note: "Lac d'eau salée dans un ancien cratère, au nord de l'île.", match: ["lac sale"] },
  { id: "hahaya", name: "Hahaya", ile: "ngazidja", lat: -11.534, lng: 43.272, kind: "ville",
    note: "Village de l'aéroport international.", match: ["hahaya"] },

  // Mwali
  { id: "fomboni", name: "Fomboni", ile: "mwali", lat: -12.28, lng: 43.742, kind: "ville",
    note: "Capitale de Mohéli.", match: ["fomboni"] },
  { id: "nioumachoua", name: "Nioumachoua", ile: "mwali", lat: -12.365, lng: 43.714, kind: "plage",
    note: "Plages, îlots et cœur du parc marin.", match: ["nioumachoua", "laka lodge"] },
  { id: "itsamia", name: "Itsamia", ile: "mwali", lat: -12.37, lng: 43.86, kind: "nature",
    note: "Plages de ponte des tortues vertes.", match: ["itsamia"] },

  // Ndzuwani
  { id: "mutsamudu", name: "Mutsamudu", ile: "ndzuwani", lat: -12.168, lng: 44.399, kind: "patrimoine",
    note: "Capitale d'Anjouan, médina et citadelle.", match: ["mutsamudu"] },
  { id: "domoni", name: "Domoni", ile: "ndzuwani", lat: -12.257, lng: 44.53, kind: "patrimoine",
    note: "Vieille cité de pierre ; c'est au large que fut pêché le cœlacanthe en 1952.", match: ["domoni"] },
  { id: "dzialandze", name: "Lac Dzialandzé", ile: "ndzuwani", lat: -12.226, lng: 44.437, kind: "nature",
    note: "Lac de cratère à environ 900 m d'altitude.", match: ["dzialandze"] },
  { id: "ntingui", name: "Mont Ntingui", ile: "ndzuwani", lat: -12.2, lng: 44.415, kind: "nature",
    note: "Sommet d'Anjouan, environ 1 575 m.", match: ["ntingui"] },
  { id: "moya-anjouan", name: "Moya", ile: "ndzuwani", lat: -12.305, lng: 44.44, kind: "plage",
    note: "La plage la plus appréciée d'Anjouan.", match: ["moya"] },

  // Maore
  { id: "mamoudzou", name: "Mamoudzou", ile: "maore", lat: -12.781, lng: 45.228, kind: "ville",
    note: "Principale ville de Mayotte.", match: ["mamoudzou"] },
  { id: "dzaoudzi", name: "Dzaoudzi", ile: "maore", lat: -12.788, lng: 45.282, kind: "patrimoine",
    note: "Ancienne capitale sur Petite-Terre, musée de Mayotte (MuMa).", match: ["dzaoudzi", "muma", "petite-terre"] },
  { id: "dziani-dzaha", name: "Lac Dziani Dzaha", ile: "maore", lat: -12.772, lng: 45.293, kind: "nature",
    note: "Lac de cratère vert émeraude sur Petite-Terre.", match: ["dziani"] },
  { id: "moya-mayotte", name: "Plage de Moya", ile: "maore", lat: -12.795, lng: 45.3, kind: "plage",
    note: "Plage de ponte des tortues sur Petite-Terre.", match: ["moya"] },
  { id: "choungui", name: "Mont Choungui", ile: "maore", lat: -12.955, lng: 45.135, kind: "nature",
    note: "Le sommet emblématique de Mayotte, 594 m.", match: ["choungui"] },
  { id: "saziley", name: "Saziley", ile: "maore", lat: -12.98, lng: 45.2, kind: "plage",
    note: "Pointe sauvage, plages et snorkeling.", match: ["saziley"] },
  { id: "ngouja", name: "N'Gouja", ile: "maore", lat: -12.963, lng: 45.083, kind: "plage",
    note: "Plage réputée pour les tortues qui viennent brouter.", match: ["n'gouja", "ngouja"] },
];

// Centre et étendue de chaque île, pour zoomer et pour les ressources sans lieu précis.
const ISLAND_VIEW = {
  ngazidja: { center: [-11.62, 43.36], bounds: [[-11.96, 43.2], [-11.35, 43.52]] },
  mwali: { center: [-12.31, 43.66], bounds: [[-12.42, 43.6], [-12.22, 43.9]] },
  ndzuwani: { center: [-12.26, 44.37], bounds: [[-12.4, 44.18], [-12.05, 44.55]] },
  maore: { center: [-12.86, 45.15], bounds: [[-13.02, 45.0], [-12.62, 45.32]] },
};
const ARCHIPEL_BOUNDS = [[-13.05, 43.15], [-11.33, 45.35]];
