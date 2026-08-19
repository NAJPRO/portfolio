# My Portfolio 

Portfolio bilingue (fr/en) d'un architecte backend, adossé à trois produits en
production. Chaque projet mis en avant renvoie vers le site qui tourne, et vers une
page détaillée qui explique la décision technique derrière.

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, next-intl 4.

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_SITE_URL
npm run dev
```

Le serveur écoute sur http://localhost:3000, qui redirige vers `/fr`.

## Variables d'environnement

| Variable | Requise | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommandée | Origine publique du site. Sert de `metadataBase` : URL canoniques, `hreflang`, `sitemap.xml`, `robots.txt`, vignettes de partage. |
| `RESEND_API_KEY` | Pour envoyer | Clé d'API Resend. Absente, le formulaire fonctionne mais écrit dans les journaux au lieu d'envoyer. |
| `CONTACT_FROM_EMAIL` | Avec la clé | Adresse d'expédition, sur un domaine vérifié dans Resend. |
| `CONTACT_TO_EMAIL` | Non | Boîte de réception. Par défaut l'adresse déjà affichée sur le site (`site.email`). |

Aucune de ces variables ne doit porter le préfixe `NEXT_PUBLIC_` en dehors de la
première : ce préfixe inscrit la valeur dans le bundle du navigateur.

### `NEXT_PUBLIC_SITE_URL`

Aucun domaine n'est codé en dur. `src/lib/site-url.ts` résout l'origine dans cet ordre :

1. `NEXT_PUBLIC_SITE_URL`, si elle est définie.
2. `VERCEL_PROJECT_PRODUCTION_URL`, injectée automatiquement par Vercel. Rien à
   configurer, mais elle vaut le domaine `*.vercel.app` tant qu'un domaine propre n'est
   pas rattaché.
3. `http://localhost:3000`, dernier recours pour le développement.

Format attendu : une URL absolue, sans barre oblique finale.

En local, la variable peut rester vide. Un audit Lighthouse la réclame en revanche,
sinon le score de référencement plafonne à 92 faute de canonique valide.

### Resend

1. Créer une clé sur https://resend.com/api-keys, portée `Sending access`.
2. Vérifier le domaine d'envoi sur https://resend.com/domains, puis publier les
   enregistrements DNS proposés. Sans domaine vérifié, Resend n'accepte comme
   expéditeur que `onboarding@resend.dev`, qui ne délivre qu'à l'adresse du titulaire
   du compte : utilisable pour un essai, pas en production.
3. Renseigner les variables.

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_FROM_EMAIL="Portfolio Audin <contact@audin.dev>"
CONTACT_TO_EMAIL=audinjunior1@gmail.com
```

`CONTACT_FROM_EMAIL` accepte l'adresse seule ou la forme `Nom <adresse>`.

Comportement selon la configuration :

| Configuration | Effet |
| --- | --- |
| Aucune clé | Le message est écrit dans la sortie du serveur. En production, un avertissement le signale une fois. |
| Clé sans `CONTACT_FROM_EMAIL` | `502 transport`, et le journal nomme la variable manquante. |
| Clé et expéditeur | Envoi réel. `Reply-To` porte l'adresse du visiteur. |

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack). |
| `npm run build` | Build de production. |
| `npm run start` | Sert le build de production. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run shots` | Recapture les visuels des produits en ligne. |

## Structure

```
src/
  app/
    [locale]/            layout racine, accueil, pages projet, vignettes OG
    api/contact/         route POST du formulaire
    robots.ts sitemap.ts
  components/
    layout/              en-tête, pied de page, gouttière, sélecteur de langue
    ui/                  primitives sans contenu propre (Section, Tag, ActionLink)
    home/                sections de la page d'accueil
    project/             page projet
    motion/              chargement différé de GSAP, animations au défilement
    signature/           bascule clair vers empreinte
  content/               contenu éditorial typé (projets, compétences, hero)
  features/contact/      schéma Zod et formulaire multi-étapes
  i18n/                  routage localisé, configuration next-intl
  lib/                   site-url, metadata, mailer, rendu des vignettes OG
  proxy.ts               redirection de langue (le middleware de Next 16)
messages/                catalogues d'interface fr.json et en.json
public/shots/            captures des produits, versionnées
scripts/                 capture Playwright, hors du build
```

