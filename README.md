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
| `assets/ui.js` | Thème clair/sombre, accessibilité, navigation, retour en haut, animations |
| `data/resources.js` | **Toutes les ressources** |
| `data/fiches.js` | Les fiches de synthèse de l'assistant |
| `data/places.js` | Les lieux de la carte et leurs coordonnées |
| `ressources.html`, `sitemap.xml` | Pages pour les moteurs de recherche (générées) |
| `outils/` | Création du Google Form, agent IA (Cloudflare Worker) et guides |

## Référencement (Google, Bing…)

- Titre, description, balises de partage (Open Graph), données structurées (schema.org) et image d'aperçu dans `index.html`.
- `ressources.html` (toutes les ressources en HTML simple) et `sitemap.xml` sont générés par `node outils/generer-pages.js` :
  **relancez cette commande après chaque ajout de ressources**.
- Déclarez le site et `sitemap.xml` dans Google Search Console et Bing Webmaster Tools.

## Accessibilité

Le bouton « Accessibilité » en haut de page règle : thème (automatique, clair, sombre), taille du texte,
police adaptée à la dyslexie (OpenDyslexic), espacement renforcé, contraste renforcé et réduction des animations.
Les choix sont gardés dans le navigateur du visiteur. Le site s'ouvre toujours en haut de page.

## La carte

Carte Leaflet avec fonds libres : plan (OpenStreetMap, avec un plan Esri de secours), satellite avec routes et noms de lieux (Esri) et relief (OpenTopoMap).
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
