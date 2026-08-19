import type {FeaturedProject} from './types';

/**
 * La grille d’accueil consomme ce tableau tel quel : ajouter un projet consiste à
 * ajouter une entrée, sans emplacement réservé ni carte fantôme dans la mise en page.
 */
export const featuredProjects = [
  {
    slug: 'rendoc',
    name: 'Rendoc',
    url: 'https://rendoc.org',
    screenshot: '/shots/rendoc.webp',
    category: {
      fr: 'Application civique',
      en: 'Civic application'
    },
    stack: ['Next.js', 'PWA', 'FR/EN'],
    summary: {
      fr: 'Rapprochement entre une personne qui a perdu un document officiel et celle qui l’a trouvé, sans jamais stocker d’identité en clair.',
      en: 'Matches someone who lost an official document with the person who found it, without ever storing a readable identity.'
    },
    role: {
      fr: 'Conception, architecture et réalisation intégrale, pilotée avec Claude Code.',
      en: 'Design, architecture and full implementation, driven with Claude Code.'
    },
    narrative: {
      fr: [
        'Rendoc met en relation une personne qui a perdu un document officiel et celle qui l’a trouvé. Les deux déclarations alimentent le même index de rapprochement.',
        'Les numéros de documents sont hachés en bcrypt, les noms chiffrés en AES-256. La base ne contient à aucun moment une identité lisible, et le rapprochement continue de fonctionner.',
        'Le score de correspondance est pondéré et se déclenche à partir de 0.65. Les fragments partiels sont pris en charge : un déclarant qui ne se souvient que d’une partie du numéro reste rapprochable.'
      ],
      en: [
        'Rendoc connects a person who lost an official document with the person who found it. Both declarations feed the same matching index.',
        'Document numbers are hashed with bcrypt, names encrypted with AES-256. The database never holds a readable identity, and matching still works.',
        'The match score is weighted and fires from 0.65 up. Partial fragments are supported: someone who recalls only part of the number stays matchable.'
      ]
    },
    angle: {
      fr: 'La contrainte de confidentialité précède la fonctionnalité, et l’architecture existe pour tenir les deux.',
      en: 'The privacy constraint comes before the feature, and the architecture exists to hold both.'
    },
    facts: [
      {
        value: 'bcrypt',
        label: {
          fr: 'Hachage des numéros de document',
          en: 'Document numbers hashed'
        }
      },
      {
        value: 'AES-256',
        label: {
          fr: 'Chiffrement des noms',
          en: 'Names encrypted'
        }
      },
      {
        value: '0.65',
        label: {
          fr: 'Seuil de correspondance',
          en: 'Match threshold'
        }
      }
    ]
  },
  {
    slug: 'elyra',
    name: 'Elyra',
    url: 'https://elyra.bridge-forms.com',
    screenshot: '/shots/elyra.webp',
    category: {
      fr: 'SaaS métier',
      en: 'Business SaaS'
    },
    stack: ['Spring Boot', 'Java', 'PostgreSQL'],
    summary: {
      fr: 'Gestion de restaurants, avec une notation multi-dimensionnelle pondérée et des moyennes dénormalisées en asynchrone.',
      en: 'Restaurant management, with weighted multi-dimensional ratings and averages denormalized asynchronously.'
    },
    role: {
      fr: 'Conception de l’architecture backend et du modèle de données, coordination des développeurs qui implémentent.',
      en: 'Backend architecture and data model design, coordinating the developers who implement it.'
    },
    narrative: {
      fr: [
        'Elyra est une plateforme de gestion de restaurants.',
        'La notation est multi-dimensionnelle et pondérée. Les moyennes sont dénormalisées de façon asynchrone via Spring Events, au lieu d’être recalculées à chaque lecture.',
        'Les conventions imposées à l’équipe couvrent l’enveloppe de réponse ApiResponse<T>, la classe BaseEntity, le soft delete et le découpage Controller, Interface, Impl.'
      ],
      en: [
        'Elyra is a restaurant management platform.',
        'Ratings are multi-dimensional and weighted. Averages are denormalized asynchronously through Spring Events, instead of being recomputed on every read.',
        'Team conventions cover the ApiResponse<T> response envelope, the BaseEntity class, soft delete, and the Controller, Interface, Impl split.'
      ]
    },
    angle: {
      fr: 'Ce projet prouve la capacité à faire tenir des décisions d’architecture par d’autres personnes que soi.',
      en: 'This project shows that architecture decisions hold when other people implement them.'
    },
    facts: [
      {
        value: 'Spring Events',
        label: {
          fr: 'Dénormalisation asynchrone des moyennes',
          en: 'Asynchronous average denormalization'
        }
      },
      {
        value: 'ApiResponse<T>',
        label: {
          fr: 'Enveloppe de réponse imposée à l’équipe',
          en: 'Response envelope enforced across the team'
        }
      },
      {
        value: 'BaseEntity',
        label: {
          fr: 'Socle commun et suppression réversible',
          en: 'Shared base and reversible deletion'
        }
      }
    ]
  }
] as const satisfies readonly FeaturedProject[];

export type FeaturedProjectSlug = (typeof featuredProjects)[number]['slug'];

export function findFeaturedProject(
  slug: string
): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
