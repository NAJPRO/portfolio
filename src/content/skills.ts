import type {SkillBlock} from './types';

/**
 * Le bloc IA porte deux groupes distincts. Les fusionner ferait passer une pratique
 * de développement pour une compétence de data engineering, ce qui n’est pas le cas.
 */
export const skillBlocks: readonly SkillBlock[] = [
  {
    id: 'backend',
    title: {
      fr: 'Backend et architecture',
      en: 'Backend and architecture'
    },
    groups: [
      {
        id: 'backend-core',
        items: [
          'Java',
          'Spring Boot',
          'Modélisation de données',
          'Conception d’API',
          'PostgreSQL',
          'Conventions d’équipe'
        ]
      }
    ]
  },
  {
    id: 'product',
    title: {
      fr: 'Produit et interfaces',
      en: 'Product and interfaces'
    },
    groups: [
      {
        id: 'product-core',
        items: ['Next.js', 'Flutter', 'Laravel', 'PWA', 'i18n']
      }
    ]
  },
  {
    id: 'ai',
    title: {
      fr: 'IA',
      en: 'AI'
    },
    groups: [
      {
        id: 'ai-applied',
        title: {
          fr: 'IA appliquée',
          en: 'Applied AI'
        },
        note: {
          fr: 'Analyse de sentiment multilingue par transformer, sur un flux Kafka traité en PySpark.',
          en: 'Multilingual transformer sentiment analysis, over a Kafka stream processed with PySpark.'
        },
        items: ['Kafka', 'PySpark', 'MongoDB Atlas', 'Transformers']
      },
      {
        id: 'ai-assisted-development',
        title: {
          fr: 'Développement assisté par IA',
          en: 'AI assisted development'
        },
        note: {
          fr: 'Rendoc a été architecturé puis réalisé avec Claude Code. Spécification et modèle de données écrits d’abord, implémentation pilotée par phases, documentation qui commente le pourquoi des décisions.',
          en: 'Rendoc was architected, then built with Claude Code. Spec and data model written first, implementation driven phase by phase, documentation that records why decisions were made.'
        },
        items: ['Claude Code', 'Spécification préalable', 'Livraison par phases']
      }
    ]
  }
];
