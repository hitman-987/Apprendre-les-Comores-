// Catalogue des ressources.
// Pour ajouter une ressource, copier une ligne R(...) dans la bonne rubrique.
//   R(rubrique, île, titre, détails, description, lien, options)
//   île     : ngazidja | ndzuwani | mwali | maore | archipel
//   options : { free: false } si la ressource est payante (livre, film…)
//             { lang: "en" } si elle est en anglais
//             { top: true } pour la mettre dans « Par où commencer »

const wiki = (q) => "https://fr.wikipedia.org/w/index.php?search=" + encodeURIComponent(q);
const youtube = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const yt = (id) => "https://www.youtube.com/watch?v=" + id;
const bnf = (q) => "https://catalogue.bnf.fr/rechercher.do?motRecherche=" + encodeURIComponent(q) + "&critereRecherche=0";

const CATEGORIES = {
  lieux: "Lieux à visiter",
  randonnees: "Randonnées",
  plages: "Plages et fonds marins",
  manger: "Manger et dormir",
  histoire: "Histoire",
  personnalites: "Personnalités",
  livres: "Livres",
  videos: "Vidéos et films",
  culture: "Culture et musique",
  langue: "Apprendre le shikomori",
  cuisine: "Cuisine",
  nature: "Nature et faune",
  etudes: "Études et recherches",
  innovations: "Avancées récentes",
  medias: "Presse et podcasts",
  manuels: "Manuels et livres gratuits",
  donnees: "Données et cartes",
  bibliotheques: "Bibliothèques et archives",
};

const ILES = {
  ngazidja: { nom: "Ngazidja", fr: "Grande Comore" },
  mwali: { nom: "Mwali", fr: "Mohéli" },
  ndzuwani: { nom: "Ndzuwani", fr: "Anjouan" },
  maore: { nom: "Maore", fr: "Mayotte" },
  archipel: { nom: "Archipel", fr: "les quatre îles" },
};

const RESOURCES = [];
function R(cat, ile, title, meta, desc, url, opts = {}) {
  RESOURCES.push({ cat, ile, title, meta, desc, url, free: opts.free !== false, lang: opts.lang || "fr", top: !!opts.top });
}

/* ───────────── Lieux à visiter ───────────── */
R("lieux", "archipel", "Médinas des sultanats historiques des Comores", "Patrimoine mondial UNESCO, inscrit en 2026",
  "Six médinas, quatre à Ngazidja et deux à Ndzuwani, avec mosquées, palais et remparts swahilis. Ce sont les premiers sites comoriens inscrits au patrimoine mondial.",
  "https://whc.unesco.org/fr/list/1768", { top: true });
R("lieux", "archipel", "Tourisme Comores", "Site de découverte des îles",
  "Présentation des trois îles de l'Union des Comores, de leurs sites et des façons de s'y rendre.",
  "https://tourismecomores.com/", { top: true });
R("lieux", "archipel", "Les trois îles en un coup d'œil", "Tourisme Comores",
  "Ce qui distingue Grande Comore, Anjouan et Mohéli, pour choisir où aller.",
  "https://tourismecomores.com/iles");
R("lieux", "archipel", "Les 15 meilleures attractions des Comores", "Komoot, guide collaboratif",
  "Lieux recommandés par des randonneurs et voyageurs, avec cartes et photos.",
  "https://www.komoot.com/guide/231714/attractions-in-the-comoros");
R("lieux", "archipel", "10 Best Places to Visit in Comoros", "The Crazy Tourist",
  "Une sélection illustrée des incontournables de l'archipel.",
  "https://www.thecrazytourist.com/10-best-places-visit-comoros/", { lang: "en" });
R("lieux", "archipel", "Comores, aventure hors des sentiers battus", "Madaplus, article de voyage",
  "Idées d'itinéraire et conseils pour un voyage sur plusieurs îles.",
  "https://www.madaplus.fr/comores-voyage-insolite/");
R("lieux", "archipel", "Comores : guide des îles Vanille", "Îles Vanille",
  "Fiche de l'archipel par l'association touristique des îles de l'océan Indien.",
  "https://www.vanilla-islands.org/en/indian-ocean-islands/comores/", { lang: "en" });
R("lieux", "archipel", "Guide de voyage Comores", "World Travel Guide",
  "Infos pratiques : climat, santé, formalités, transport et usages.",
  "https://www.worldtravelguide.net/guides/africa/comoros/", { lang: "en" });
R("lieux", "ngazidja", "Moroni et sa médina", "Capitale, Wikipédia",
  "La capitale, son vieux port et la mosquée de l'ancien Vendredi.",
  wiki("Moroni"));
R("lieux", "ngazidja", "Itsandra", "Ancienne cité royale, Wikipédia",
  "Plage familiale et ancienne capitale de sultanat au nord de Moroni.",
  wiki("Itsandra"));
R("lieux", "ngazidja", "Le lac Salé", "Cratère au nord de Ngazidja, Wikipédia",
  "Un lac d'eau salée dans un ancien cratère, tout près de l'océan.",
  wiki("Lac Salé Comores"));
R("lieux", "ngazidja", "Le Trou du Prophète", "Mitsamiouli, Wikipédia",
  "Crique de lave noire au nord de l'île, liée à une légende locale.",
  wiki("Trou du Prophète Comores"));
R("lieux", "ngazidja", "Le Dos du Dragon", "Crête volcanique, Wikipédia",
  "Une crête de cratères alignés au nord-est de Ngazidja, très photogénique.",
  wiki("Dos du Dragon Comores"));
R("lieux", "ndzuwani", "Anjouan : que voir, que faire, comment y aller", "Mascareignes Voyages",
  "Médina de Mutsamudu, vieille ville de Domoni, lac Dzialandzé, cascades et distilleries d'ylang-ylang.",
  "https://mascareignes-voyages.fr/anjouan-comores/", { top: true });
R("lieux", "ndzuwani", "Les incontournables de l'île d'Anjouan", "Hors Frontières, blog de voyage",
  "Retour d'expérience détaillé sur l'« île aux parfums ».",
  "https://hors-frontieres.fr/les-comores-les-incontournables-de-lile-danjouan/");
R("lieux", "ndzuwani", "Mutsamudu et sa citadelle", "Ancienne capitale du sultanat, Wikipédia",
  "Médina aux ruelles étroites dominée par une citadelle du XVIIIe siècle.",
  wiki("Mutsamudu"));
R("lieux", "ndzuwani", "Domoni", "Ville historique, Wikipédia",
  "L'une des plus anciennes cités d'Anjouan, avec son vieux quartier en pierre et ses mosquées.",
  wiki("Domoni"));
R("lieux", "ndzuwani", "Ylang-ylang : la fleur qui nourrit un archipel", "Première Peau, reportage",
  "Cueillette à l'aube et distillation de l'ylang-ylang à Anjouan.",
  "https://premierepeau.com/fr/blogs/news/ylang-ylang-fleur-nourrit-archipel-fr");
R("lieux", "maore", "Visiter Mayotte : conseils et itinéraire", "Les Droners",
  "Lagon, îlots, randonnées et villages : un itinéraire complet sur l'île.",
  "https://lesdroners.fr/guide-voyage/voyage-en-france/partir-en-vacances-en-france/visiter-mayotte/");
R("lieux", "maore", "Que faire à Mayotte ? 15 idées", "Partir voir le monde",
  "Activités à faire sur Grande-Terre et Petite-Terre.",
  "https://www.partirvoirlemonde.com/14-choses-a-faire-a-mayotte/");
R("lieux", "maore", "Mayotte : lagon, randonnée et culture", "Madaplus",
  "Le lagon, les sentiers et la culture mahoraise.",
  "https://www.madaplus.fr/mayotte-lagon-randonnee-culture/");
R("lieux", "maore", "MuMa, musée de Mayotte", "Dzaoudzi, Musée de France",
  "Le musée de Mayotte et ses collections ethnographiques, labellisé Musée de France en 2018.",
  "https://monumentum.fr/musee-de-france/m1209/dzaoudzi-muma-musee-de-mayotte");

/* ───────────── Randonnées ───────────── */
R("randonnees", "ngazidja", "Ascension du Karthala", "AllTrails, itinéraire et avis",
  "Environ 25 km aller-retour et 2 000 m de dénivelé jusqu'au cratère. Partir tôt, avec un guide.",
  "https://www.alltrails.com/trail/comoros/grande-comore/karthala", { lang: "en", top: true });
R("randonnees", "ngazidja", "Grimper le Karthala", "Venture the Planet, récit",
  "Récit complet de l'ascension : 4x4, forêt, caldeira et cratère.",
  "https://venturetheplanet.com/climbing-volcano-karthala-on-the-indian-ocean-island-nation-of-the-comoros/", { lang: "en" });
R("randonnees", "ngazidja", "Point de vue sur le cratère du Karthala", "AllTrails",
  "Les sentiers qui mènent au belvédère sur le cratère.",
  "https://www.alltrails.com/poi/comoros/grande-comore/-/point-de-vue-sur-le-cratere-du-karthala", { lang: "en" });
R("randonnees", "archipel", "Les meilleurs sentiers des Comores", "Wikiloc, traces GPS",
  "Traces GPS partagées par des randonneurs sur les îles.",
  "https://www.wikiloc.com/trails/hiking/comoros");
