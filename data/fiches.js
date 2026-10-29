// Fiches de synthèse utilisées par l'assistant pour résumer une recherche.
// Chaque fiche :
//   id      : identifiant court
//   title   : titre affiché
//   keys    : mots ou expressions qui déclenchent la fiche (sans accents, en minuscules)
//   text    : le résumé, en quelques paragraphes courts
//   find    : mots qui servent à retrouver les ressources liées
//   see     : fiches proches à proposer ensuite

const FICHES = [
  {
    id: "archipel", title: "Les Comores en bref",
    keys: ["comores", "archipel", "pays", "union des comores", "presentation", "histoire"],
    text: [
      "L'archipel des Comores compte quatre îles volcaniques dans le canal du Mozambique, entre l'Afrique de l'Est et Madagascar : Ngazidja (Grande Comore), Mwali (Mohéli), Ndzuwani (Anjouan) et Maore (Mayotte).",
      "Trois îles forment l'Union des Comores, indépendante depuis le 6 juillet 1975, avec Moroni pour capitale. Mayotte est restée française et est devenue un département en 2011.",
      "La culture mêle héritages bantou, swahili, arabe, persan, malgache et français. L'islam y est central, et la langue commune est le shikomori.",
    ],
    find: ["comores", "archipel", "histoire"], see: ["precolonial", "colonisation", "independance"],
  },
  {
    id: "ngazidja", title: "Ngazidja (Grande Comore)",
    keys: ["ngazidja", "grande comore", "grande-comore", "moroni"],
    text: [
      "C'est la plus grande île de l'archipel et la plus peuplée. Moroni, la capitale de l'Union, y possède une médina et un vieux port.",
      "L'île est dominée par le Karthala (2 361 m), l'un des plus grands volcans actifs du monde. Ses plages les plus réputées sont Maloudja, Bouni, Chomoni et Itsandra.",
      "Ngazidja est aussi le cœur du grand mariage (anda), le rite social qui fait d'un homme un notable.",
    ],
    find: ["ngazidja", "grande comore", "moroni", "karthala"], see: ["karthala", "grand-mariage", "plages"],
  },
  {
    id: "mwali", title: "Mwali (Mohéli)",
    keys: ["mwali", "moheli", "fomboni", "nioumachoua", "itsamia"],
    text: [
      "La plus petite et la plus préservée des îles de l'Union. Sa capitale est Fomboni.",
      "Le parc marin de Mohéli, créé en 2001, est devenu parc national en 2015, et l'île est reconnue réserve de biosphère par l'UNESCO. Les plages d'Itsamia accueillent chaque année la ponte de milliers de tortues vertes, et les baleines à bosse passent au large pendant l'hiver austral.",
      "Mohéli est aussi l'île de la reine Djoumbé Fatima, qui y régna au XIXe siècle.",
    ],
    find: ["mwali", "moheli", "itsamia", "nioumachoua"], see: ["tortues", "djoumbe-fatima", "plages"],
  },
  {
    id: "ndzuwani", title: "Ndzuwani (Anjouan)",
    keys: ["ndzuwani", "anjouan", "mutsamudu", "domoni"],
    text: [
      "Surnommée « l'île aux parfums », Anjouan est la plus montagneuse de l'archipel et le cœur de la production d'ylang-ylang.",
      "Mutsamudu, l'ancienne capitale du sultanat, garde sa médina et sa citadelle ; Domoni est l'une des plus vieilles cités de l'île. Le lac Dzialandzé et le mont Ntingui sont ses grandes randonnées.",
      "C'est au large d'Anjouan qu'a été pêché en 1952 le cœlacanthe qui a fait connaître l'archipel au monde scientifique.",
    ],
    find: ["ndzuwani", "anjouan", "mutsamudu", "domoni", "dzialandze"], see: ["ylang", "coelacanthe", "randonnees"],
  },
  {
    id: "maore", title: "Maore (Mayotte)",
    keys: ["maore", "mayotte", "mamoudzou", "dzaoudzi", "petite-terre", "petite terre", "mahorais"],
    text: [
      "Mayotte est formée de Grande-Terre et de Petite-Terre, entourées d'un des plus grands lagons fermés du monde. Mamoudzou en est la principale ville.",
      "Cédée à la France par le sultan Andriantsoly en 1841, l'île a voté pour rester française lors des consultations des années 1970, puis est devenue un département en 2011. Son statut reste contesté par l'Union des Comores.",
      "À voir : le mont Choungui, le lac Dziani Dzaha, les plages de Moya et de Saziley, et le musée de Mayotte (MuMa) à Dzaoudzi.",
    ],
    find: ["maore", "mayotte", "mamoudzou", "dzaoudzi", "choungui"], see: ["question-mayotte", "andriantsoly", "randonnees"],
  },
  {
    id: "karthala", title: "Le Karthala",
    keys: ["karthala", "volcan", "eruption", "caldeira", "cratere"],
    text: [
      "Le Karthala (2 361 m) domine Ngazidja. C'est l'un des plus grands volcans actifs du monde, avec une immense caldeira au sommet ; ses dernières grandes éruptions datent des années 2000.",
      "L'ascension se fait en une longue journée ou sur deux jours, idéalement pendant la saison sèche (mai à octobre). Les sentiers sont peu balisés : un guide local est fortement conseillé.",
    ],
    find: ["karthala"], see: ["randonnees", "ngazidja"],
  },
  {
    id: "medinas", title: "Les médinas et les sultanats",
    keys: ["medina", "sultanat", "sultan", "mosquee", "unesco", "patrimoine", "citadelle"],
    text: [
      "Avant la colonisation, chaque île était divisée en sultanats souvent rivaux, liés au monde swahili et au commerce de l'océan Indien.",
      "En 2026, six médinas des sultanats historiques (quatre à Ngazidja, deux à Ndzuwani) ont été inscrites au patrimoine mondial de l'UNESCO. Ce sont les premiers sites comoriens sur la liste : mosquées, palais et remparts en pierre et corail.",
    ],
    find: ["medina", "sultan", "unesco", "mutsamudu", "domoni", "itsandra"], see: ["precolonial", "djoumbe-fatima", "said-ali"],
  },
  {
    id: "precolonial", title: "Les origines et l'époque des sultanats",
    keys: ["origine", "peuplement", "shirazi", "swahili", "precolonial", "archeologie", "dembeni", "sima", "ancien", "moyen age"],
    text: [
      "Les îles sont peuplées dès la fin du premier millénaire par des populations bantoues et austronésiennes ; les fouilles de sites comme Sima (Anjouan) ou Dembeni (Mayotte) en témoignent.",
      "À partir des XIe-XIIe siècles, le commerce relie l'archipel à la côte swahilie, au golfe Persique et à l'Arabie. La tradition attribue aux « Shirazi » la fondation de nombreuses dynasties. L'islam s'implante, et les sultanats se multiplient jusqu'au XIXe siècle.",
    ],
    find: ["shirazi", "swahili", "sultan", "sima", "origine", "precolonial", "avant la france"], see: ["medinas", "colonisation", "esclavage"],
  },
  {
    id: "colonisation", title: "La colonisation française",
    keys: ["colonisation", "colonial", "colonie", "protectorat", "1886", "1912", "bambao", "1915"],
    text: [
      "La France prend Mayotte en 1841, puis impose son protectorat aux trois autres îles en 1886. En 1912, l'archipel devient une colonie rattachée à Madagascar.",
      "De grandes sociétés coloniales, comme la Société Bambao, s'approprient une grande partie des terres. Les Comoriens résistent, notamment lors du soulèvement de 1915 en Grande Comore.",
      "Après 1946, les Comores deviennent un territoire d'outre-mer doté d'une autonomie croissante, menée notamment par Saïd Mohamed Cheikh.",
    ],
    find: ["colonial", "colonisation", "protectorat", "bambao"], see: ["independance", "said-mohamed-cheikh", "question-mayotte"],
  },
  {
    id: "independance", title: "L'indépendance et ses suites (1975 à nos jours)",
    keys: ["independance", "1975", "6 juillet", "coup d'etat", "coup", "president", "politique", "1978", "1989", "separatisme", "azali"],
    text: [
      "Le 6 juillet 1975, Ahmed Abdallah proclame unilatéralement l'indépendance ; Mayotte reste française. Moins d'un mois plus tard, il est renversé.",
      "Ali Soilihi mène une révolution radicale de 1976 à 1978, puis est renversé par des mercenaires dirigés par Bob Denard, qui ramènent Ahmed Abdallah au pouvoir. Celui-ci est assassiné en 1989.",
      "Les décennies suivantes sont marquées par de nouveaux coups d'État et par la crise séparatiste d'Anjouan et de Mohéli en 1997. La Constitution de 2001 crée l'Union des Comores, avec une présidence tournante entre les îles.",
    ],
    find: ["1975", "independance", "abdallah", "soilih", "mercenaire", "coup", "chefs d'etat"], see: ["ali-soilihi", "ahmed-abdallah", "mercenaires"],
  },
  {
    id: "question-mayotte", title: "La question de Mayotte",
    keys: ["question de mayotte", "mayotte francaise", "referendum", "rattachement", "departement", "kwassa"],
    text: [
      "Lors des consultations de 1974 et 1976, Mayotte vote pour rester française, contrairement aux trois autres îles. L'Union des Comores et l'ONU considèrent depuis que l'île fait partie des Comores.",
      "Mayotte devient département français en 2011. La séparation a de lourdes conséquences humaines, notamment les traversées en kwassa-kwassa depuis Anjouan.",
    ],
    find: ["mayotte", "maore", "neocoloniale", "insoumis"], see: ["maore", "independance", "andriantsoly"],
  },
  {
    id: "mercenaires", title: "Bob Denard et les mercenaires",
    keys: ["mercenaire", "denard", "bob denard", "garde presidentielle"],
    text: [
      "Le mercenaire français Bob Denard intervient dans plusieurs coups d'État aux Comores : en 1975, en 1978 contre Ali Soilihi, puis en 1995.",
      "De 1978 à 1989, ses hommes encadrent la garde présidentielle d'Ahmed Abdallah et pèsent lourdement sur la vie politique du pays.",
    ],
    find: ["mercenaire", "denard", "1978"], see: ["independance", "ali-soilihi", "ahmed-abdallah"],
  },
  {
    id: "esclavage", title: "L'esclavage et la traite",
    keys: ["esclavage", "esclave", "traite", "makua", "engages"],
    text: [
      "L'archipel a été à la fois un lieu de passage et une destination de la traite dans l'océan Indien, notamment depuis le Mozambique. Des esclaves travaillaient dans les plantations et les maisons des notables.",
      "L'esclavage est aboli à Mayotte en 1846. Le sujet reste peu étudié ; les travaux d'Ibouroi Ali Tabibou et d'Ali Ibrahim en sont les références récentes.",
    ],
    find: ["esclav", "makua", "engages"], see: ["precolonial", "colonisation"],
  },
  {
    id: "djoumbe-fatima", title: "Djoumbé Fatima",
    keys: ["djoumbe", "fatima", "reine", "reine de moheli"],
    text: [
      "Djoumbé Fatima (vers 1837–1878) est la reine de Mohéli au XIXe siècle. Fille du sultan Abderremane, un prince venu de Madagascar, elle est couronnée encore enfant.",
      "Son règne se joue entre les influences française, malgache et zanzibarite ; la France fait expulser son époux zanzibarite en 1860. Elle reste l'une des grandes figures féminines de l'histoire comorienne.",
    ],
    find: ["djoumbe", "fatima", "abderremane"], see: ["mwali", "medinas"],
  },
  {
    id: "said-ali", title: "Le sultan Saïd Ali",
    keys: ["said ali", "said ali ben said omar", "sultan de ngazidja"],
    text: [
      "Saïd Ali ben Saïd Omar revendique l'autorité sur toute la Grande Comore à la fin du XIXe siècle et règne de 1892 à 1912.",
      "C'est sous son règne que la France impose son protectorat et que la Société Bambao s'empare d'une grande partie des terres de l'île.",
    ],
    find: ["said ali"], see: ["colonisation", "medinas"],
  },
  {
    id: "andriantsoly", title: "Andriantsoly et la cession de Mayotte",
    keys: ["andriantsoly", "andriantsouli", "1841", "cession"],
    text: [
      "Andriantsoly, ancien roi sakalava de Madagascar devenu sultan de Mayotte, cède l'île à la France par le traité du 25 avril 1841.",
      "Cette cession est à l'origine du statut à part de Mayotte, et sa légitimité est encore débattue aujourd'hui.",
    ],
    find: ["andriantsoly", "1841"], see: ["maore", "question-mayotte"],
  },
  {
    id: "said-mohamed-cheikh", title: "Saïd Mohamed Cheikh",
    keys: ["said mohamed cheikh", "cheikh"],
    text: [
      "Médecin originaire de Grande Comore (1904–1970), Saïd Mohamed Cheikh préside le Conseil de gouvernement de 1962 à sa mort en 1970.",
      "Il incarne la période d'autonomie interne qui précède l'indépendance.",
    ],
    find: ["said mohamed cheikh"], see: ["colonisation", "independance"],
  },
  {
    id: "ahmed-abdallah", title: "Ahmed Abdallah",
    keys: ["ahmed abdallah", "abdallah", "pere de l'independance"],
    text: [
      "Né à Anjouan (1919–1989), Ahmed Abdallah proclame l'indépendance le 6 juillet 1975, ce qui lui vaut le surnom de « père de l'indépendance ».",
      "Renversé en août 1975, il revient au pouvoir en 1978 avec l'aide des mercenaires de Bob Denard et gouverne jusqu'à son assassinat en novembre 1989.",
    ],
    find: ["abdallah"], see: ["independance", "mercenaires", "ali-soilihi"],
  },
  {
    id: "ali-soilihi", title: "Ali Soilihi",
    keys: ["ali soilihi", "soilihi", "soilih", "mongozi", "revolution"],
    text: [
      "Ali Soilihi (1937–1978) dirige les Comores de 1976 à 1978. Il lance une révolution socialiste radicale : rejet des traditions coûteuses comme le grand mariage, réforme de l'administration, mobilisation de la jeunesse.",
      "Il est renversé en mai 1978 par les mercenaires de Bob Denard et tué quelques semaines plus tard. Sa figure reste très discutée.",
    ],
    find: ["soilih", "imberbes"], see: ["independance", "mercenaires", "ahmed-abdallah"],
  },
  {
    id: "grand-mariage", title: "Le grand mariage (anda)",
    keys: ["grand mariage", "anda", "mariage", "notable", "coutume"],
    text: [
      "À Ngazidja, le grand mariage (anda) est bien plus qu'une noce : il permet à un homme d'accéder au statut de notable et de prendre la parole dans la communauté.",
      "Les fêtes durent plusieurs jours et coûtent très cher. Elles se concentrent en juillet et août, quand la diaspora rentre au pays.",
    ],
    find: ["mariage", "anda"], see: ["ngazidja", "musique"],
  },
  {
    id: "musique", title: "Le twarab et la musique comorienne",
    keys: ["musique", "twarab", "taarab", "chanson", "chanteur", "chanteuse", "nawal", "salim ali amir", "maalesh", "danse"],
    text: [
      "Le twarab, venu de Zanzibar, s'installe aux Comores à la fin du XIXe siècle ; les premiers orchestres apparaissent au début du XXe. Il accompagne encore les grands mariages.",
      "D'autres musiques rythment la vie des îles (mgodro, chigoma, sambe). Parmi les artistes connus : Salim Ali Amir, Nawal et Maalesh.",
    ],
    find: ["twarab", "taarab", "musique", "nawal", "maalesh", "salim ali amir"], see: ["grand-mariage", "litterature"],
  },
  {
    id: "litterature", title: "La littérature comorienne",
    keys: ["litterature", "roman", "ecrivain", "auteur", "poesie", "conte", "toihiri", "zamir", "hatubou", "elbadawi", "attoumani"],
    text: [
      "La littérature comorienne en français naît en 1985 avec La République des imberbes de Mohamed Toihiri, suivi du Kafir du Karthala.",
      "Depuis, Salim Hatubou a fait connaître les contes, Soeuf Elbadawi le théâtre, Nassur Attoumani la littérature mahoraise, et Ali Zamir a été primé pour Anguille sous roche (Prix Senghor 2016).",
    ],
    find: ["roman", "toihiri", "zamir", "hatubou", "elbadawi", "attoumani", "litterature"], see: ["musique", "cinema", "shikomori"],
  },
  {
    id: "cinema", title: "Le cinéma comorien",
    keys: ["cinema", "film", "realisateur", "realisatrice", "documentaire"],
    text: [
      "Le cinéma comorien est jeune. La réalisatrice Hachimiya Ahamada est l'une de ses figures, avec La Résidence Ylang-Ylang, L'Ivresse d'une oasis et Zanatany.",
      "De nombreux documentaires racontent l'histoire de l'archipel, de la Société Bambao à la question de Mayotte. Un festival international de cinéma se tient aux Comores.",
    ],
    find: ["film", "documentaire", "ahamada", "cinema"], see: ["litterature", "independance"],
  },
  {
    id: "shikomori", title: "Le shikomori (langue comorienne)",
    keys: ["shikomori", "comorien", "langue", "parler", "dictionnaire", "shingazidja", "shindzuani", "shimwali", "shimaore", "vocabulaire"],
    text: [
      "Le shikomori est une langue bantoue proche du swahili. Il a quatre variantes, une par île : shingazidja, shimwali, shindzuani et shimaore.",
      "Pour commencer : le site ORELC (dictionnaire, conjugueur, leçons), l'application Luha, et des listes de vocabulaire de base. Choisissez la variante de l'île qui vous intéresse.",
    ],
    find: ["shikomori", "comorien", "orelc", "luha", "shingazidja", "vocabulaire"], see: ["archipel", "litterature"],
  },
  {
    id: "cuisine", title: "La cuisine comorienne",
    keys: ["cuisine", "recette", "plat", "manger", "mataba", "pilao", "langouste", "mkatra", "gastronomie"],
    text: [
      "La cuisine comorienne repose sur le riz, le lait de coco, le manioc, la banane et le poisson, avec des influences africaines, arabes et indiennes.",
      "Plats à connaître : le mataba (feuilles de manioc au coco), le pilao (riz épicé), la langouste à la vanille, le mkatra foutra (pain au coco) et le m'tsolola (poisson et banane verte au coco).",
    ],
    find: ["cuisine", "recette", "mataba", "pilao", "manger"], see: ["restaurants", "ylang"],
  },
  {
    id: "ylang", title: "L'ylang-ylang, la vanille et les épices",
    keys: ["ylang", "ylang-ylang", "parfum", "vanille", "girofle", "distillerie", "epice"],
    text: [
      "Les Comores sont parmi les premiers producteurs mondiaux d'huile essentielle d'ylang-ylang, utilisée en parfumerie ; Anjouan concentre une grande part de la production, avec de nombreuses distilleries artisanales.",
      "La vanille et le clou de girofle sont les autres grandes cultures d'exportation de l'archipel.",
    ],
    find: ["ylang", "vanille", "distillerie"], see: ["ndzuwani", "cuisine"],
  },
  {
    id: "coelacanthe", title: "Le cœlacanthe",
    keys: ["coelacanthe", "poisson", "fossile vivant", "coelacanthes", "football", "can 2022"],
    text: [
      "Le cœlacanthe, poisson que l'on croyait disparu depuis des millions d'années, est redécouvert en Afrique du Sud en 1938. En 1952, un deuxième spécimen est pêché près de Domoni, à Anjouan, ce qui montre que l'espèce vit dans les eaux comoriennes.",
      "Il est devenu un symbole national : l'équipe de football s'appelle les Cœlacanthes. Pour sa première Coupe d'Afrique, en 2022, elle a atteint les huitièmes de finale.",
    ],
    find: ["coelacanthe"], see: ["ndzuwani", "nature"],
  },
  {
    id: "tortues", title: "Tortues, baleines et parc national de Mohéli",
    keys: ["tortue", "baleine", "dauphin", "parc national", "parc marin", "biosphere", "plongee"],
    text: [
      "Mohéli abrite le parc national de Mohéli, réserve de biosphère de l'UNESCO. Les plages d'Itsamia sont l'un des grands sites de ponte de la tortue verte dans l'océan Indien.",
      "Les baleines à bosse et les dauphins se voient au large des îles pendant l'hiver austral. Le parc est aussi un très beau site de plongée.",
    ],
    find: ["tortue", "baleine", "biosphere", "parc", "plongee", "itsamia"], see: ["mwali", "nature", "plages"],
  },
  {
    id: "nature", title: "Nature et biodiversité",
    keys: ["nature", "biodiversite", "faune", "flore", "oiseau", "foret", "roussette", "endemique", "environnement"],
    text: [
      "Les îles abritent de nombreuses espèces qu'on ne trouve nulle part ailleurs : oiseaux endémiques, petits-ducs propres à chaque île, roussette de Livingstone à Mohéli et Anjouan.",
      "Les forêts d'altitude sont menacées, notamment à Anjouan, par la déforestation. Côté mer, récifs, herbiers et mammifères marins font la richesse de l'archipel.",
    ],
    find: ["nature", "oiseau", "foret", "biodiversite", "volcan"], see: ["tortues", "coelacanthe", "karthala"],
  },
  {
    id: "randonnees", title: "Randonner aux Comores",
    keys: ["randonnee", "randonner", "rando", "trek", "sentier", "marche", "ascension", "sommet", "lac"],
    text: [
      "Les grandes randonnées de l'archipel : le Karthala à Ngazidja, le lac Dzialandzé et le mont Ntingui à Anjouan, les forêts de Mohéli, le mont Choungui et le lac Dziani Dzaha à Mayotte.",
      "La meilleure saison est la saison sèche, de mai à octobre. Les sentiers sont rarement balisés : partez avec un guide local, de l'eau et de quoi vous couvrir en altitude.",
    ],
    find: ["randonnee", "karthala", "choungui", "dzialandze", "ntingui", "dziani", "sentier"], see: ["karthala", "plages", "nature"],
  },
  {
    id: "plages", title: "Plages et fonds marins",
    keys: ["plage", "baignade", "snorkeling", "lagon", "mer", "corail"],
    text: [
      "Les plages les plus citées : Maloudja, Bouni, Chomoni, Itsandra et Galawa à Ngazidja ; Nioumachoua et Itsamia à Mohéli ; Moya à Anjouan ; Moya, Saziley et N'Gouja à Mayotte.",
      "Mohéli et le lagon de Mayotte sont les meilleurs endroits pour la plongée et le snorkeling. Respectez les tortues : pas de lumière ni de bruit lors des pontes.",
    ],
    find: ["plage", "maloudja", "bouni", "chomoni", "plongee", "lagon"], see: ["tortues", "randonnees"],
  },
  {
    id: "restaurants", title: "Où manger et dormir",
    keys: ["restaurant", "resto", "hotel", "hebergement", "dormir", "lodge", "ou manger"],
    text: [
      "À Moroni, les adresses les mieux notées par les voyageurs sont L'Escale, Coraya Express et Mo Café. À Mohéli, le Laka Lodge est le seul hébergement dans le parc marin.",
      "Mayotte a l'offre la plus large ; l'annuaire gourmand de Mayotte Hebdo en fait le tour. Ailleurs, les avis en ligne sont rares : demandez conseil sur place.",
    ],
    find: ["restaurant", "hotel", "lodge", "gourmand"], see: ["cuisine", "plages"],
  },
  {
    id: "innovations", title: "Les Comores aujourd'hui : numérique et IA",
    keys: ["intelligence artificielle", "ia", "numerique", "innovation", "startup", "5g", "internet", "technologie", "digital", "avancee", "aujourd'hui", "mobile money", "komor-ia"],
    text: [
      "Les Comores sont reliées à Internet par câble sous-marin depuis 2011 (EASSy), puis par d'autres câbles comme 2Africa. En 2025, Yas et Comores Telecom ont lancé la 5G, et un centre de données public a été inauguré pour les services de l'État.",
      "Le paiement mobile s'est développé avec MVola, Holo et Huri Money. La stratégie « Comores Numérique 2028 » fixe le cap, et des incubateurs comme Innov'Lab accompagnent les jeunes entreprises à Moroni.",
      "Côté intelligence artificielle, un premier forum de l'IA s'est tenu à Moroni en mars 2026. La startup Komor-IA et des chercheurs (projet Mwando) construisent les premiers corpus et outils en shikomori. Il n'existe pas encore de stratégie nationale sur l'IA.",
    ],
    find: ["numerique", "intelligence artificielle", "5g", "komor-ia", "mwando", "incubateur", "startup", "digital", "banque numerique"], see: ["shikomori", "archipel"],
  },
];

// Fiche à afficher quand on choisit une île sur la carte ou une rubrique.
const FICHE_ILE = { ngazidja: "ngazidja", mwali: "mwali", ndzuwani: "ndzuwani", maore: "maore" };
const FICHE_RUBRIQUE = {
  randonnees: "randonnees", plages: "plages", manger: "restaurants", histoire: "precolonial",
  culture: "musique", langue: "shikomori", cuisine: "cuisine", nature: "nature", livres: "litterature", videos: "cinema", innovations: "innovations",
};
