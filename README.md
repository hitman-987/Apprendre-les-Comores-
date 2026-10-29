# Apprendre les Comores

Un site qui rassemble les meilleures ressources pour découvrir les quatre îles des Comores
(Ngazidja, Mwali, Ndzuwani et Maore) : livres, vidéos, lieux à visiter, randonnées, plages,
restaurants, histoire, personnalités, langue, cuisine, nature, études, presse et bibliothèques en ligne.

## Voir le site en local

Ouvrez `index.html` dans un navigateur. Aucune installation n'est nécessaire.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `assets/style.css` | Le design |
| `assets/app.js` | La recherche, les filtres et le formulaire |
| `assets/assistant.js` | L'assistant : résumé, discussion, recherche web, agent IA |
| `assets/map.js` | La carte interactive (Leaflet) |
| `data/resources.js` | **Toutes les ressources** |
| `data/fiches.js` | Les fiches de synthèse de l'assistant |
| `data/places.js` | Les lieux de la carte et leurs coordonnées |
| `outils/` | Création du Google Form, agent IA (Cloudflare Worker) et guides |

## La carte

Carte Leaflet avec fonds libres : plan (CARTO / OpenStreetMap), satellite (Esri) et relief (OpenTopoMap).
Les repères placent les ressources sur les lieux qu'elles citent ; les lieux se règlent dans `data/places.js`.

## L'assistant

Chaque recherche, île ou rubrique affiche d'abord un résumé (fiches de `data/fiches.js` et ressources du site),
complété par Wikipédia quand le site n'a pas assez d'informations. Le bouton « Poser une question » ouvre une discussion.
Un agent IA gratuit peut être branché : voir `outils/assistant-ia.md`.

## Ajouter une ressource

- **Depuis le site** : section « Proposer une ressource ». Sans Google Form relié, la proposition arrive dans les *Issues* du dépôt ; avec un Google Form (voir `outils/google-form.md`), elle arrive dans une feuille Google Sheets, sans compte.
- **Directement** : ouvrez `data/resources.js`, copiez une ligne `R(...)` dans la bonne rubrique et adaptez-la.

## Mise en ligne gratuite (GitHub Pages)

1. Rendez le dépôt public (Settings → Change visibility).
2. Ouvrez **Settings → Pages** et choisissez **Source : GitHub Actions**.
3. Le site est publié à chaque modification de `main`, à l'adresse
   `https://hitman-987.github.io/Apprendre-les-Comores-/`.
