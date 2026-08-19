import {site} from '@/content';
import type {ContactInput} from '@/features/contact/schema';

/**
 * Le transport est derrière une interface : changer de fournisseur consiste à écrire
 * une implémentation et à la sélectionner dans `getMailer`, sans toucher ni à la route
 * API ni au formulaire.
 */
export interface Mailer {
  send(submission: ContactInput): Promise<void>;
}

const audienceLabels: Record<ContactInput['audience'], string> = {
  recruiter: 'recruteur',
  client: 'client',
  productPartner: 'partenaire produit'
};

/** Un objet d'e-mail tient sur une ligne. Le nom saisi, lui, n'en garantit rien. */
function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Le message part vers une seule boîte, celle du propriétaire du site. Il est rédigé en
 * français sans passer par les catalogues : c'est une notification interne, pas une
 * interface, et sa langue ne dépend pas de celle du visiteur.
 */
export function formatSubmission(submission: ContactInput): {
  subject: string;
  body: string;
} {
  const lines = [
    `Public : ${audienceLabels[submission.audience]}`,
    `Nom : ${submission.name}`,
    `E-mail : ${submission.email}`,
    `Langue du site : ${submission.locale}`
  ];

  switch (submission.audience) {
    case 'recruiter':
      lines.push(`Poste : ${submission.position}`, `Stack : ${submission.stack}`);
      break;
    case 'client':
      lines.push(
        `Nature du projet : ${submission.projectNature}`,
        `Horizon : ${submission.horizon}`
      );
      break;
    case 'productPartner':
      lines.push(`Produit : ${submission.product}`);
      break;
  }

  lines.push('', submission.message);

  return {
    subject: singleLine(
      `Contact portfolio : ${submission.name} (${audienceLabels[submission.audience]})`
    ),
    body: lines.join('\n')
  };
}

/** Implémentation de développement : le message est écrit dans la sortie du serveur. */
const consoleMailer: Mailer = {
  async send(submission) {
    const {subject, body} = formatSubmission(submission);
    console.info(`\n[contact] ${subject}\n${body}\n`);
  }
};

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Une API qui ne répond pas ne doit pas retenir la fonction jusqu'à son propre délai
 * d'exécution : le visiteur reçoit un échec explicite plutôt qu'un formulaire figé.
 */
const SEND_TIMEOUT_MS = 10_000;

interface ResendConfig {
  readonly apiKey: string;
  readonly from: string;
  readonly to: string;
}

/**
 * Appel direct de l'API REST de Resend, sans son SDK : l'envoi d'un message est un
 * unique POST, et une dépendance de plus se maintient, s'audite et s'ajoute au démarrage
 * à froid de la route.
 */
function createResendMailer({apiKey, from, to}: ResendConfig): Mailer {
  return {
    async send(submission) {
      const {subject, body} = formatSubmission(submission);

      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          /**
           * Notification en texte brut : rien de ce qu'écrit un visiteur ne peut être
           * interprété comme du balisage dans la boîte de réception.
           */
          text: body,
          /**
           * Répondre au message ouvre une réponse vers le visiteur, pas vers l'adresse
           * technique d'expédition. Seule l'adresse est transmise, sans nom d'affichage :
           * un nom saisi n'a pas à entrer dans une adresse à analyser.
           */
          reply_to: submission.email
        }),
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
      });

      if (!response.ok) {
        // Le corps d'erreur de Resend décrit la cause (domaine non vérifié, clé
        // révoquée, quota). Il ne contient pas la soumission : il est journalisable.
        const reason = await response.text().catch(() => '');
        throw new Error(
          `Resend a répondu ${response.status} : ${singleLine(reason).slice(0, 300)}`
        );
      }
    }
  };
}

let warnedAboutFallback = false;

/**
 * Sans clé, le transport reste la sortie du serveur : le formulaire fonctionne en local
 * sans compte Resend. En production, ce repli signifie que les messages ne quittent pas
 * les journaux, ce qui mérite d'être dit une fois plutôt que découvert plus tard.
 */
export function getMailer(): Mailer {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production' && !warnedAboutFallback) {
      warnedAboutFallback = true;
      console.warn(
        '[contact] RESEND_API_KEY absente : les messages sont écrits dans les journaux ' +
          'et aucun e-mail ne part.'
      );
    }
    return consoleMailer;
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    // Levée plutôt que repli silencieux : la route répond 502 et le journal nomme la
    // variable manquante. Un repli console laisserait croire à un envoi.
    throw new Error(
      'RESEND_API_KEY est définie mais CONTACT_FROM_EMAIL manque : Resend refuse un ' +
        'envoi dont l’expéditeur n’est pas sur un domaine vérifié.'
    );
  }

  return createResendMailer({
    apiKey,
    from,
    // La destination par défaut est l'adresse déjà affichée sur le site. La variable
    // permet de router vers une autre boîte sans modifier le contenu.
    to: process.env.CONTACT_TO_EMAIL ?? site.email
  });
}
