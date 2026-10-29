# L'assistant de résumé

## Ce qu'il fait aujourd'hui (gratuit, sans serveur)

Quand on cherche un sujet, choisit une île ou une rubrique, le site affiche un **résumé** avant les ressources :

- il reconnaît le sujet de la question (« Qui était Ali Soilihi ? », « randonner sur le Karthala »…) ;
- il affiche la fiche de synthèse correspondante (`data/fiches.js`), rédigée à partir des ressources du site ;
- il indique combien de ressources ont été trouvées, par rubrique, et lesquelles consulter en premier ;
- il propose des sujets proches pour continuer ;
- sans fiche sur le sujet, il résume ce que disent les ressources trouvées.

Tout se passe dans le navigateur : pas de coût, pas de compte, pas de limite, et cela fonctionne sur GitHub Pages.

Pour ajouter un sujet, ajoutez une fiche dans `data/fiches.js` (titre, mots déclencheurs, résumé, mots pour retrouver les ressources).

## Brancher une vraie IA plus tard (facultatif)

Le site est prêt à appeler un service d'IA : il suffit de renseigner `ASSISTANT_API` en haut de `assets/app.js`.
Le site envoie la question, la fiche et les ressources trouvées, et attend en retour `{ "answer": "…" }`.

Une IA ne peut pas être appelée directement depuis une page publique sans exposer une clé secrète.
Il faut donc un petit service intermédiaire. Une option gratuite pour un trafic modeste :
un *Worker* Cloudflare avec Workers AI (offre gratuite avec un quota quotidien, à vérifier au moment de la mise en place).