R("randonnees", "archipel", "Randonner aux Comores : quand y aller", "Where to Hike When",
  "Saisons, sommets et conseils pour randonner dans l'archipel.",
  "https://wheretohikewhen.com/countries/comoro-islands/", { lang: "en" });
R("randonnees", "ndzuwani", "Le lac Dzialandzé", "Randonnée phare d'Anjouan",
  "Un lac de cratère à environ 900 m d'altitude, à travers la forêt et ses makis. Les sentiers sont peu balisés : partez avec un guide.",
  "https://mascareignes-voyages.fr/anjouan-comores/");
R("randonnees", "ndzuwani", "Le mont Ntingui", "Point culminant d'Anjouan, Wikipédia",
  "Le sommet central de l'île, environ 1 575 m.",
  wiki("Mont Ntingui"));
R("randonnees", "archipel", "Voyage trekking Grande Comore, Anjouan, Mohéli", "Nomade Aventure, circuit",
  "Programme jour par jour qui donne une bonne idée des randonnées possibles.",
  "https://www.nomade-aventure.com/voyage-aventure/comores/voyage-grande-comore-anjouan-moheli/com52", { free: false });
R("randonnees", "maore", "Le mont Choungui", "Les deux pieds dehors, récit",
  "La montée raide au sommet le plus emblématique de Mayotte (594 m) et son panorama sur le lagon.",
  "https://lesdeuxpiedsdehors.com/en/mount-choungui-mayotte-island/");
R("randonnees", "maore", "Lac Dziani Dzaha", "Petite-Terre, Wikipédia",
  "Lac de cratère vert émeraude ; le tour à pied fait environ 4 km.",
  "https://en.wikipedia.org/wiki/Dziani_Dzaha", { lang: "en" });
R("randonnees", "maore", "Circuit randonnée Mayotte", "Nomade Aventure",
  "Les plus beaux sentiers de l'île, de Choungui à Saziley.",
  "https://www.nomade-aventure.com/voyage-aventure/mayotte/circuit-randonnee-mayotte/myt04", { free: false });

/* ───────────── Plages et fonds marins ───────────── */
R("plages", "archipel", "Les meilleures plages des Comores", "Carkomori",
  "Maloudja, Bouni, Chomoni, Nioumachoua… un classement par île.",
  "https://www.carkomori.com/en/posts/quelles-sont-les-meilleures-plages-des-comores", { top: true });
R("plages", "archipel", "Les plages des Comores", "Comores Aviation",
  "Présentation des plages principales de chaque île.",
  "https://www.comoresaviation.com/plages-comores.html");
R("plages", "archipel", "Plages des Comores : 5 trésors cachés", "Muslim Expat",
  "Cinq plages moins connues, avec conseils pratiques.",
  "https://muslim-expat.com/divers/plages-comores");
R("plages", "ngazidja", "Les 5 belles plages de Ngazidja", "La Comorienne, blog",
  "Maloudja, Chomoni, Bouni, Itsandra… vues par une Comorienne.",
  "https://http25765461.wordpress.com/2019/01/11/les-5-belles-plages-a-ngazidja-comores/");
R("plages", "archipel", "Best Beaches in Comoros", "Sandee",
  "Fiches plage par plage, avec notes sur la propreté et l'accès.",
  "https://sandee.com/list/best-beaches-in-comoros", { lang: "en" });
R("plages", "mwali", "There's pristine, then there's Mohéli", "Divernet, plongée",
  "La plongée dans le parc marin : coraux, tortues et grands pélagiques.",
  "https://divernet.com/world-dives/theres-pristine-then-theres-moheli/", { lang: "en" });
R("plages", "archipel", "Baleines et dauphins des Comores", "Figaro Nautisme",
  "Où et quand observer les baleines à bosse et les dauphins.",
  "https://figaronautisme.meteoconsult.fr/actus-nautisme-flash/2017-01-08/32749-rencontre-avec-les-baleines-et-les-dauphins-des-comores");
R("plages", "maore", "Mayotte : 10 activités incontournables", "Rentiles",
  "Le lagon, la plage de Moya et ses tortues, Saziley et les îlots.",
  "https://www.rentiles.fr/blog-voyage/faire-a-mayotte.html");

/* ───────────── Manger et dormir ───────────── */
R("manger", "ngazidja", "Les meilleurs restaurants de Moroni", "Tripadvisor, avis de voyageurs",
  "Le classement des restaurants de la capitale : L'Escale, Coraya Express, Mo Café…",
  "https://www.tripadvisor.fr/Restaurants-g294436-zfp10601-Moroni_Grande_Comore.html", { top: true });
R("manger", "ngazidja", "L'Escale, Moroni", "Restaurant le mieux noté de Moroni",
  "Grill et cuisine de la mer, connu pour sa salade de poulpe et sa terrasse.",
  "https://www.tripadvisor.com/Restaurant_Review-g294436-d7112115-Reviews-L_Escale-Moroni_Grande_Comore.html", { lang: "en" });
R("manger", "archipel", "Les meilleurs restaurants des Comores", "Tripadvisor",
  "Classement sur l'ensemble de l'Union des Comores.",
  "https://www.tripadvisor.com/Restaurants-g294435-Comoros.html", { lang: "en" });
R("manger", "mwali", "Laka Lodge", "Écolodge et centre de plongée à Nioumachoua",
  "Le seul hébergement dans le parc marin de Mohéli, au départ des sorties tortues et plongée.",
  "https://www.untamedtravelling.com/en/destinations/africa/comoros/laka-lodge", { lang: "en" });
R("manger", "archipel", "Les meilleurs hôtels des Comores", "Culture Trip",
  "Une sélection d'hôtels par île et par budget.",
  "https://theculturetrip.com/africa/comoros/articles/hotels-in-comoros/", { lang: "en" });
R("manger", "maore", "Annuaire gourmand de Mayotte", "Mayotte Hebdo, PDF",
  "Restaurants, snacks et tables de l'île, classés par commune.",
  "https://www.mayottehebdo.com/images/uploads/nos-supports/annuaire_gourmand/Annuaire_gourmand.pdf");
R("manger", "maore", "Meilleurs restaurants de Grande-Terre", "Evendo",
  "Sélection de restaurants à Mamoudzou et dans le reste de Grande-Terre.",
  "https://evendo.com/locations/mayotte/grande-terre/best-restaurants", { lang: "en" });
R("manger", "maore", "Restaurants de Petite-Terre", "Evendo",
  "Dzaoudzi, Pamandzi et Labattoir.",
  "https://evendo.com/locations/mayotte/petite-terre/all-restaurants", { lang: "en" });

/* ───────────── Histoire ───────────── */
R("histoire", "archipel", "Les Comores avant la France", "Hérodote.net, synthèse",
  "Une introduction claire : peuplement, islam, sultanats, traite et arrivée des Européens.",
  "https://www.herodote.net/Les_Comores_avant_la_France-synthese-3524-610.php", { top: true });
R("histoire", "archipel", "Histoire des Comores", "Wikipédia",
  "Vue d'ensemble chronologique, avec des liens vers chaque période.",
  wiki("Histoire des Comores"));
R("histoire", "archipel", "History of the Comoros", "Wikipédia (anglais)",
  "Une chronologie détaillée, des premiers peuplements à nos jours.",
  "https://en.wikipedia.org/wiki/History_of_the_Comoros", { lang: "en" });
R("histoire", "archipel", "The Islands of the Moon", "Aramco World, 1996",
  "Long article sur les Comores, le commerce maritime et l'arrivée des Shirazi.",
  "https://archive.aramcoworld.com/issue/199604/the.islands.of.the.moon.htm", { lang: "en" });
R("histoire", "archipel", "Liste des sultans des Comores", "Wikipédia (anglais)",
  "Les sultanats de chaque île et leurs souverains.",
  "https://en.wikipedia.org/wiki/List_of_sultans_in_the_Comoro_Islands", { lang: "en" });
R("histoire", "ndzuwani", "Le sultanat d'Anjouan", "Wikipédia (anglais)",
  "Le plus puissant des sultanats comoriens, de sa fondation vers 1500 au protectorat.",
  "https://en.wikipedia.org/wiki/State_of_Anjouan", { lang: "en" });
R("histoire", "ngazidja", "Résistance et domination coloniale en Grande Comore (1880–1940)", "Mémoire universitaire",
  "La résistance à la colonisation, le soulèvement de 1915 et la mainmise des sociétés coloniales sur les terres.",
  "https://www.memoireonline.com/06/09/2115/m_La-resistance--la-conqute-et--la-domination-coloniale-en-Grande-Comore-1880-194011.html");
R("histoire", "maore", "Le roi Andriantsoly et la cession de Mayotte (1841)", "Meer",
  "Le sultan qui céda Mayotte à la France, et ce que cela changea pour l'archipel.",
  "https://www.meer.com/fr/20848-le-roi-andriantsoly");
R("histoire", "maore", "Le triste 182e anniversaire de la Mayotte française", "Le Journal des Archipels",
  "Retour sur le traité du 25 avril 1841 et sa contestation.",
  "https://lejournaldesarchipels.com/2023/05/02/sad-182nd-birthday-of-french-mayotte/?lang=en");
