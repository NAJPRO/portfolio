# Décisions

Journal des arbitrages structurants, tenu au fil des phases. Chaque entrée dit
pourquoi, pas quoi.

## Phase 1 : fondations

### Next.js 16.3.1, pas 15

Le projet initialisé sur place tourne en 16.3.1. La consigne mentionnait Next 15 ;
l'écart change trois choses concrètes :

- Le middleware s'appelle `proxy` (`src/proxy.ts`, export nommé `proxy`). Le runtime
  est Node, l'edge n'est pas supporté dans `proxy`.
- `params`, `cookies()`, `headers()` sont exclusivement asynchrones.
- Turbopack est le moteur par défaut de `next dev` et `next build`.

Aucune raison de rétrograder : la version installée est celle que Vercel déploiera.

### Segmentation i18n par répertoire `[locale]`

`localePrefix: 'always'` : `/fr` et `/en` sont explicites, la racine `/` redirige. Le
partage d'un lien ne dépend jamais de l'`Accept-Language` du destinataire, et les
balises `hreflang` de la phase 5 pointeront vers des URL stables.

Le layout racine vit dans `src/app/[locale]/layout.tsx`. `hasLocale` y rejette les
segments inconnus en 404 plutôt que de servir la page dans une langue de repli.

### Lecture de la langue via `next/root-params`

`getRequestConfig` lit le segment racine avec `locale()` de `next/root-params`. Le
`requestLocale` de next-intl est déprécié depuis Next 16. Un override explicite garde
la priorité, pour les contextes sans segment racine : la route API de contact
(phase 4) passera sa langue à `getTranslations({locale})`.

### Contenu typé, messages traduits

Deux dépôts distincts, pour deux natures de texte :

- `src/content/*.ts` porte le contenu éditorial (projets, réalisations, compétences,
  hero). Chaque champ traduit est un `Localized<T>`, c'est-à-dire un enregistrement
  couvrant toutes les langues : un texte non traduit casse la compilation.
- `messages/{fr,en}.json` porte les libellés d'interface (navigation, boutons,
  formulaire, validations). Le catalogue français fait référence dans
  `src/types/next-intl.d.ts` : une clé absente de l'anglais devient une erreur de type.

Le contenu reste dans le code parce que son volume est faible, qu'il change rarement,
et que chaque modification mérite une revue au même titre que le reste.

### Structure des blocs de compétences

Un `SkillBlock` porte toujours une liste de `SkillGroup`, y compris quand il n'en
contient qu'un. Cette uniformité garantit que les deux volets du bloc IA (IA appliquée
et développement assisté par IA) restent séparés à l'affichage : ils ne peuvent pas
être aplatis en une seule liste par accident.

### Polices : Geist plutôt que Satoshi

Satoshi vient de Fontshare, qui impose soit un lien CDN à l'exécution, soit le dépôt
manuel des fichiers. Un CDN tiers sur le chemin critique est un mauvais pari pour des
visiteurs sur connexion lente. Geist, prévu comme repli dans la consigne, est servi par
`next/font` depuis le domaine du site, sans requête externe.

Trois familles variables, sous-ensemble latin, `display: swap` :

- Bricolage Grotesque en display, resserré via l'axe `wdth` (88) plutôt que par une
  transformation CSS, qui déformerait le dessin des lettres.
- Geist pour le corps.
- JetBrains Mono pour les valeurs techniques uniquement.

### Jetons de couleur

Les variables portent les noms de la charte (`--bg-deep`, `--accent`, `--text-muted`).
Le mappage Tailwind est déclaré en `@theme inline`, donc les utilitaires pointent vers
ces mêmes variables : une couleur n'existe qu'à un seul endroit.

Le site n'a qu'un thème. `color-scheme: dark` est déclaré explicitement pour que les
contrôles natifs de formulaire suivent, sans surcharge au cas par cas.

`prefers-reduced-motion` est neutralisé globalement dès maintenant, avant l'arrivée de
GSAP en phase 5 : la règle s'appliquera aux animations qui passent par des propriétés
CSS, et le code GSAP devra la doubler pour ses propres timelines.

## Phase 2 : page d'accueil

### Composants serveur par défaut

Toute la page est rendue sur le serveur. Le seul composant client est le sélecteur de
langue, qui a besoin du chemin courant pour proposer la même page dans l'autre langue.
Les ancres de section sont de simples liens `#`, sans routeur : aucun JavaScript
supplémentaire n'est chargé pour naviguer dans la page.

