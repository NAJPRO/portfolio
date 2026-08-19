'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {ZodError, ZodType} from 'zod';
import {Button} from '@/components/ui/Button';
import {site} from '@/content';
import {
  audiences,
  contactSchema,
  detailSchemas,
  FIELD_MAX_LENGTH,
  horizons,
  identitySchema,
  isValidationCode,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  validationMessages,
  type Audience,
  type ValidationCode
} from './schema';
import {RadioCardGroup, SelectField, TextAreaField, TextField} from './fields';

const STEP_COUNT = 3;

interface FormValues {
  audience: Audience | '';
  position: string;
  stack: string;
  projectNature: string;
  horizon: string;
  product: string;
  name: string;
  email: string;
  message: string;
  company: string;
}

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, ValidationCode>>;
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'rateLimited';

const emptyValues: FormValues = {
  audience: '',
  position: '',
  stack: '',
  projectNature: '',
  horizon: '',
  product: '',
  name: '',
  email: '',
  message: '',
  company: ''
};

const stepTitleKeys = {
  audience: 'steps.audience',
  recruiter: 'steps.recruiter',
  client: 'steps.client',
  productPartner: 'steps.productPartner',
  identity: 'steps.identity'
} as const;

const audienceLabelKeys = {
  recruiter: 'audience.recruiter',
  client: 'audience.client',
  productPartner: 'audience.productPartner'
} as const;

const horizonLabelKeys = {
  now: 'horizon.now',
  quarter: 'horizon.quarter',
  later: 'horizon.later'
} as const;

function isFieldName(value: string): value is FieldName {
  return value in emptyValues;
}

/** Une erreur par champ : la première suffit à corriger la saisie. */
function collectErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const [field] = issue.path;
    if (typeof field !== 'string' || !isFieldName(field)) continue;
    if (errors[field] !== undefined) continue;
    if (isValidationCode(issue.message)) errors[field] = issue.message;
  }

  return errors;
}

function validate(schema: ZodType, data: unknown): FieldErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : collectErrors(result.error);
}