R("histoire", "archipel", "État comorien (1975–1978)", "Wikipédia (anglais)",
  "Les premières années de l'indépendance et la période d'Ali Soilihi.",
  "https://en.wikipedia.org/wiki/State_of_the_Comoros", { lang: "en" });
R("histoire", "archipel", "Histoire des Comores, 1978–2001", "Wikipédia (anglais)",
  "Les années Abdallah, les mercenaires de Bob Denard, la crise séparatiste d'Anjouan.",
  "https://en.wikipedia.org/wiki/History_of_the_Comoros_(1978%E2%80%932001)", { lang: "en" });
R("histoire", "archipel", "Le coup d'État de 1978", "Wikipédia (anglais)",
  "La chute d'Ali Soilihi et le retour d'Ahmed Abdallah avec les mercenaires.",
  "https://en.wikipedia.org/wiki/1978_Comorian_coup_d%27%C3%A9tat", { lang: "en" });
R("histoire", "archipel", "Liste des chefs d'État des Comores", "Wikipédia (anglais)",
  "Tous les présidents depuis 1975.",
  "https://en.wikipedia.org/wiki/List_of_heads_of_state_of_the_Comoros", { lang: "en" });
R("histoire", "archipel", "Archives diplomatiques : Comores 1966–1970", "Ministère des Affaires étrangères, PDF",
  "Inventaire des archives françaises sur la période qui précède l'indépendance.",
  "https://www.diplomatie.gouv.fr/IMG/pdf/43qo_afrique_comores_1966-1970_cle06e249.pdf");

/* ───────────── Personnalités ───────────── */
R("personnalites", "mwali", "Djoumbé Fatima (vers 1837–1878)", "Reine de Mohéli",
  "Couronnée enfant, elle a régné sur Mohéli entre influences française, malgache et zanzibarite.",
  "https://en.wikipedia.org/wiki/Djoumb%C3%A9_Fatima", { lang: "en", top: true });
R("personnalites", "mwali", "Fatima Djoumbé, portrait", "Mulheres africanas, UFRGS",
  "Une biographie de la reine de Mohéli dans un projet universitaire sur les femmes africaines.",
  "https://www.ufrgs.br/africanas/fatima-djoumbe-1836-1878/");
R("personnalites", "mwali", "Abderremane, sultan de Mohéli", "Wikipédia (anglais)",
  "Prince merina devenu sultan de Mohéli, père de Djoumbé Fatima.",
  "https://en.wikipedia.org/wiki/Abderremane,_Sultan_of_Moh%C3%A9li", { lang: "en" });
R("personnalites", "ngazidja", "Saïd Ali ben Saïd Omar", "Sultan de Ngazidja (1892–1912)",
  "Le sultan qui revendiqua l'autorité sur toute la Grande Comore à l'époque du protectorat.",
  "https://en.wikipedia.org/wiki/Said_Ali_bin_Said_Omar_of_Grande_Comore", { lang: "en" });
R("personnalites", "ndzuwani", "Abdallah III (Saidi Abdallah bin Salim)", "Sultan d'Anjouan (1852–1891)",
  "Il signe le protectorat français en 1886, ce qui met fin à l'indépendance du sultanat.",
  "https://en.wikipedia.org/wiki/List_of_sultans_in_the_Comoro_Islands", { lang: "en" });
R("personnalites", "ndzuwani", "Halima IV", "Sultane d'Anjouan, Wikipédia (anglais)",
  "Une des souveraines de l'histoire anjouanaise.",
  "https://en.wikipedia.org/wiki/Halima_IV", { lang: "en" });
R("personnalites", "ngazidja", "Saïd Mohamed Cheikh (1904–1970)", "Président du Conseil de gouvernement (1962–1970)",
  "Médecin et homme politique, figure centrale de l'autonomie interne avant l'indépendance.",
  wiki("Saïd Mohamed Cheikh"));
R("personnalites", "ndzuwani", "Ahmed Abdallah (1919–1989)", "« Père de l'indépendance », président",
  "Il proclame l'indépendance en 1975, est renversé, revient au pouvoir en 1978 et est assassiné en 1989.",
  "https://en.wikipedia.org/wiki/Ahmed_Abdallah", { lang: "en", top: true });
R("personnalites", "archipel", "Ali Soilihi (1937–1978)", "Président révolutionnaire (1976–1978)",
  "Il mène une révolution socialiste radicale et anticoloniale, avant d'être renversé et tué en 1978.",
  "https://en.wikipedia.org/wiki/Ali_Soilih", { lang: "en", top: true });
R("personnalites", "archipel", "Saïd Mohamed Jaffar", "Président en 1975–1976",
  "Il renverse Ahmed Abdallah quelques semaines après l'indépendance.",
  "https://en.wikipedia.org/wiki/Said_Mohamed_Jaffar", { lang: "en" });
R("personnalites", "archipel", "Saïd Atthoumani", "Chef d'État par intérim en 1978",
  "Il préside brièvement le directoire politico-militaire après la chute d'Ali Soilihi.",
  "https://en.wikipedia.org/wiki/Said_Atthoumani", { lang: "en" });
R("personnalites", "archipel", "Ali Zamir (né en 1987)", "Écrivain",
  "Romancier né à Anjouan, lauréat du Prix Senghor : la voix littéraire comorienne de sa génération.",
  "https://en.wikipedia.org/wiki/Ali_Zamir", { lang: "en" });
R("personnalites", "archipel", "Hachimiya Ahamada", "Réalisatrice",
  "Cinéaste d'origine comorienne, autrice de La Résidence Ylang-Ylang et de L'Ivresse d'une oasis.",
  "https://en.wikipedia.org/wiki/Hachimiya_Ahamada", { lang: "en" });
R("personnalites", "ngazidja", "Salim Ali Amir", "Musicien",
  "Né à Moroni, fondateur du groupe Ngaya en 1982, figure majeure du twarab moderne.",
  "https://www.musicinafrica.net/fr/node/385195");
R("personnalites", "archipel", "Mahmoud Ibrahime", "Historien",
  "Auteur de La naissance de l'élite politique comorienne (1945–1975).",
  wiki("Mahmoud Ibrahime"));
R("personnalites", "ngazidja", "Damir Ben Ali", "Historien et anthropologue",
  "Spécialiste de la société comorienne, de la famille et du grand mariage.",
  wiki("Damir Ben Ali"));

/* ───────────── Livres ───────────── */
R("livres", "archipel", "Islands in a Cosmopolitan Sea: A History of the Comoros", "Iain Walker, Hurst, 2019",
  "La synthèse de référence la plus récente, du peuplement à l'État contemporain.",
  "https://www.eth.mpg.de/5326352/book_295", { free: false, lang: "en", top: true });
R("livres", "archipel", "Comores : quatre îles entre pirates et planteurs", "Jean Martin, L'Harmattan, 1983, 2 tomes",
  "Le grand classique sur l'histoire de l'archipel au XIXe siècle.",
  bnf("Jean Martin Comores quatre îles entre pirates et planteurs"), { free: false, top: true });
R("livres", "archipel", "L'archipel aux sultans batailleurs", "Urbain Faurec, 1941",
  "Histoire « anecdotique » des sultanats. À lire avec du recul sur le regard colonial de l'époque.",
  bnf("Faurec archipel aux sultans batailleurs"), { free: false });
R("livres", "archipel", "Les Comores de 1975 à 1990 : une histoire politique mouvementée", "Nakidine Mattoir et Damir Ben Ali, L'Harmattan",
  "Indépendance, révolution, années Abdallah et mercenaires.",
  bnf("Mattoir Comores de 1975 à 1990"), { free: false });
R("livres", "archipel", "La naissance de l'élite politique comorienne (1945–1975)", "Mahmoud Ibrahime, L'Harmattan, 2000",
  "Comment s'est formée la classe politique qui a mené à l'indépendance.",
  bnf("Mahmoud Ibrahime naissance de l'élite politique comorienne"), { free: false });
R("livres", "archipel", "L'esclavage aux Comores", "Ibouroi Ali Tabibou, éditions Cœlacanthe, 2017, 2 tomes",
  "Issu d'une thèse : la traite et l'esclavage dans l'archipel et leurs mémoires.",
  "https://www.academieoutremer.fr/images/files/20220728_d93f41effeef2ee45b65bfdda50a0ee8.pdf", { free: false });
R("livres", "ngazidja", "Maisons des femmes, cités des hommes", "Sophie Blanchy",
  "Anthropologie de la filiation, de l'âge et du pouvoir à Ngazidja.",
  bnf("Blanchy Maisons des femmes cités des hommes"), { free: false });
R("livres", "ngazidja", "La Grande Comore en 1898", "Henri Pobéguin et Sophie Blanchy, Komédit, 2007",
  "Le témoignage d'un administrateur colonial, présenté et commenté.",
  bnf("Pobéguin Grande Comore en 1898"), { free: false });
R("livres", "maore", "La vie quotidienne à Mayotte", "Sophie Blanchy, L'Harmattan, 1990",
  "La société mahoraise au quotidien.",
  bnf("Blanchy vie quotidienne à Mayotte"), { free: false });