## Deux dépôts de texte

- `src/content/*.ts` porte le contenu éditorial. Chaque champ traduit est un
  `Localized<T>`, c'est-à-dire un enregistrement couvrant toutes les langues : oublier
  une traduction casse la compilation.
- `messages/{fr,en}.json` porte les libellés d'interface. Le catalogue français fait
  référence dans `src/types/next-intl.d.ts` : une clé absente de l'anglais devient une
  erreur de type.

Ajouter un projet mis en avant consiste à ajouter une entrée dans
`src/content/projects.ts`. La grille d'accueil, les pages `/[locale]/projects/[slug]`,
le sitemap et la vignette de partage suivent sans autre modification.

## Internationalisation

Le préfixe de langue est toujours explicite, et les chemins sont traduits :

| Interne | Français | Anglais |
| --- | --- | --- |
| `/` | `/fr` | `/en` |
| `/projects/[slug]` | `/fr/projets/rendoc` | `/en/projects/rendoc` |

La table vit dans `src/i18n/routing.ts`. Le proxy assure la réécriture et redirige une
adresse demandée dans la mauvaise langue au lieu de répondre en 404. Ajouter une langue
demande une entrée dans `locales`, ses variantes de chemin, et un catalogue
`messages/<locale>.json`.

## Formulaire de contact

`POST /api/contact`. Le schéma Zod de `src/features/contact/schema.ts` sert au
navigateur comme au serveur : la validation est rejouée intégralement côté route.

L'envoi passe par Resend (`src/lib/mailer.ts`), derrière l'interface `Mailer`. La
notification part en texte brut vers une seule boîte, rédigée en français quelle que
soit la langue du visiteur : c'est une notification interne, pas une interface.

Les réponses portent un code, jamais une phrase à afficher.

| Cas | Réponse |
| --- | --- |
| Envoi valide | `201 {success: true}` |
| Validation échouée | `400 validation`, avec la liste des champs fautifs |
| Corps JSON illisible | `400 malformed` |
| Plus de 5 envois par tranche de 10 min et par adresse | `429 rateLimited` |
| Transport en échec | `502 transport` |

Le champ leurre rempli produit un `201` sans rien envoyer. La limitation de débit vit
dans la mémoire du processus : sur un hébergement sans état partagé, chaque instance
compte pour elle.

## Captures des produits

`npm run shots` ouvre les trois sites en 1440x900, convertit en WebP et écrit dans
`public/shots`. Le script utilise le Chrome de la machine et ne retombe sur le Chromium
de Playwright qu'à défaut.

Il reste volontairement hors du build : les images sont versionnées, donc un
déploiement ne dépend ni d'un navigateur installé sur le serveur, ni de la
disponibilité des sites au moment du build.

```bash
npm run shots               # les trois
npm run shots propriolink   # un seul
```

Une capture manquante n'empêche rien : retirer le champ `screenshot` du projet dans
`src/content/projects.ts` et le cadre affiche son visuel de remplacement, aux mêmes
proportions.

## Référencement

URL canonique et `hreflang` par page, `x-default` sur le français, `sitemap.xml`
déclarant les équivalents de langue de chaque page, `robots.txt` excluant `/api/`,
vignettes de partage rendues à la compilation (une par langue, une par projet).

Tout cela repose sur l'origine résolue par `getSiteUrl()`. C'est la raison d'être de
`NEXT_PUBLIC_SITE_URL`.

## Déploiement

Cible prévue : Vercel. Le build ne demande aucun service externe.

1. Rattacher le dépôt.
2. Définir `NEXT_PUBLIC_SITE_URL` sur le domaine final, pour les environnements de
   production et de préproduction.
3. Déployer.

Sans cette variable, le site fonctionne mais annonce le domaine `*.vercel.app` dans ses
canoniques et son sitemap.

## Décisions

`DECISIONS.md` tient le journal des arbitrages structurants, phase par phase : pourquoi
Geist plutôt que Satoshi, pourquoi les chemins sont traduits, pourquoi GSAP n'est
téléchargé qu'après l'hydratation, et les mesures de poids qui ont tranché.
