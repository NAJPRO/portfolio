import type {Locale} from '@/i18n/routing';

/**
 * Le contenu éditorial vit dans des fichiers typés plutôt que dans un CMS : le volume
 * est faible, il change rarement, et chaque modification passe par une revue de code.
 * Un texte non traduit devient une erreur de compilation.
 */
export type Localized<T = string> = Readonly<Record<Locale, T>>;

/** Valeur technique affichée en JetBrains Mono, accompagnée de sa légende. */
export interface TechnicalFact {
  readonly value: string;
  readonly label: Localized;
}

export interface ProductLink {
  readonly name: string;
  readonly url: string;
}

/** Projet qui dispose de sa propre page et d'une carte dans la grille d'accueil. */
export interface FeaturedProject {
  readonly slug: string;
  readonly name: string;
  readonly url: string;
  /** Renseigné seulement quand la capture existe dans `public/shots`. */
  readonly screenshot?: string;
  readonly category: Localized;
  readonly stack: readonly string[];
  readonly summary: Localized;
  readonly role: Localized;
  readonly narrative: Localized<readonly string[]>;
  readonly angle: Localized;
  readonly facts: readonly TechnicalFact[];
}

/** Réalisation listée sur une ligne, sans page dédiée. */
export interface OtherWork {
  readonly id: string;
  readonly title: Localized;
  readonly detail: Localized;
  readonly stack: readonly string[];
  readonly url?: string;
}

export interface SkillGroup {
  readonly id: string;
  readonly title?: Localized;
  readonly note?: Localized;
  readonly items: readonly string[];
}

/**
 * Un bloc porte toujours une liste de groupes, y compris quand il n'en contient qu'un.
 * La structure garantit que les deux volets du bloc IA restent séparés à l'affichage.
 */
export interface SkillBlock {
  readonly id: string;
  readonly title: Localized;
  readonly groups: readonly SkillGroup[];
}