`useTranslations` et `useLocale` fonctionnent dans les composants serveur avec
next-intl 4, donc la langue ne descend pas de props en props.

### Découpage

- `components/layout` : ossature présente sur toutes les pages (en-tête, pied de page,
  gouttière). Le lien d'évitement est le premier élément focalisable du document.
- `components/ui` : primitives sans contenu propre (`Section`, `Tag`, `ActionLink`,
  icônes).
- `components/home` : sections de la page d'accueil, une par bloc de contenu.

Les futures pages projet réutiliseront `Section`, `Tag` et les icônes sans les
redéfinir.

### Carte projet : le lien mène au produit en ligne

L'objectif de conversion est le clic vers un produit qui tourne, donc la carte entière
ouvre le site du produit. Le lien s'étire sur la carte par pseudo-élément : une seule
zone cliquable, un seul arrêt au clavier, et le contour de focus est porté par la carte
plutôt que par le titre seul.

La phase 3 ajoutera dans la carte un second lien vers la page détaillée du projet,
au-dessus du lien étiré.

### Capture de projet : cadre présent avant l'image

Le cadre de capture occupe déjà ses proportions définitives (16/10) avec un visuel de
remplacement. Quand les captures réelles arriveront en phase 3, la mise en page ne
bougera pas.

### Budget de page

Mesures sur le build de production, en gzip pour le texte et taille réelle pour les
polices :

| Ressource | Poids |
| --- | --- |
| JavaScript | 187 ko |
| Polices (3 fichiers préchargés) | 148 ko |
| Document HTML | 8 ko |
| CSS | 5 ko |
| **Total** | **348 ko** |

Deux arbitrages ont produit ce chiffre :

- L'axe optique de Bricolage Grotesque a été retiré de la requête. Il faisait passer le
  fichier de 76 à 128 ko, pour un écart invisible aux tailles employées. L'axe de chasse
  est conservé, c'est lui qui porte le resserrement du display.
- Geist est sous-ensemble en latin et converti en woff2 (32 ko), servi par
  `next/font/local` depuis `src/fonts`.

Le JavaScript est le socle de Next et React, non compressible côté application : la page
n'ajoute qu'un composant client de quelques lignes.

### Détails qui auraient coûté cher plus tard

- Les sections portent `scroll-mt-20` : une ancre s'arrête sous l'en-tête fixe, pas
  dessous. Vérifié, le titre visé se pose à 80 px du haut pour un en-tête de 65 px.
- L'année du pied de page est passée en chaîne au message ICU. En nombre, la locale
  française l'aurait affichée « 2 026 ».
- La grille des compétences est en `items-start` : le bloc IA est nettement plus haut
  que les deux autres, qui n'ont aucune raison de s'étirer à sa hauteur.
- Mesuré à 360 px de large : aucun élément ne dépasse la largeur du document. Sous md,
  l'en-tête ne garde que le nom, Contact et la langue.

## Phase 3 : pages projet et captures

### Chemins traduits

Les adresses sont localisées : `/fr/projets/rendoc` et `/en/projects/rendoc` sont
servies par le même fichier de route, `app/[locale]/projects/[slug]`. La table de
correspondance vit dans `routing.ts`, le proxy fait la réécriture, et une adresse
demandée dans la mauvaise langue redirige au lieu de répondre en 404.

Un site qui met en avant une PWA bilingue ne peut pas afficher des URL anglaises à ses
lecteurs francophones.

Conséquence sur le sélecteur de langue : `usePathname` rend désormais le gabarit interne
(`/projects/[slug]`) et non l'adresse visible. Il faut lui joindre `useParams` pour
reconstruire la cible. TypeScript ne sait pas corréler les deux, d'où la seule
conversion de type du projet, isolée et commentée.

### Captures : un script hors du build

`scripts/capture-shots.mjs` produit les trois captures en 1440x900, converties en WebP
par sharp. Le script n'est pas branché sur le build : les images sont versionnées, donc
un déploiement ne dépend ni d'un navigateur installé sur le serveur, ni de la
disponibilité des trois sites au moment du build.

Deux ajustements ont été nécessaires :

- Playwright télécharge normalement son propre Chromium (150 Mo). Le script utilise
  d'abord le Chrome de la machine (`channel: 'chrome'`), et ne retombe sur le Chromium
  fourni que s'il n'y en a pas.
- L'attente initiale sur le silence réseau faisait échouer Propriolink par expiration de
  délai. Le script attend maintenant le DOM, puis le silence réseau sans l'exiger.

