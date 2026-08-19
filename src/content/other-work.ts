import type {OtherWork} from './types';

/**
 * Ces réalisations portent le volume du parcours. Elles restent sur une ligne chacune :
 * la densité les distingue des deux projets détaillés, sans leur faire concurrence.
 */
export const otherWork: readonly OtherWork[] = [
  {
    id: 'fleetbase-tranzak',
    title: {
      fr: 'Extension de paiement Fleetbase / Tranzak',
      en: 'Fleetbase / Tranzak payment extension'
    },
    detail: {
      fr: 'Package Composer Laravel, driver suivant le pattern PaymentGatewayManager, décoration du container.',
      en: 'Laravel Composer package, driver following the PaymentGatewayManager pattern, container decoration.'
    },
    stack: ['Laravel', 'PHP', 'Composer']
  },
  {
    id: 'propriolink',
    title: {
      fr: 'Propriolink',
      en: 'Propriolink'
    },
    detail: {
      fr: 'Projet immobilier Laravel : backend, puis frontend administratif.',
      en: 'Laravel real estate project: backend first, then the admin frontend.'
    },
    stack: ['Laravel', 'PHP'],
    url: 'https://propriolink.com'
  },
  {
    id: 'election-pipeline',
    title: {
      fr: 'Pipeline Big Data électoral',
      en: 'Electoral big data pipeline'
    },
    detail: {
      fr: 'Kafka, PySpark, MongoDB Atlas, analyse de sentiment multilingue.',
      en: 'Kafka, PySpark, MongoDB Atlas, multilingual sentiment analysis.'
    },
    stack: ['Kafka', 'PySpark', 'MongoDB Atlas']
  },
  {
    id: 'spring-cli-generator',
    title: {
      fr: 'Générateur CLI de projets Spring Boot',
      en: 'Spring Boot project CLI generator'
    },
    detail: {
      fr: 'Création de projets Spring Boot en ligne de commande.',
      en: 'Spring Boot project scaffolding from the command line.'
    },
    stack: ['Java', 'Spring Boot', 'CLI']
  },
  {
    id: 'teaching',
    title: {
      fr: 'Enseignement',
      en: 'Teaching'
    },
    detail: {
      fr: 'Cours d’informatique niveau L1 : web statique et systèmes embarqués.',
      en: 'First year computer science: static web and embedded systems.'
    },
    stack: ['HTML', 'CSS', 'Systèmes embarqués']
  }
];