R("livres", "maore", "Comores-Mayotte : une histoire néocoloniale", "Pierre Caminade, Agone",
  "Essai sur la séparation de Mayotte et les relations franco-comoriennes depuis 1975.",
  bnf("Caminade Comores-Mayotte histoire néocoloniale"), { free: false });
R("livres", "mwali", "La régence de Djoumbé Fatima", "Essai historique",
  "Le règne de la reine de Mohéli.",
  "https://side-ecom-prod-export.cdi.ch/en/9786202298209-la-r%C3%A9gence-de-djoumbe-fatima", { free: false });
R("livres", "ngazidja", "Le Kafir du Karthala", "Mohamed Toihiri, roman, L'Harmattan, 1992",
  "Un médecin de retour à Moroni face aux contradictions de sa société. Traduit en anglais.",
  "https://www.librarything.com/work/14576876", { free: false, top: true });
R("livres", "archipel", "La République des imberbes", "Mohamed Toihiri, roman, L'Harmattan, 1985",
  "Souvent présenté comme le premier roman comorien en français : une satire de la période révolutionnaire.",
  "https://www.themodernnovel.org/africa/other-africa/comoros/toihiri/imberbes/", { free: false });
R("livres", "archipel", "Anguille sous roche", "Ali Zamir, roman, Le Tripode, 2016, Prix Senghor",
  "Une jeune femme qui se noie raconte sa vie en une seule phrase. En anglais : A Girl Called Eel.",
  "https://www.politis.fr/articles/2019/01/anguille-sous-roche-amour-a-la-derive-39873/", { free: false, top: true });
R("livres", "archipel", "Mon Étincelle et Dérangé que je suis", "Ali Zamir, romans, Le Tripode, 2017 et 2019",
  "Les deux romans suivants d'Ali Zamir ; le second a reçu le Prix Roman France Télévisions.",
  bnf("Ali Zamir"), { free: false });
R("livres", "ngazidja", "Contes et romans de Salim Hatubou", "Salim Hatubou (1972–2015)",
  "Une vingtaine de titres, dont beaucoup de contes de la tradition orale : idéal pour les enfants.",
  wiki("Salim Hatubou"), { free: false });
R("livres", "maore", "Mon mari est plus qu'un fou, c'est un homme", "Nassur Attoumani, roman",
  "Un roman nourri des contes traditionnels comoriens et mahorais.",
  wiki("Nassur Attoumani"), { free: false });
R("livres", "ngazidja", "Moroni Blues", "Soeuf Elbadawi, théâtre, 2009",
  "Texte poétique et politique sur Moroni et l'archipel.",
  wiki("Soeuf Elbadawi"), { free: false });
R("livres", "archipel", "Le premier roman en comorien", "Mohamed Nabhane, ActuaLitté",
  "Un roman écrit directement en shikomori, une première.",
  "https://actualitte.com/article/63856/edition/le-premier-roman-en-comorien-par-mohamed-nabhane");
R("livres", "archipel", "Livres de Moussa Saïd Ahmed", "La Procure",
  "Les ouvrages de l'auteur comorien disponibles en librairie.",
  "https://www.laprocure.com/author/0-110862/said-ahmed-moussa", { free: false });
R("livres", "archipel", "Littérature comorienne", "Bibliosurf, sélection",
  "Une liste de romans, poésie et essais d'auteurs comoriens.",
  "https://www.bibliosurf.com/litteraturecomorienne.html");
R("livres", "archipel", "Lonely Planet Madagascar & Comoros", "Guide de voyage, édition 2024",
  "Le seul grand guide papier qui couvre les Comores.",
  "https://mapscompany.com/products/guide-de-voyage-en-anglais-madagascar-comoros-lonely-planet", { free: false, lang: "en" });

/* ───────────── Vidéos et films ───────────── */
R("videos", "archipel", "L'histoire incroyable des Comores expliquée simplement", "YouTube",
  "Le parcours de l'archipel et sa place dans l'océan Indien, en une vidéo.",
  yt("Ji_W2j2V6Jk"), { top: true });
R("videos", "archipel", "L'histoire des Comores : des origines africaines à l'indépendance", "YouTube",
  "Des premiers peuplements jusqu'en 1975.",
  yt("KC3B-YAa73s"));
R("videos", "maore", "Mayotte/Comores, 40 ans d'histoire", "France Culture, YouTube, 2018",
  "Le rattachement de Mayotte à la France et ses conséquences.",
  yt("A9dAmzpneHU"));
R("videos", "archipel", "Mercenaires aux Comores", "YouTube",
  "Le mercenariat, des années Abdallah à la présidence Djohar.",
  yt("0ffYa_E5bsM"));
R("videos", "archipel", "De l'esclavage aux Comores : histoire et mémoire", "YouTube, entretien",
  "Le Dr Ali Tabibou présente sa thèse sur l'esclavage aux Comores.",
  yt("qY58c1OBYR0"));
R("videos", "archipel", "Comores, au cœur du paradis", "YouTube",
  "Mode de vie insulaire, coutumes et lien à la mer.",
  yt("ldxpXsJQhCc"));
R("videos", "ngazidja", "Documentaire tourné en Grande Comore", "YouTube, 2017",
  "La vie quotidienne et les paysages de Ngazidja.",
  yt("4Zh_7vQENf0"));
R("videos", "archipel", "Découvrez les Comores", "YouTube",
  "Une présentation visuelle des îles et de leurs paysages.",
  yt("0G6dL10mOf4"));
R("videos", "archipel", "Comores & Nous", "YouTube, projet vidéo",
  "Culture, nature, traditions et histoire des Comores.",
  yt("Dy5YzKLliCE"));
R("videos", "archipel", "Les Comores en 14 jours (Anjouan, Mohéli, Grande Comore)", "YouTube, vlog",
  "Un voyage complet sur les trois îles.",
  yt("fNRxb4kA32s"), { top: true });
R("videos", "ngazidja", "Grande Comore, perle de l'océan Indien", "YouTube",
  "Une île préservée, brute et authentique.",
  yt("oDZW-qaFtiA"));
R("videos", "ngazidja", "Ascension du volcan Karthala", "YouTube, tour du monde",
  "L'ascension filmée, de Moroni jusqu'au cratère.",
  yt("iAthtITRdcY"));
R("videos", "mwali", "Découverte de Mohéli, joyau des Comores", "YouTube",
  "La plus petite île, ses roussettes de Livingstone et sa nature préservée.",
  yt("orC7yRtesrw"));
R("videos", "ndzuwani", "Anjouan, le paradis caché de l'océan", "YouTube",
  "Montagnes, plages et villages d'Anjouan.",
  yt("vaZsee1A444"));
R("videos", "ndzuwani", "Anjouan, l'île parfumée des Comores", "YouTube",
  "L'île de l'ylang-ylang.",
  yt("se-mm737HCw"));
R("videos", "archipel", "The Comoros, East Africa's Island Paradise", "YouTube, en anglais",
  "Dix jours entre Grande Comore et Mohéli.",
  yt("qJZx2KWhQYc"), { lang: "en" });
R("videos", "ngazidja", "Ma première fois à un mariage en Grande Comore", "YouTube, vlog",
  "Plongée dans l'ambiance d'un mariage comorien.",
  yt("eo-QLT_zKzI"));
R("videos", "archipel", "CAN 2022 : l'entrée dans l'histoire des Cœlacanthes", "RFI, YouTube",
  "La première participation historique de l'équipe nationale à la Coupe d'Afrique.",
  yt("ZaMa9xlTzcg"));
R("videos", "maore", "Comores-Mayotte, archipel insoumis", "Marie-Dominique Massol, 2023, 1 h 20",
  "Long documentaire sur l'archipel et la question de Mayotte.",
  "https://www.pathe.fr/en/movies-events/comores-mayotte-archipel-insoumis", { free: false });
R("videos", "maore", "Un aller simple pour Maoré", "Documentaire, 2007, bande-annonce",
  "Les ingérences françaises depuis la décolonisation et l'émigration vers Mayotte.",
  "https://vimeo.com/329800161");
R("videos", "archipel", "Bambao, reine des Comores", "Denis Buttner, documentaire, 52 min",
  "L'histoire coloniale vue à travers la Société Bambao et ses plantations.",
  "https://www.mayottehebdo.com/actualite/en_bref/29-03-10-projection-de-bambao-reine-des-comores/", { free: false });
R("videos", "archipel", "Zanatany", "Hachimiya Ahamada, court métrage, 2024",
  "Fiction sur les massacres de Comoriens à Majunga, à Madagascar, en 1976.",
  "https://fespaco.bf/en/zanatany-the-imprint-of-lonely-shrouds", { free: false });
R("videos", "ngazidja", "Le grand mariage en vidéo", "Recherche YouTube",
  "Reportages et documentaires sur l'anda, le rite social central de Ngazidja.",
  youtube("grand mariage comorien documentaire"));
R("videos", "mwali", "Les tortues d'Itsamia en vidéo", "Recherche YouTube",
  "La ponte des tortues vertes sur les plages de Mohéli.",
  youtube("tortues Itsamia Mohéli"));
R("videos", "archipel", "Cours de shikomori en vidéo", "Recherche YouTube",
  "Tutoriels pour apprendre les bases de la langue comorienne.",
  youtube("apprendre le shikomori"));
