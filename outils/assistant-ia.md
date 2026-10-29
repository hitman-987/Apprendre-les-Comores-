# L'assistant du site

L'assistant existe en deux niveaux. Le premier marche tout seul ; le second ajoute une vraie IA.

## Niveau 1 : sans IA (actif, gratuit, sans compte)

À chaque recherche, île ou rubrique, et dans la fenêtre « Poser une question » :

1. il reconnaît le sujet de la question et affiche la **fiche de synthèse** correspondante (`data/fiches.js`) ;
2. il résume **ce que disent les ressources du site** (les 5 plus utiles, avec leur description) ;
3. il indique combien de ressources existent, par rubrique ;
4. si le site a **moins de 3 ressources** sur le sujet, il **cherche sur le web** (Wikipédia, en français puis en anglais)
   et affiche le résultat dans un encadré « Trouvé sur le web », avec les liens vers les articles ;
5. sinon, un lien « Compléter avec une recherche sur le web » permet de lancer cette recherche.

Tout se passe dans le navigateur du visiteur : aucun coût, aucune clé.

## Niveau 2 : agent IA (facultatif, gratuit dans la limite d'un quota)

L'agent rédige une vraie réponse à partir des ressources du site et, si besoin, de Wikipédia.
Il tourne sur Cloudflare Workers AI, dont l'offre gratuite inclut un quota quotidien
(à vérifier sur le site de Cloudflare au moment de la mise en place).

1. Créez un compte gratuit sur <https://dash.cloudflare.com>.
2. Menu **Workers & Pages** → **Créer** → **Créer un Worker**, nommez-le `assistant-comores`, puis **Déployer**.
3. **Modifier le code** : remplacez tout par le contenu de `outils/agent-ia-worker.js`, puis **Déployer**.
4. Dans le Worker : **Paramètres** → **Liaisons** → **Ajouter** → **Workers AI**, nom de la variable : `AI`.
5. Copiez l'adresse du Worker (du type `https://assistant-comores.<compte>.workers.dev`).
6. Collez-la dans `ASSISTANT_API`, en haut de `assets/app.js` (ou envoyez-la à Claude).

L'agent n'accepte que les requêtes venant de `https://hitman-987.github.io` (liste `ALLOWED_ORIGINS`).
Si l'IA ne répond pas, le site revient automatiquement au niveau 1.

## Ajouter un sujet

Ajoutez une fiche dans `data/fiches.js` : un titre, des mots déclencheurs, 2 ou 3 paragraphes
et les mots qui permettent de retrouver les ressources liées.
