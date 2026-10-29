# Relier le site à un Google Form

Avec un Google Form, n'importe qui peut proposer une ressource **sans compte**.
Les propositions arrivent dans une feuille Google Sheets ; vous choisissez ensuite celles à ajouter au site.

## 1. Créer le formulaire (2 minutes)

1. Ouvrez <https://script.google.com> avec votre compte Google et cliquez sur **Nouveau projet**.
2. Effacez le code présent et collez le contenu de `outils/creer-google-form.gs`.
3. Cliquez sur **Enregistrer**, puis sur **Exécuter** (fonction `creerFormulaire`).
4. Google demande une autorisation : acceptez (le script n'agit que sur votre compte).
5. Ouvrez le **Journal d'exécution** : trois liens s'affichent.

| Lien | À quoi il sert |
|---|---|
| Formulaire à partager | Le formulaire public, à diffuser si besoin |
| Réponses (Google Sheets) | La feuille où arrivent les propositions |
| Lien à envoyer à Claude | Contient les identifiants des champs, pour relier le site |

## 2. Relier le site

Envoyez le **troisième lien** à Claude, ou remplissez vous-même `GOOGLE_FORM` en haut de `assets/app.js` :

```js
const GOOGLE_FORM = {
  action: "https://docs.google.com/forms/d/e/<identifiant>/formResponse",
  entries: { title: "entry.…", url: "entry.…", cat: "entry.…", ile: "entry.…", desc: "entry.…", name: "entry.…" },
};
```

Dans le lien pré-rempli, chaque `entry.123456=TITRE`, `entry.…=LIEN`, etc. indique l'identifiant du champ correspondant,
et la partie `…/viewform` devient `…/formResponse`.

Une fois relié, le bouton du site devient « Envoyer la proposition » et l'envoi se fait directement, sans quitter la page.