R("videos", "archipel", "Recettes comoriennes en vidéo", "Recherche YouTube",
  "Mataba, pilao, mkatra foutra, langouste à la vanille…",
  youtube("recette comorienne"));

/* ───────────── Culture et musique ───────────── */
R("culture", "archipel", "Le twarab aux Comores, un patrimoine oublié", "Music in Africa",
  "L'histoire du twarab, arrivé au XIXe siècle depuis Zanzibar, et de ses orchestres mythiques.",
  "https://www.musicinafrica.net/node/139642", { top: true });
R("culture", "archipel", "Twarab : une musique comorienne entre deux mondes", "Article de recherche, PDF",
  "Étude sur le twarab, entre héritage arabo-swahili et identité comorienne.",
  "https://hal.univ-reunion.fr/hal-03484807/document", { lang: "en" });
R("culture", "archipel", "Musique des Comores", "Wikipédia (anglais)",
  "Panorama des genres (twarab, mgodro, chigoma, sambe…) et des artistes.",
  "https://en.wikipedia.org/wiki/Music_of_the_Comoros", { lang: "en" });
R("culture", "archipel", "Archives sonores de l'océan Indien", "CREM-CNRS",
  "Enregistrements ethnomusicologiques : chants, instruments et musiques traditionnelles.",
  "https://archives.crem-cnrs.fr/archives/corpus/CNRSMH_PhonoOceanIndien_001/dc/");
R("culture", "archipel", "Nawal, « la voix des Comores »", "Mayotte Hebdo",
  "Une artiste qui réinvente le taarab avec son Afro Jazz Taarab Project.",
  "https://www.mayottehebdo.com/actualite/culture/nawal-reinvente-le-taarab-comorien-avec-son-nouvel-album-afro-jazz-taarab-project/");
R("culture", "ngazidja", "Maalesh", "World Music Central, profil",
  "Chanteur-guitariste de Moroni qui chante en comorien, français, arabe et swahili.",
  "https://worldmusiccentral.org/?p=62987", { lang: "en" });
R("culture", "archipel", "Les femmes dans l'industrie musicale comorienne", "Music in Africa",
  "La place des chanteuses et musiciennes dans la scène comorienne.",
  "https://www.musicinafrica.net/node/139643");
R("culture", "ngazidja", "Le grand mariage, le rite d'une vie", "Le Soleil",
  "Comprendre l'anda : statut social, coûts et calendrier des mariages de juillet-août.",
  "https://lesoleil.sn/actualites/societe-fait-divers/comores-le-grand-mariage-rite-dune-vie-qui-rythme-juillet-et-aout/");
R("culture", "archipel", "Les littératures de l'océan Indien", "Académie de La Réunion, PDF",
  "Guide pédagogique qui présente les auteurs comoriens et mahorais avec des extraits.",
  "https://ac-reunion.fr/media/36865/download");
R("culture", "archipel", "Les littératures francophones des Comores", "Classiques Garnier, PDF",
  "Un siècle de littérature comorienne en français.",
  "https://classiques-garnier.com/export/pdf/les-litteratures-francophones-de-l-archipel-des-comores-resistance-culturelle-aux-comores.html");
R("culture", "archipel", "Festival international de cinéma des Comores", "Images francophones",
  "Le festival de cinéma de l'archipel et sa marraine Firmine Richard.",
  "https://www.imagesfrancophones.org/actualites/l-actrice-firmine-richard-marraine-du-festival-international-de-cinema-des-comores-562");
R("culture", "maore", "Le patrimoine immatériel au musée de Mayotte", "Ministère de la Culture",
  "Comment le MuMa sauvegarde danses, chants et savoir-faire mahorais.",
  "https://www.culture.gouv.fr/fr/thematiques/patrimoine-culturel-immateriel/pour-les-acteurs-de-la-sauvegarde/le-patrimoine-culturel-immateriel-en-outre-mer/galerie-de-projets-inspirants/le-pci-dans-le-projet-scientifique-et-culturel-du-musee-de-mayotte-muma");
R("culture", "archipel", "Les Cœlacanthes, symbole national", "Nekton",
  "Pourquoi un poisson préhistorique est devenu l'emblème du pays et de son équipe de football.",
  "https://nektonmission.org/news/coelacanths-football-and-the-worlds-most-unique-national-symbol/", { lang: "en" });

/* ───────────── Apprendre le shikomori ───────────── */
R("langue", "archipel", "ORELC", "Dictionnaire, conjugueur et leçons",
  "Le site de référence pour apprendre le shiNgazidja, shiNdzuani, shiMwali et shiMaore.",
  "https://orelc.ac/", { top: true });
R("langue", "archipel", "Cours en comorien", "ORELC",
  "Leçons de grammaire et de vocabulaire, pas à pas.",
  "https://orelc.ac/academy/FrenchLessons/");
R("langue", "archipel", "Luha", "Application iPhone",
  "Les quatre variantes de la langue : jeux de vocabulaire, conversation et grammaire.",
  "https://apps.apple.com/gh/app/luha/id6473959601");
R("langue", "archipel", "80 mots et expressions de base", "Targumi",
  "Le vocabulaire essentiel classé par thème, avec traductions.",
  "https://www.targumi.com/vocabulaire/comorien");
R("langue", "ngazidja", "Shingazidja", "Site d'apprentissage",
  "Grammaire, vocabulaire par thème, traducteur et jeux pour le comorien de Grande Comore.",
  "http://shingazidja.free.fr/");
R("langue", "archipel", "Apprendre le shikomori", "Uyen Shicomore, blog",
  "Une sélection commentée de livres, sites et chaînes pour apprendre la langue.",
  "https://uyenshicomore.com/2020/08/22/apprendre-le-shikomori/");
R("langue", "maore", "Outils numériques pour le shikomori", "CASNAV de Mayotte",
  "Dictionnaires, applications et claviers pour les variantes de la langue.",
  "https://casnav.ac-mayotte.fr/Site-sur-les-differentes-variantes-de-la-langue-comorienne.html");
R("langue", "archipel", "Anglais-Shikomori", "Application Android",
  "Apprendre l'anglais depuis le comorien, ou l'inverse.",
  "https://play.google.com/store/apps/details?id=com.anglaisshikomori.app&hl=en_US");
R("langue", "archipel", "Le code de la route en comorien", "Made Ecim",
  "Réviser le code de la route en shikomori.",
  "https://www.madeecim.fr/code-de-la-route-en-comorien/");
R("langue", "archipel", "Le shikomori", "Wikipédia",
  "La langue bantoue des Comores, proche du swahili, et ses quatre variantes insulaires.",
  wiki("Shikomori"));

/* ───────────── Cuisine ───────────── */
R("cuisine", "archipel", "La cuisine comorienne", "Wikipédia (anglais)",
  "Les plats, les ingrédients et les influences arabes, africaines et françaises.",
  "https://en.wikipedia.org/wiki/Comorian_cuisine", { lang: "en", top: true });
R("cuisine", "archipel", "Que manger aux Comores", "Intrepid Travel",
  "Langouste à la vanille, mataba, pilao, mkatra foutra… les plats à goûter.",
  "https://www.intrepidtravel.com/us/comoros-islands/what-to-eat-on-the-comoros-islands", { lang: "en" });
R("cuisine", "archipel", "Cuisine et culture des Comores", "International Cuisine",
  "Histoire culinaire et recettes détaillées.",
  "https://www.internationalcuisine.com/about-food-and-culture-of-comoros/", { lang: "en" });
R("cuisine", "archipel", "Un repas comorien complet", "A Year Cooking the World",
  "Un menu comorien cuisiné et expliqué pas à pas.",
  "https://ayearcookingtheworld.com/2016/07/19/comoros/", { lang: "en" });
R("cuisine", "archipel", "Crêpe comorienne", "Du bocal à l'assiette, recette",
  "Une recette facile de dessert traditionnel.",
  "https://dubocalalassiette.fr/blog/recette-crepe-comorienne/");
R("cuisine", "archipel", "Manger et boire aux Comores", "World Travel Guide",
  "Les spécialités, les boissons et les usages à table.",
  "https://www.worldtravelguide.net/guides/africa/comoros/food-and-drink", { lang: "en" });
R("cuisine", "archipel", "Que ramener des Comores", "Le Mag Voyage",
  "Vanille, ylang-ylang, épices et artisanat.",
  "https://www.lemagvoyage.fr/comores/que-ramener-des-comores/");
R("cuisine", "archipel", "The Comoros Pantry", "Steve Page, livre de cuisine",
  "Un livre de recettes comoriennes en anglais.",
  "https://test.blackwells.co.uk/bookshop/product/The-Comoros-Pantry-by-Steve-Page/9798335764216", { free: false, lang: "en" });

/* ───────────── Nature et faune ───────────── */
R("nature", "mwali", "Mohéli intègre le réseau mondial des réserves de biosphère", "PNUD",
  "Tortues vertes, baleines à bosse, dauphins : pourquoi l'UNESCO a reconnu Mohéli.",
  "https://www.undp.org/fr/comoros/actualites/moheli-integre-le-reseau-mondial-des-reserves-de-biosphere", { top: true });
