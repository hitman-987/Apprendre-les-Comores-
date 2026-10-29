/**
 * Crée le Google Form « Proposer une ressource » et la feuille Google Sheets qui reçoit les réponses.
 *
 * Mode d'emploi : voir outils/google-form.md
 * 1. Ouvrir https://script.google.com, cliquer sur « Nouveau projet ».
 * 2. Remplacer tout le code par ce fichier, enregistrer, puis cliquer sur « Exécuter ».
 * 3. Autoriser l'accès demandé (c'est votre propre compte Google).
 * 4. Copier les deux liens affichés dans le « Journal d'exécution ».
 */
function creerFormulaire() {
  const RUBRIQUES = [
    "Lieux à visiter", "Randonnées", "Plages et fonds marins", "Manger et dormir", "Histoire",
    "Personnalités", "Livres", "Vidéos et films", "Culture et musique", "Apprendre le shikomori",
    "Cuisine", "Nature et faune", "Études et recherches", "Presse et podcasts", "Bibliothèques en ligne",
  ];
  const ILES = [
    "Tout l'archipel", "Ngazidja · Grande Comore", "Mwali · Mohéli", "Ndzuwani · Anjouan", "Maore · Mayotte",
  ];

  const form = FormApp.create("Proposer une ressource · Apprendre les Comores");
  form.setDescription(
    "Un livre, une vidéo, une randonnée, un bon restaurant, une étude sur les Comores ? " +
    "Proposez-le : chaque proposition est relue avant d'être ajoutée au site."
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage("Merci ! Votre proposition sera ajoutée au site après vérification.");

  const titre = form.addTextItem().setTitle("Titre de la ressource").setRequired(true);
  const lien = form.addTextItem().setTitle("Lien").setRequired(true);
  const rubrique = form.addListItem().setTitle("Rubrique").setChoiceValues(RUBRIQUES);
  const ile = form.addListItem().setTitle("Île").setChoiceValues(ILES);
  const pourquoi = form.addParagraphTextItem().setTitle("Pourquoi la recommandez-vous ?");
  const nom = form.addTextItem().setTitle("Votre nom ou pseudo (facultatif)");

  const feuille = SpreadsheetApp.create("Propositions · Apprendre les Comores");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, feuille.getId());

  // Une réponse pré-remplie, jamais envoyée, sert à révéler les identifiants des champs.
  const exemple = form.createResponse()
    .withItemResponse(titre.createResponse("TITRE"))
    .withItemResponse(lien.createResponse("LIEN"))
    .withItemResponse(rubrique.createResponse(RUBRIQUES[0]))
    .withItemResponse(ile.createResponse(ILES[0]))
    .withItemResponse(pourquoi.createResponse("POURQUOI"))
    .withItemResponse(nom.createResponse("NOM"));

  Logger.log("Formulaire à partager : " + form.getPublishedUrl());
  Logger.log("Réponses (Google Sheets) : " + feuille.getUrl());
  Logger.log("Lien à envoyer à Claude pour relier le site : " + exemple.toPrefilledUrl());
}