Le script accepte des noms en argument (`node scripts/capture-shots.mjs propriolink`)
pour rejouer une seule capture.

La capture de Propriolink existe dans `public/shots` mais n'est affichée nulle part : le
projet figure dans la liste des autres réalisations, qui doit rester dense et sans
image. Le fichier attend une éventuelle carte dédiée.

### Poids réel des images

`next/image` sert du WebP redimensionné. Mesures pour la variante effectivement
choisie :

| Page | Transféré au premier rendu |
| --- | --- |
| Accueil | ~348 ko, les captures des cartes étant chargées en différé |
| Projet Rendoc | ~371 ko, dont 23 ko de capture |
| Projet Elyra | ~411 ko, dont 63 ko de capture |

La capture d'Elyra est plus lourde parce que sa page d'accueil est bâtie sur une
photographie plein cadre. Les cartes de la page d'accueil restent en chargement différé,
donc elles ne pèsent pas sur le premier rendu.

### Deux liens par carte

La carte ouvre le produit en ligne, un lien explicite en pied de carte ouvre le récit
technique. Ce second lien est posé au-dessus du lien étiré (`relative z-20`), sinon il
serait masqué par lui.

### Élision

« Lire le détail de Elyra » n'est pas français. Les libellés qui reçoivent un nom de
projet sont formulés pour éviter l'élision quel que soit le nom : « Lire le détail du
projet Elyra », et pour le texte alternatif « Elyra : capture de la page d'accueil ».
Le nom d'un futur projet ne réintroduira pas la faute.

## Phase 4 : formulaire de contact

### Un schéma, deux usages

`features/contact/schema.ts` décrit le formulaire une seule fois avec Zod, et sert au
navigateur comme à la route API. Le serveur ne fait donc jamais confiance au client :
il rejoue exactement la même validation.

Les messages produits par Zod sont des codes (`required`, `email`, `messageTooShort`),
pas des phrases. La traduction reste dans les catalogues, et le schéma ne dépend
d'aucune langue.

Les schémas d'étape (`detailSchemas`, `identitySchema`) composent le schéma complet :
la validation d'une étape et celle de l'envoi ne peuvent pas diverger.

### La route API ne renvoie pas de texte

Les réponses portent un code (`validation`, `malformed`, `rateLimited`, `transport`) et,
pour la validation, la liste des champs fautifs. Le client possède les catalogues et rend
la phrase dans la langue courante. Une seule source pour les textes, et une route
utilisable telle quelle par un autre appelant.

### Transport derrière une interface

`lib/mailer.ts` expose `Mailer` et une implémentation console. Brancher un fournisseur
réel consiste à écrire une seconde implémentation et à la choisir dans `getMailer`, sans
toucher à la route ni au formulaire. Le formatage du message est commun aux
implémentations.

La notification est rédigée en français sans passer par les catalogues : elle part vers
une seule boîte, celle du propriétaire du site. Sa langue ne dépend pas de celle du
visiteur.

### Resend appelé en REST, sans son SDK

L'envoi d'un message est un unique POST sur `https://api.resend.com/emails`. Le SDK
officiel envelopperait quinze lignes, en échange d'une dépendance à maintenir, à auditer
et à charger au démarrage à froid de la route. L'API REST est la surface stable du
fournisseur ; c'est elle qui est appelée.

Trois conséquences assumées dans `lib/mailer.ts` :

- Le message part en `text`, jamais en `html`. Rien de ce qu'écrit un visiteur ne peut
  être interprété comme du balisage dans la boîte de réception.
- `Reply-To` porte l'adresse du visiteur, sans nom d'affichage. Répondre écrit donc au
  visiteur et non à l'adresse technique d'expédition, et un nom saisi n'entre jamais
  dans une adresse destinée à être analysée.
- L'appel est borné à dix secondes. Une API qui ne répond pas ne doit pas retenir la
  fonction jusqu'à son propre délai d'exécution : le visiteur reçoit un échec explicite
  plutôt qu'un formulaire figé.

L'objet de l'e-mail est ramené sur une ligne. Le nom passe par `z.string().trim()`, qui
ne garantit rien sur les retours à la ligne internes.

### Ce que fait l'absence de configuration

| Configuration | Effet |
| --- | --- |
| Aucune clé | Repli sur la sortie du serveur. Le formulaire reste utilisable en local sans compte Resend. |
| Clé sans `CONTACT_FROM_EMAIL` | Exception, donc 502 `transport`, et le journal nomme la variable manquante. |
| Clé et expéditeur | Envoi réel. |