R("nature", "mwali", "Réserve de biosphère de Mwali", "UNESCO",
  "La fiche officielle de la réserve.",
  "https://en.unesco.org/biosphere/africa/mwali", { lang: "en" });
R("nature", "archipel", "Protéger la biodiversité aux Comores", "PNUD",
  "Les plages d'Itsamia, où des dizaines de milliers de tortues vertes viennent pondre chaque année.",
  "https://www.undp.org/fr/node/490801");
R("nature", "archipel", "Écosystèmes marins de l'archipel des Comores", "UNESCO, liste indicative",
  "Récifs, herbiers et mammifères marins proposés au patrimoine mondial.",
  "https://whc.unesco.org/en/tentativelists/5107/", { lang: "en" });
R("nature", "ngazidja", "Le Karthala", "Global Volcanism Program, Smithsonian",
  "Fiche scientifique du volcan : éruptions, données et photos.",
  "https://volcano.si.edu/volcano.cfm?vn=233010", { lang: "en" });
R("nature", "ngazidja", "Le massif du Karthala, volcan actif", "Géodiversité, PDF",
  "La géologie du volcan expliquée simplement.",
  "https://www.geodiversite.net/IMG/pdf/karthala_comores-6.pdf");
R("nature", "archipel", "Les forêts des Comores", "Wikipédia (anglais)",
  "Écorégion, espèces endémiques et menaces.",
  "https://en.wikipedia.org/wiki/Comoros_forests", { lang: "en" });
R("nature", "archipel", "Les oiseaux uniques des Comores", "WorldAtlas",
  "Les espèces qu'on ne trouve nulle part ailleurs, dont les petits-ducs endémiques.",
  "https://www.worldatlas.com/articles/the-unique-birds-found-in-the-comoros-islands.html", { lang: "en" });
R("nature", "archipel", "Atlas des oiseaux nicheurs des Comores", "Musée royal de l'Afrique centrale",
  "59 espèces nicheuses, dont 15 endémiques : la référence scientifique.",
  "https://www.africamuseum.be/fr/research/discover/publications/search/pubdetail?pubid=1531");
R("nature", "ndzuwani", "Le cœlacanthe d'Anjouan", "Ecoticias",
  "L'histoire du « fossile vivant » pêché au large d'Anjouan.",
  "https://www.ecoticias.com/en/a-fisherman-in-anjouan-accidentally-pulled-up-a-coelacanth-the-prehistoric-looking-fish-that-seemed-like-a-living-fossil-hidden-in-deep-waters-and-still-leaves-people-stunned/34879/", { lang: "en" });
R("nature", "ndzuwani", "Anjouan : un sursaut pour sauver la forêt", "L'Info durable",
  "La déforestation d'Anjouan et les initiatives pour y répondre.",
  "https://www.linfodurable.fr/ailleurs-dans-le-monde/anjouan-aux-comores-un-sursaut-pour-sauver-la-foret-en-perdition-53092");
R("nature", "archipel", "Rapport national sur les tortues marines", "IOSEA, 2024, PDF",
  "État des populations de tortues et des actions de protection aux Comores.",
  "https://iosea-turtles.cms.int/sites/default/files/document/IOSEA_Turtles_NR_Comoros_2024.pdf", { lang: "en" });

/* ───────────── Études et recherches ───────────── */
R("etudes", "archipel", "Esclaves, engagés et travailleurs libres à la Grande Comore (1883–1910)", "Ali Ibrahim, thèse, 2017",
  "La traite depuis le Mozambique sous le sultanat de Saïd Ali.",
  "https://theses.fr/2017PA040028", { top: true });
R("etudes", "archipel", "L'esclavage aux Comores", "Ibouroi Ali Tabibou, PDF",
  "Travail de recherche sur l'esclavage et les descendants d'esclaves makua.",
  "https://www.histproj.org/completed/Tabibou.pdf");
R("etudes", "archipel", "Thèse d'Abdillahi (Université de La Réunion, 2012)", "HAL, PDF",
  "Thèse de doctorat sur les Comores, en accès libre.",
  "https://halshs.archives-ouvertes.fr/tel-01206102v1/file/2012LARE021_Abdillahi.pdf");
R("etudes", "archipel", "Thèse d'Ahmed Abdallah Fouad (Université de La Réunion, 2017)", "HAL, PDF",
  "Thèse de doctorat sur les Comores, en accès libre.",
  "https://halshs.archives-ouvertes.fr/tel-01761246v1/file/2017lare0029_AAFouad.pdf");
R("etudes", "archipel", "Thèse d'Abderamane Bourhane", "HAL, PDF",
  "Thèse de doctorat sur les Comores, en accès libre.",
  "https://halshs.archives-ouvertes.fr/tel-02079565v1/file/BOURHANE_Abderamane_va_vd.pdf");
R("etudes", "ngazidja", "Archives des Comores en France", "Rapport CNDRS / INP, 2019, PDF",
  "Où trouver les archives sur les Comores : Archives nationales, Outre-mer, Mayotte.",
  "https://halshs.archives-ouvertes.fr/halshs-03003628v1/file/Rapport_Ngazidja_2019_version_finale.pdf");
R("etudes", "archipel", "Les Comores dans le monde swahili", "Afriques, OpenEdition",
  "Article de recherche sur l'archéologie et l'histoire swahilie de l'archipel.",
  "https://journals.openedition.org/afriques/1721");
R("etudes", "archipel", "Plantes et premiers habitants des Comores", "Archéobotanique, PDF",
  "Ce que les graines des sites anciens comme Sima disent du peuplement.",
  "https://wydawnictwo.pan.pl/index.php/fo/article/download/2886/2218/8922", { lang: "en" });
R("etudes", "ndzuwani", "Étude de la filière ylang-ylang", "Coordination Sud, 2013, PDF",
  "Production, distilleries et économie de l'ylang-ylang.",
  "https://www.coordinationsud.org/wp-content/uploads/Etude_filliere_yy_NRSC-2013.pdf");
R("etudes", "ngazidja", "Éducation aux éruptions du Karthala", "Mémoire universitaire",
  "Comment préparer la population aux catastrophes volcaniques.",
  "https://www.memoireonline.com/05/20/11837/m_Contribution-a-leducation-aux-catastrophes-naturelles-en-la-Grande-Comore-cas-des-eruptions-voc14.html");
R("etudes", "archipel", "Littérature comorienne : le kafir", "Études littéraires africaines, PDF",
  "Article universitaire sur les romans de Toihiri et Elbadawi.",
  "https://www.erudit.org/en/revue/ela/2018/v/n45/1051642ar.pdf");
R("etudes", "archipel", "La médecine dans Le Kafir du Karthala", "Article de recherche, 2024",
  "Lecture d'un roman majeur sous l'angle de la science.",
  "https://epi-revel.unice.fr/publication/item/100361");
R("etudes", "archipel", "Bibliographie juridique de l'océan Indien", "Knetsch, HAL, 2021, PDF",
  "Toutes les références en droit des Comores et de la région.",
  "https://halshs.archives-ouvertes.fr/hal-03323755v1/file/Knetsch,%20Bibliographie%20juridique%20de%20l%27oc%C3%A9an%20Indien,%202021%20%28v_def%29.pdf");
R("etudes", "archipel", "Les Comores (fiche pays)", "Ministère des Affaires étrangères, PDF",
  "Présentation du pays avec une bibliographie de référence.",
  "https://www.diplomatie.gouv.fr/IMG/pdf/comores_20190702_cle437b2d.pdf");

/* ───────────── Presse et podcasts ───────────── */
R("medias", "archipel", "La Gazette des Comores", "Quotidien indépendant",
  "L'actualité de l'archipel au jour le jour.",
  "https://www.lagazettedescomores.com/");
R("medias", "archipel", "Al-Watwan", "Quotidien national",
  "Le journal national des Comores, fondé en 1985.",
  wiki("Al-Watwan"));
R("medias", "maore", "Mayotte Hebdo", "Hebdomadaire",
  "L'actualité de Mayotte et beaucoup d'articles culture et histoire sur l'archipel.",
  "https://www.mayottehebdo.com/");
R("medias", "archipel", "Les médias aux Comores", "Wikipédia (anglais)",
  "Panorama des journaux, radios et télévisions.",
  "https://en.wikipedia.org/wiki/Mass_media_in_the_Comoros", { lang: "en" });
R("medias", "archipel", "La Cité Métisse : les Comores", "Podcast",
  "Présentation de l'archipel, de sa population et de sa culture.",
  "https://podcast.ausha.co/la-cite-metisse/lcm14-avec-maliza-said-soihili-abda-halifa", { top: true });
R("medias", "maore", "Mayotte, un défi pour la France", "Revue Conflits, podcast",
  "Pourquoi Mayotte est restée française.",
  "https://www.revueconflits.com/?p=59509");
R("medias", "archipel", "Islands in a Cosmopolitan Sea, conférence", "IIAS, webinaire",
  "Iain Walker présente son histoire des Comores.",
  "https://www.iias.asia/events/islands-cosmopolitan-sea-history-comoros", { lang: "en" });
R("medias", "maore", "Entretien avec l'historien Jean Martin", "Mayotte Hebdo",
  "Le grand spécialiste de l'histoire des Comores au XIXe siècle.",
  "https://www.mayottehebdo.com/?p=6036");