export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const headingRef = useRef<HTMLParagraphElement>(null);
  const hasRendered = useRef(false);

  // Le changement d'étape déplace le focus sur le nouveau titre : sans cela, un
  // utilisateur au clavier resterait sur un bouton devenu hors contexte.
  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function update(field: FieldName, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setErrors((current) => ({...current, [field]: undefined}));
  }

  function errorText(code: ValidationCode | undefined) {
    if (!code) return undefined;
    return t(validationMessages[code], {min: MESSAGE_MIN_LENGTH});
  }

  function buildPayload(): unknown {
    const shared = {
      name: values.name,
      email: values.email,
      message: values.message,
      company: values.company,
      locale
    };

    switch (values.audience) {
      case 'recruiter':
        return {
          audience: 'recruiter',
          position: values.position,
          stack: values.stack,
          ...shared
        };
      case 'client':
        return {
          audience: 'client',
          projectNature: values.projectNature,
          horizon: values.horizon,
          ...shared
        };
      case 'productPartner':
        return {
          audience: 'productPartner',
          product: values.product,
          ...shared
        };
      default:
        return shared;
    }
  }

  async function send() {
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(buildPayload())
      });

      if (response.ok) {
        setStatus('sent');
        return;
      }

      setStatus(response.status === 429 ? 'rateLimited' : 'failed');
    } catch {
      setStatus('failed');
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      if (!values.audience) {
        setErrors({audience: 'required'});
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2 && values.audience) {
      const stepErrors = validate(detailSchemas[values.audience], values);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) setStep(3);
      return;
    }

    const identityErrors = validate(identitySchema, values);
    setErrors(identityErrors);
    if (Object.keys(identityErrors).length > 0) return;

    const payload = contactSchema.safeParse(buildPayload());
    if (!payload.success) {
      setErrors(collectErrors(payload.error));
      return;
    }

    void send();
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <p className="font-display text-2xl font-bold">{t('status.sent')}</p>
        <p className="mt-2 text-sm text-ink-muted">{t('status.sentDetail')}</p>
      </div>
    );
  }

  const stepTitleKey =
    step === 1
      ? stepTitleKeys.audience
      : step === 2 && values.audience
        ? stepTitleKeys[values.audience]
        : stepTitleKeys.identity;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl rounded-xl border border-line bg-surface p-5 sm:p-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
        {t('stepCounter', {current: step, total: STEP_COUNT})}
      </p>
      <p
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-xl font-bold outline-none sm:text-2xl"
      >
        {t(stepTitleKey)}
      </p>

      <div className="mt-6 space-y-5">
        {step === 1 ? (
          <RadioCardGroup
            name="audience"
            legend={t('audience.question')}
            value={values.audience}
            error={errorText(errors.audience)}
            onChange={(value) => update('audience', value)}
            options={audiences.map((audience) => ({
              value: audience,
              label: t(audienceLabelKeys[audience])
            }))}
          />
        ) : null}

        {step === 2 && values.audience === 'recruiter' ? (
          <>
            <TextField
              name="position"
              label={t('recruiter.position')}
              value={values.position}
              error={errorText(errors.position)}
              onChange={(value) => update('position', value)}
              maxLength={FIELD_MAX_LENGTH}
            />
            <TextField
              name="stack"
              label={t('recruiter.stack')}
              value={values.stack}
              error={errorText(errors.stack)}
              onChange={(value) => update('stack', value)}
              maxLength={FIELD_MAX_LENGTH}
            />
          </>
        ) : null}

        {step === 2 && values.audience === 'client' ? (
          <>
            <TextField
              name="projectNature"
              label={t('client.projectNature')}
              value={values.projectNature}
              error={errorText(errors.projectNature)}
              onChange={(value) => update('projectNature', value)}
              maxLength={FIELD_MAX_LENGTH}
            />
            <SelectField
              name="horizon"
              label={t('client.horizon')}
              value={values.horizon}
              error={errorText(errors.horizon)}
              onChange={(value) => update('horizon', value)}
              placeholder={t('horizon.placeholder')}
              options={horizons.map((horizon) => ({
                value: horizon,
                label: t(horizonLabelKeys[horizon])
              }))}
            />
          </>
        ) : null}

        {step === 2 && values.audience === 'productPartner' ? (
          <SelectField
            name="product"
            label={t('productPartner.product')}
            value={values.product}
            error={errorText(errors.product)}
            onChange={(value) => update('product', value)}
            placeholder={t('productChoice.placeholder')}
            options={site.liveProducts.map((product) => ({
              value: product.name,
              label: product.name
            }))}
          />
        ) : null}

        {step === 3 ? (
          <>
            <TextField
              name="name"
              label={t('identity.name')}
              value={values.name}
              error={errorText(errors.name)}
              onChange={(value) => update('name', value)}
              autoComplete="name"
              maxLength={FIELD_MAX_LENGTH}
            />
            <TextField
              name="email"
              type="email"
              label={t('identity.email')}
              value={values.email}
              error={errorText(errors.email)}
              onChange={(value) => update('email', value)}
              autoComplete="email"
              maxLength={FIELD_MAX_LENGTH}
            />
            <TextAreaField
              name="message"
              label={t('identity.message')}
              value={values.message}
              error={errorText(errors.message)}
              onChange={(value) => update('message', value)}
              maxLength={MESSAGE_MAX_LENGTH}
            />
          </>
        ) : null}

        {/* Champ leurre : hors du parcours visuel et du parcours au clavier. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="company">{t('honeypot')}</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => update('company', event.target.value)}
          />
        </div>
      </div>

      {status === 'failed' || status === 'rateLimited' ? (
        <p role="alert" className="mt-6 text-sm text-accent">
          {status === 'rateLimited'
            ? t('status.rateLimited', {email: site.email})
            : t('status.failed', {email: site.email})}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 1 ? (
          <Button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(step - 1);
            }}
          >
            {t('buttons.back')}
          </Button>
        ) : null}

        <Button type="submit" variant="primary" disabled={status === 'sending'}>
          {step < STEP_COUNT
            ? t('buttons.continue')
            : status === 'sending'
              ? t('buttons.sending')
              : t('buttons.send')}
        </Button>
      </div>
    </form>
  );
}