Le cas du milieu est volontairement bruyant. Un repli silencieux sur la console
laisserait croire à un envoi réussi alors que le message n'aurait jamais quitté la
machine. Le premier cas, lui, est légitime en développement, mais il ne l'est pas en
production : un avertissement le signale une fois par processus.

Le corps d'erreur renvoyé par Resend est journalisé tel quel. Il décrit la cause
(domaine non vérifié, clé révoquée, quota) et ne contient pas la soumission. La clé,
elle, n'apparaît nulle part dans les journaux.

Vérifié sur le build de production : repli console avec avertissement, 502 sur clé sans
expéditeur, et 502 relayant « API key is invalid » sur un appel réel à Resend.

### Deux protections, deux limites assumées

- Champ leurre masqué. Rempli, la requête reçoit une réponse de succès et rien n'est
  envoyé : le robot n'apprend pas l'existence du piège.
- Limitation à cinq envois par tranche de dix minutes et par adresse. Le compteur vit
  dans la mémoire du processus : sur un hébergement sans état partagé, chaque instance
  compte pour elle. C'est un frein contre l'abus ordinaire, pas une garantie. Un
  compteur partagé demanderait un stockage, hors périmètre à ce stade.

### Accessibilité du parcours

Boutons radio réels sous une apparence de cartes, donc navigation par flèches et annonce
du groupe natives. Le changement d'étape déplace le focus sur le nouveau titre. Les
erreurs sont liées à leur champ par `aria-describedby`, l'échec d'envoi est annoncé par
`role="alert"`, la confirmation par `role="status"`.

### Comportement vérifié sur la route

| Cas | Réponse |
| --- | --- |
| Envoi valide | 201, message écrit dans la sortie du serveur |
| E-mail invalide et message trop court | 400, deux champs fautifs nommés |
| Corps JSON illisible | 400 `malformed` |
| Champ leurre rempli | 201, aucun envoi |
| Sixième envoi depuis la même adresse | 429 `rateLimited` |

## Phase 5 : animations, signature, référencement

### L'élément signature

Le motif du site est le passage d'une donnée en clair à sa forme protégée, le mécanisme
de Rendoc. Il apparaît une seule fois, juste après la grille projets : un numéro de
document devient son empreinte bcrypt au fil du défilement.

Trois contraintes ont guidé la réalisation :

- Les deux chaînes ont la même longueur et partagent la même cellule, caractère par
  caractère. La ligne ne se décale pas pendant la bascule.
- La bascule est pilotée par la position de défilement, donc réversible. Une frappe au
  clavier ne se rejoue pas en arrière : la distinction est ce qui éloigne l'effet du
  cliché du terminal.
- La valeur en clair reste seule lisible par un lecteur d'écran. La forme protégée est
  une représentation visuelle, elle porte `aria-hidden`.

Les deux chaînes sont des illustrations du mécanisme, pas des valeurs réelles.

### Le poids de l'animation, mesuré puis corrigé

Premier essai, GSAP et ScrollTrigger importés normalement : la page d'accueil passait de
348 à 467 ko. Pour des fondus, le compromis était mauvais sur les connexions visées.

Ce qui a été fait :

- GSAP n'est demandé qu'après l'hydratation, et **jamais** si le système du visiteur
  demande moins d'animation. Le module ne pèse plus sur le premier rendu.
- Les blocs animés sont sous la ligne de flottaison. Le temps que GSAP arrive, ils n'ont
  pas encore été atteints, donc la bascule ne se voit pas. La liste des produits du hero
  a perdu son animation pour cette raison : elle est visible d'emblée.
- Le balisage n'est jamais masqué en CSS. Sans JavaScript, la page s'affiche entière.

Le formulaire de contact posait le même problème : son schéma de validation emportait
66 ko compressés pour une section en bas de page. Il est maintenant monté quand il
approche de l'écran. L'envoi passe de toute façon par du JavaScript, donc le rendre côté
serveur n'apportait rien à un visiteur qui n'en a pas ; l'adresse e-mail affichée juste
en dessous, elle, reste dans le HTML.

| Page | Premier rendu |
| --- | --- |
| Accueil | 359 ko |
| Projet | 354 ko |

### Référencement

- URL canonique et `hreflang` par page, `x-default` sur le français. Les chemins étant
  traduits, ils sont calculés par `getPathname` et non par un préfixe.
- `sitemap.xml` déclare chaque page avec ses équivalents de langue : les deux versions
  sont indexées comme une seule page servie en deux langues.