R("medias", "archipel", "Les Comores selon RSF", "Reporters sans frontières",
  "L'état de la liberté de la presse dans le pays.",
  "https://rsf.org/fr/pays-comores");

/* ───────────── Bibliothèques en ligne ───────────── */
R("bibliotheques", "archipel", "Lexilogos : Comores", "Portail de ressources",
  "Cartes anciennes, dictionnaires de shikomori, études, documentaires : le meilleur annuaire de liens.",
  "https://www.lexilogos.com/comores.htm", { top: true });
R("bibliotheques", "archipel", "Gallica (BnF) : Comores", "Bibliothèque numérique",
  "Livres anciens, cartes, photos et cartes postales numérisés.",
  "https://gallica.bnf.fr/services/engine/search/sru?operation=searchRetrieve&query=(gallica%20all%20%22Comores%22)");
R("bibliotheques", "archipel", "Études océan Indien", "Revue de l'INALCO, OpenEdition",
  "Revue scientifique en libre accès sur les Comores, Madagascar et la région.",
  "https://journals.openedition.org/oceanindien/");
R("bibliotheques", "archipel", "Carnets de recherches de l'océan Indien", "Université de La Réunion",
  "Travaux récents sur les sociétés de l'océan Indien, en libre accès.",
  "https://carnets-oi.univ-reunion.fr/");
R("bibliotheques", "archipel", "Persée : articles sur les Comores", "Revues scientifiques",
  "Des décennies d'articles d'histoire, de géographie et d'anthropologie.",
  "https://www.persee.fr/search?ta=article&q=comores");
R("bibliotheques", "archipel", "HAL : recherches sur les Comores", "Archive ouverte",
  "Thèses, mémoires et articles en accès libre.",
  "https://hal.science/search/index/?q=comores");
R("bibliotheques", "archipel", "Theses.fr : thèses sur les Comores", "Catalogue des thèses françaises",
  "Toutes les thèses soutenues en France sur les Comores.",
  "https://theses.fr/resultats?q=comores");
R("bibliotheques", "archipel", "Internet Archive : Comores", "Bibliothèque numérique",
  "Livres anciens, récits de voyage, enregistrements et films libres de droits.",
  "https://archive.org/search?query=comores", { lang: "en" });
R("bibliotheques", "archipel", "Catalogue de la BnF", "Bibliothèque nationale de France",
  "Tous les livres publiés en France sur les Comores, pour les emprunter en bibliothèque.",
  bnf("Comores"));

/* ───────────── Avancées récentes ───────────── */
R("innovations", "ngazidja", "Forum de l'intelligence artificielle aux Comores", "Data Consulting KM, Moroni",
  "Première édition le 31 mars 2026 à Moroni, puis « AI Forward Comores » ; formations à l'IA et à la donnée.",
  "https://www.dataconsultingkm.com/", { top: true });
R("innovations", "archipel", "Komor-IA", "Startup comorienne d'intelligence artificielle, fondée en 2025",
  "Des modèles d'IA adaptés au contexte africain et un premier jeu de données français-shingazidja, écrit et oral.",
  "https://www.komor-ia.com/");
R("innovations", "archipel", "Mwando : l'IA pour préserver et enseigner le shikomori", "Article de recherche, arXiv",
  "Un assistant virtuel pour apprendre les quatre variantes du shikomori, à partir de proverbes, dictionnaires et leçons.",
  "https://arxiv.org/abs/2607.23481", { lang: "en" });
R("innovations", "archipel", "« L'IA est une véritable révolution technologique »", "Masiwa, entretien avec Dr Soilih Zilé",
  "Le projet de rendre le shikomori utilisable par les outils d'IA en constituant des corpus de textes.",
  "https://masiwa-comores.com/dr-soilih-zile-ingenieur-lia-est-une-veritable-revolution-technologique/");
R("innovations", "archipel", "L'IA, ton premier associé", "Naoufad Saandi, livre",
  "Un guide pour les entrepreneurs qui veulent utiliser l'intelligence artificielle.",
  "https://www.dataconsultingkm.com/ia-ton-premier-associe", { free: false });
R("innovations", "archipel", "Un tournant pour la citoyenneté numérique", "Chagra Media",
  "Les engagements pris à Moroni pour un usage responsable du numérique.",
  "https://chagramedia.com/comores-un-tournant-strategique-pour-la-citoyennete-numerique-acte-a-moroni/");
R("innovations", "archipel", "Stratégie Comores Numérique 2028", "ANADEN, PDF",
  "Le plan national pour le numérique, adopté en 2018 : six axes et l'objectif de porter le numérique à 5 % du PIB.",
  "https://anaden.org/uploads/media/5e3969272d9f8/strat-comores-numerique-v2-3-compresse.pdf");
R("innovations", "archipel", "ANADEN", "Agence nationale de développement du numérique",
  "L'agence qui pilote la numérisation des services publics et le centre de données de l'État.",
  "https://www.anaden.org/");
R("innovations", "ngazidja", "Technopole numérique des Comores", "Site du projet",
  "Un pôle dédié à la formation des jeunes, aux startups et à l'économie numérique.",
  "https://www.technopole.km/projet_technopole");
R("innovations", "ngazidja", "Innov'Lab, premier incubateur du pays", "We are Tech",
  "Lancé en 2017 à Moroni, il a accompagné plus de 60 entreprises.",
  "https://www.wearetech.africa/fr/fils/tech-stars/comores-innovlab-accompagne-les-entrepreneurs-de-lidee-a-la-realisation-de-leur-projet");
R("innovations", "archipel", "La BAD finance la digitalisation de l'économie", "Agence Ecofin",
  "Plus de 9 millions d'euros pour les services publics en ligne, un centre de données et un incubateur universitaire.",
  "https://www.agenceecofin.com/investissement/0210-122087-comores-la-bad-octroie-plus-de-9-millions-d-euros-pour-soutenir-la-digitalisation-de-l-economie");
R("innovations", "archipel", "Attribution des fréquences 5G", "Mayotte Hebdo",
  "En 2025, Yas et Comores Telecom obtiennent les fréquences pour lancer la 5G.",
  "https://www.mayottehebdo.com/actualite/economie/comores-attribution-des-frequences-de-la-5g/");
R("innovations", "archipel", "5G et fibre : 28,8 millions de dollars d'investissement", "Osiris",
  "Le plan de Yas Comores pour la 5G et la fibre optique.",
  "https://osiris.sn/5g-et-fibre-optique-yas-comores-annonce-un-investissement-de-28-8-millions-usd.html");
R("innovations", "archipel", "Banque numérique et paiement mobile", "Osiris, 2026",
  "MVola, Holo, Huri Money et la nouvelle licence de banque numérique : où en est l'inclusion financière.",
  "https://osiris.sn/comores-axian-decroche-une-licence-de-banque-numerique-et-muscle-son-offre.html");
R("innovations", "archipel", "Les Comores et le numérique", "Digital Watch, fiche pays",
  "Câbles sous-marins, 5G, centre de données public et cadre juridique du numérique.",
  "https://dig.watch/countries/comoros", { lang: "en" });
R("innovations", "archipel", "L'intelligence artificielle en Afrique de l'Est et océan Indien", "DG Trésor, lettre économique, 2025",
  "Où en sont les pays de la région, dont les Comores, face à l'IA.",
  "https://www.tresor.economie.gouv.fr/Articles/2025/01/30/lettre-economique-d-aeoi-l-intelligence-artificielle-en-aeoi");
R("innovations", "archipel", "Un an après l'entrée des Comores à l'OMC", "Forum économique mondial, 2025",
  "Ce que l'adhésion à l'Organisation mondiale du commerce change pour l'économie.",
  "https://www.weforum.org/stories/2025/02/world-trade-organization-membership-comoros-economic-goals/", { lang: "en" });
R("innovations", "ngazidja", "Salon des entreprises BIK 2025", "AllAfrica",
  "« Investir aujourd'hui, transformer demain » : le salon des entreprises de Moroni.",
  "https://fr.allafrica.com/stories/202508270155.html");

/* ───────────── Manuels et livres gratuits ───────────── */
R("manuels", "archipel", "Essai sur les Comores", "Alfred Gevrey, 1870, texte intégral sur Wikisource",
  "Le grand livre ancien sur l'archipel : géographie, histoire des sultanats, société, à lire en ligne gratuitement.",
  "https://fr.wikisource.org/wiki/Essai_sur_les_Comores/2", { top: true });
R("manuels", "archipel", "Essai sur les îles Comores (version numérisée)", "Alfred Gevrey, 1870, Gallica (BnF)",
  "Le fac-similé de l'édition originale, page par page.",
  "https://gallica.bnf.fr/ark:/12148/bpt6k62208586/f116.image");
R("manuels", "archipel", "Archipel des Comores : étude géographique", "R. de Maximy, 1968, IRD, accès libre",
  "Une étude géographique complète des quatre îles : relief, climat, population, agriculture.",
  "https://www.documentation.ird.fr/hor/fdi:010029858");
R("manuels", "archipel", "Aperçu géographique de l'archipel des Comores", "IRD, PDF",
  "Une présentation géographique de l'archipel, utile comme base de cours.",
  "https://horizon.documentation.ird.fr/exl-doc/pleins_textes/divers14-07/21671.pdf");
