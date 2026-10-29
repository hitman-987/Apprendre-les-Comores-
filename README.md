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
| `assets/app.js` | La recherche, les filtres, la carte et le formulaire |
| `data/resources.js` | **Toutes les ressources** |

## Ajouter une ressource

- **Depuis le site** : section « Proposer une ressource ». La proposition arrive dans les *Issues* du dépôt.
- **Directement** : ouvrez `data/resources.js`, copiez une ligne `R(...)` dans la bonne rubrique et adaptez-la.

## Mise en ligne gratuite (GitHub Pages)

1. Rendez le dépôt public (Settings → Change visibility).
2. Ouvrez **Settings → Pages** et choisissez **Source : GitHub Actions**.
3. Le site est publié à chaque modification de `main`, à l'adresse
   `https://hitman-987.github.io/Apprendre-les-Comores-/`.
