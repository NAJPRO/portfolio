import {z} from 'zod';
import {routing} from '@/i18n/routing';
import {site} from '@/content';

export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 2000;
export const FIELD_MAX_LENGTH = 200;

/**
 * Les messages produits par Zod sont des codes, pas des phrases : la traduction reste
 * dans les catalogues, et le schéma est partagé tel quel entre le client et la route API.
 */
export const validationMessages = {
  required: 'validation.required',
  email: 'validation.email',
  messageTooShort: 'validation.messageTooShort',
  tooLong: 'validation.tooLong'
} as const;

export type ValidationCode = keyof typeof validationMessages;

export function isValidationCode(value: string): value is ValidationCode {
  return value in validationMessages;
}

const requiredText = z
  .string()
  .trim()
  .min(2, {error: 'required'})
  .max(FIELD_MAX_LENGTH, {error: 'tooLong'});

export const audiences = ['recruiter', 'client', 'productPartner'] as const;
export type Audience = (typeof audiences)[number];

export const horizons = ['now', 'quarter', 'later'] as const;

const productNames: readonly string[] = site.liveProducts.map(
  (product) => product.name
);

/** Champs propres à chaque public, également employés pour valider l'étape 2. */
export const detailSchemas = {
  recruiter: z.object({
    position: requiredText,
    stack: requiredText
  }),
  client: z.object({
    projectNature: requiredText,
    horizon: z.enum(horizons, {error: 'required'})
  }),
  productPartner: z.object({
    product: z
      .string()
      .refine((value) => productNames.includes(value), {error: 'required'})
  })
} as const satisfies Record<Audience, z.ZodObject>;

/** Champs de l'étape 3. */
export const identitySchema = z.object({
  name: requiredText,
  email: z.email({error: 'email'}).max(FIELD_MAX_LENGTH, {error: 'tooLong'}),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, {error: 'messageTooShort'})
    .max(MESSAGE_MAX_LENGTH, {error: 'tooLong'})
});

const envelope = {
  locale: z.enum(routing.locales, {error: 'required'}),
  /**
   * Champ leurre. Un formulaire rempli par une personne le laisse vide : il est masqué
   * et hors du parcours au clavier. La route décide quoi faire quand il est rempli,
   * le schéma ne le refuse pas, pour ne pas renseigner le robot sur le piège.
   */
  company: z.string().max(FIELD_MAX_LENGTH).optional()
};

export const contactSchema = z.discriminatedUnion('audience', [
  z.object({
    audience: z.literal('recruiter'),
    ...detailSchemas.recruiter.shape,
    ...identitySchema.shape,
    ...envelope
  }),
  z.object({
    audience: z.literal('client'),
    ...detailSchemas.client.shape,
    ...identitySchema.shape,
    ...envelope
  }),
  z.object({
    audience: z.literal('productPartner'),
    ...detailSchemas.productPartner.shape,
    ...identitySchema.shape,
    ...envelope
  })
], {error: 'required'});

export type ContactInput = z.infer<typeof contactSchema>;