R("manuels", "ndzuwani", "L'islam aux Comores : histoire culturelle d'Anjouan", "Claude Robineau, 1966, IRD",
  "Étude classique sur l'islam, les confréries et la société anjouanaise.",
  "https://www.documentation.ird.fr/hor/fdi:05057");
R("manuels", "archipel", "Ichthyologie et pêche aux Comores", "IRD, 1954",
  "Les poissons et la pêche traditionnelle dans l'archipel.",
  "https://www.documentation.ird.fr/hor/fdi:12917");
R("manuels", "archipel", "Plus de 200 livres de l'IRD en accès libre", "IRD Éditions",
  "Géographie, océan Indien, Madagascar, biodiversité : des livres scientifiques complets à télécharger.",
  "https://www.ird.fr/plus-de-200-ebook-de-ird-editions-en-acces-libre");
R("manuels", "archipel", "Sujets du bac d'histoire-géographie des Comores", "Daria, 2011 à 2018, PDF",
  "Les sujets des années précédentes pour réviser le programme comorien.",
  "https://daria-bac-histoire-geographie.webador.fr/");
R("manuels", "archipel", "Une géographie des Comores (manuel scolaire)", "Note sur le manuel de G. Boissinot, Persée",
  "Présentation du manuel de géographie publié pour les écoles comoriennes en 1989.",
  "https://www.persee.fr/doc/caoum_0373-5834_1991_num_44_174_3394");
R("manuels", "archipel", "Les Comores sur Vikidia", "L'encyclopédie des 8-13 ans",
  "Une présentation simple du pays pour les plus jeunes.",
  "https://fr.vikidia.org/wiki/Comores_(pays)");
R("manuels", "archipel", "Dictionnaires de comorien en ligne", "Lexilogos",
  "Dictionnaires shingazidja et shimaore en ligne, gratuits.",
  "https://www.lexilogos.com/comorien_dictionnaire.htm");
R("manuels", "archipel", "Qu'est-ce que le comorien (shiKomori) ?", "ORELC, leçon gratuite",
  "Première leçon : origines, variantes et écriture de la langue.",
  "https://orelc.ac/academy/FrenchLessons/viewLesson/2");
R("manuels", "archipel", "Atlas des reptiles et amphibiens des Comores", "Muséum national d'Histoire naturelle, 2019",
  "Inventaire illustré des reptiles et amphibiens de l'archipel.",
  "https://sciencepress.mnhn.fr/en/collections/inventaires-biodiversite/atlas-des-reptiles-et-amphibiens-terrestres-de-l-archipel-des-comores");

/* ───────────── Données et cartes ───────────── */
R("donnees", "archipel", "INSEED : statistiques officielles", "Institut national de la statistique",
  "Recensements, enquêtes, séries sur l'inflation, la croissance, la population et la santé.",
  "https://www.inseed-comores.org/", { top: true });
R("donnees", "archipel", "Publications de l'INSEED", "Base de données des publications",
  "Rapports d'enquêtes et séries statistiques à télécharger.",
  "https://inseed-comores.org/publications");
R("donnees", "archipel", "Archive nationale des microdonnées (NADA)", "INSEED",
  "Les données détaillées des recensements (population 2017, agriculture 2004 et 2025).",
  "https://www.nada.inseed-comores.org/index.php/home");
R("donnees", "archipel", "Recensement général de l'agriculture 2025", "INSEED, NADA",
  "73 818 exploitations agricoles recensées dans les trois îles.",
  "https://www.nada.inseed-comores.org/index.php/catalog/16");
R("donnees", "archipel", "Données humanitaires sur les Comores", "Humanitarian Data Exchange (ONU)",
  "Limites administratives, localités, routes, bâtiments, santé : des dizaines de jeux de données ouverts.",
  "https://data.humdata.org/group/com");
R("donnees", "archipel", "Limites administratives et liste des localités", "HDX, OCHA",
  "Îles, préfectures, communes et villages avec leurs codes, au format tableur.",
  "https://data.humdata.org/dataset/comoros-administrative-level-0-3-boundaries");
R("donnees", "archipel", "Points d'intérêt OpenStreetMap", "HDX, Humanitarian OpenStreetMap Team",
  "Écoles, centres de santé, mosquées, commerces… tous les lieux cartographiés dans OpenStreetMap.",
  "https://data.humdata.org/dataset/hotosm_com_points_of_interest");
R("donnees", "archipel", "Divisions administratives des Comores", "GitHub, licence CC BY 4.0",
  "3 îles, 17 préfectures et 55 communes avec leurs coordonnées (JSON, CSV).",
  "https://github.com/open-admin-data/comoros-administrative-divisions");
R("donnees", "archipel", "OpenStreetMap aux Comores", "Wiki OpenStreetMap",
  "Comment la carte libre des Comores est construite, et comment y contribuer.",
  "https://wiki.openstreetmap.org/wiki/FR:Comoros");
R("donnees", "archipel", "Villes et population des Comores", "City Population",
  "Population des villes et villages à chaque recensement.",
  "https://www.citypopulation.de/en/comoros/cities");
R("donnees", "archipel", "Banque mondiale : indicateurs des Comores", "World Bank Open Data",
  "Population, économie, éducation, santé, environnement : les séries depuis 1960.",
  "https://data.worldbank.org/country/comoros", { lang: "en" });
R("donnees", "archipel", "Banque centrale des Comores : publications", "Rapports annuels et bulletins",
  "Statistiques monétaires, balance des paiements et rapports annuels.",
  "https://banque-comores.km/uploads/DOCUMENTS/Rapport_annuel_2019.pdf");
R("donnees", "archipel", "Biodiversité des Comores : rapport GBIF", "GBIF, 2025, PDF",
  "Les observations d'espèces disponibles en accès libre pour l'archipel.",
  "https://analytics-files.gbif.org/country/KM/GBIF_CountryReport_KM.pdf", { lang: "en" });
R("donnees", "archipel", "Centre d'échange sur la biodiversité des Comores", "Convention sur la diversité biologique",
  "Stratégie nationale, rapports et indicateurs sur la biodiversité.",
  "https://km.chm-cbd.net/en/general-information", { lang: "en" });
R("donnees", "archipel", "Aires marines protégées des Comores", "Convention de Nairobi, tableau de bord",
  "Les aires marines protégées et leurs données.",
  "https://nairobiconvention.org/clearinghouse/node/429", { lang: "en" });
R("donnees", "archipel", "Profil environnemental des Comores", "UICN, 2020, PDF",
  "Aires protégées, zones importantes pour les oiseaux, espèces menacées.",
  "https://old.biopama.org/sites/default/files/2020-12/IUCN2020%20ESA%20SoPACA%20Country%20Profile%20-%20Comoros.pdf", { lang: "en" });
R("donnees", "archipel", "Profil de l'eau aux Comores", "FAO Aquastat, PDF",
  "Ressources en eau, climat et agriculture.",
  "https://www.fao.org/fileadmin/user_upload/aquastat/pdf_files/COM_comores_cp.pdf");
R("donnees", "archipel", "Indice de performance environnementale", "Université Yale",
  "Le classement environnemental des Comores, indicateur par indicateur.",
  "https://epi.yale.edu/epi-results/2022/country/com", { lang: "en" });
R("donnees", "archipel", "Les Comores en un coup d'œil", "Wikipédia (anglais)",
  "Le plan détaillé de tous les articles sur le pays : géographie, histoire, culture, économie.",
  "https://en.wikipedia.org/wiki/Outline_of_the_Comoros", { lang: "en" });
R("donnees", "archipel", "Photos libres des Comores", "Wikimedia Commons",
  "Des milliers de photos et cartes libres de droits, classées par lieu.",
  "https://commons.wikimedia.org/wiki/Category:Cities_in_the_Comoros");

/* ───────────── Bibliothèques et archives (ajouts) ───────────── */
R("bibliotheques", "archipel", "Archives nationales d'outre-mer : instruments de recherche", "IREL, ANOM",
  "Les inventaires des archives coloniales, dont celles des Comores et de Madagascar.",
  "https://www.culture.gouv.fr/fr/espace-documentation/bases-de-donnees/Fiches-bases-de-donnees/irel-les-instruments-de-recherche-en-ligne");
R("bibliotheques", "maore", "Catalogue du centre universitaire de Mayotte", "Bibliothèque universitaire",
  "Le catalogue des livres sur Mayotte et les Comores disponibles à Dembeni.",
  "https://cdu.univ-mayotte.fr/opac_css/index.php?lvl=notice_display&id=35947");
R("bibliotheques", "archipel", "Horizon : documents de l'IRD", "Plus de 70 000 documents en accès libre",
  "Le fonds de l'Institut de recherche pour le développement, avec de nombreuses études sur les Comores.",
  "https://www.documentation.ird.fr/hor/fdi:010029858");
R("bibliotheques", "archipel", "Wikisource : textes anciens", "Bibliothèque libre",
  "Textes anciens transcrits et lisibles en ligne, dont l'Essai sur les Comores.",
  "https://fr.wikisource.org/wiki/Essai_sur_les_Comores/2");