- `robots.txt` exclut `/api/`.
- Vignette de partage rendue à la compilation, une par langue et une par projet, avec le
  rendu commun dans `lib/og-image.tsx`.

Aucun domaine n'est codé en dur : `NEXT_PUBLIC_SITE_URL` d'abord, l'URL de production
fournie par Vercel ensuite, le serveur local en dernier recours. Un domaine inventé
aurait produit des canoniques et un sitemap faux. Voir `.env.example`.

### Les apparitions quittent GSAP pour l'observation d'intersection

Le mécanisme initial masquait les blocs avec `gsap.from` et les révélait sur un
ScrollTrigger. Il laissait des sections définitivement invisibles. Constaté sur le build
de production : la grille projets ne s'affichait plus du tout, captures comprises.

Deux défauts distincts, tous deux inhérents à l'approche :

- `gsap.from` déduit l'état d'arrivée en relevant l'élément, puis rend l'animation en
  différé. Un ScrollTrigger en `once: true` se retire dès qu'il a joué, et emporte avec
  lui le rendu resté en attente. Le bloc gardait alors l'état de départ, opacité zéro,
  alors que l'animation se déclarait terminée à cent pour cent.
- Les positions de déclenchement sont calculées une fois. Or la mise en page continue de
  bouger : le formulaire de contact est monté à l'approche de l'écran, les captures
  arrivent en différé, les polices se substituent. Un bloc dont la position avait glissé
  n'était jamais atteint. Une arrivée directe sur `/fr#contact` suffisait à faire
  disparaître l'en-tête de la section.

Corriger l'un puis l'autre revenait à empiler des rustines sur une approche qui calcule
des positions de défilement pour décider quoi afficher. Les apparitions passent donc à
un `IntersectionObserver` et à une transition CSS :

- Rien n'est calculé. L'observateur réagit à ce que le navigateur voit, y compris après
  un saut vers une ancre ou une restauration de position.
- L'état masqué n'existe que si `data-reveal-state` a été posé par le script. Sans
  JavaScript, la page s'affiche entière, comme avant.
- L'attribut est retiré une fois l'apparition finie. Les éléments retrouvent leurs
  propres transitions : le résidu de `transform` laissé par GSAP neutralisait au passage
  le soulèvement des cartes au survol.
- Le nettoyage est programmé sur la durée connue plutôt que sur `transitionend`, qui ne
  se déclenche pas dans un onglet d'arrière-plan. La précaution prise plus haut contre
  les onglets masqués devient inutile : le pire cas est un bloc affiché sans animation.

GSAP ne sert plus qu'à la signature, qui a besoin d'un défilement asservi. Les pages
projet ne le téléchargent plus.

Vérifié sur le build de production, trois passages sur neuf combinaisons : accueil et
pages projet, français et anglais, 1440 et 390 px, défilement progressif, saut direct en
bas, arrivée sans défilement, et mouvement réduit. Aucun bloc visible à l'écran ne reste
masqué.

### Onglet d'arrière-plan

Un onglet ouvert en arrière-plan (le cas d'un lien ouvert dans un nouvel onglet) gèle
les animations du navigateur. L'état de départ aurait été posé sans jamais être joué,
et les blocs seraient restés invisibles jusqu'au retour du visiteur.

La parade d'alors consistait à ne rien installer tant que la page n'était pas regardée.
Elle a disparu avec le passage à l'observation d'intersection, qui rend le cas inoffensif :
un onglet masqué n'est pas dans l'écran, donc rien ne s'arme, et le nettoyage programmé
sur une durée connue ne dépend d'aucune image d'animation. Le pire cas est un bloc
affiché sans transition, jamais un bloc absent.

La signature, elle, reste asservie au défilement, donc invisible tant que le visiteur
n'est pas descendu jusqu'à elle.

### Audit Lighthouse

Build de production, Chrome sans interface, profil mobile par défaut de l'outil.

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- |
| Accueil | 97 | 100 | 100 | 100 |
| Projet Elyra | 95 | 100 | 100 | 100 |

Décalage cumulé de mise en page nul sur les deux pages. Un défaut a été corrigé au
passage : les liens produits du hero portaient un libellé accessible (« Ouvrir Rendoc »)
qui ne contenait pas leur texte visible (« Rendoc rendoc.org »). Le libellé a été retiré,
le texte du lien suffit.

Le premier audit affichait 92 en référencement, faute d'URL canonique valide : la page
était servie sur un hôte différent de celui déclaré. Avec `NEXT_PUBLIC_SITE_URL`
renseignée, le score passe à 100.
