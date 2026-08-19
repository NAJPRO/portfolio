import type { Localized, ProductLink } from "./types";

export interface SiteContent {
  readonly author: string;
  readonly email: string;
  readonly role: Localized;
  readonly location: Localized;
  readonly hero: {
    readonly lead: Localized;
    readonly sub: Localized;
    /** Lieu et disponibilité. Présent dans le contenu, pas encore rendu par `Hero`. */
    readonly meta: Localized;
  };
  /**
   * Les trois produits en ligne, atteignables dès le premier écran : la conversion
   * visée par la page d'accueil est le clic vers un produit qui tourne.
   */
  readonly liveProducts: readonly ProductLink[];
  /**
   * Motif structurant du site : une donnée en clair et sa forme protégée. Les deux
   * chaînes ont la même longueur, condition pour que la substitution ne décale pas la
   * ligne. Elles illustrent le mécanisme, ce ne sont pas des valeurs réelles.
   */
  readonly signature: {
    readonly clearValue: string;
    readonly hashedValue: string;
    readonly caption: Localized;
  };
}

export const site = {
  author: "Audin Junior",
  email: "audinjunior1@gmail.com",
  role: {
    fr: "Architecte logiciel",
    en: "Software architect",
  },
  location: {
    fr: "Douala, Cameroun",
    en: "Douala, Cameroon",
  },
  hero: {
    lead: {
      fr: "Je conçois des architectures logicielles, et je livre les produits qui tournent dessus.",
      en: "I design software architectures, and ship the products that run on them.",
    },
    sub: {
      fr: "Backend Spring Boot, applications Next.js et Flutter, pipelines de données.",
      en: "Spring Boot backends, Next.js and Flutter apps, data pipelines.",
    },
    meta: {
      fr: "Douala, Cameroun. Disponible en remote.",
      en: "Douala, Cameroon. Available remote.",
    },
  },
  liveProducts: [
    { name: "Rendoc", url: "https://rendoc.org" },
    { name: "Elyra", url: "https://elyra.bridge-forms.com" },
    { name: "Propriolink", url: "https://propriolink.com" },
  ],
  signature: {
    clearValue: "CMR-4471-XT-2019",
    hashedValue: "$2b$12$Kq9wPzRe…",
    caption: {
      fr: "Dans Rendoc, un numéro de document n’est jamais stocké en clair. Son empreinte bcrypt suffit au rapprochement.",
      en: "In Rendoc, a document number is never stored in clear text. Its bcrypt fingerprint is enough to match.",
    },
  },
} as const satisfies SiteContent;
