'use client';

import type {ReactNode} from 'react';

const controlBase =
  'w-full rounded-lg border bg-deep px-4 py-3 text-sm text-ink transition-colors duration-200 placeholder:text-ink-muted';

function controlClass(hasError: boolean) {
  return `${controlBase} ${hasError ? 'border-accent' : 'border-line hover:border-ink-muted'}`;
}

function FieldShell({
  name,
  label,
  error,
  children
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-ink-muted">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Attributs d'accessibilité communs : l'erreur est annoncée avec le champ. */
function describedBy(name: string, error?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${name}-error` : undefined
  } as const;
}

export function TextField({
  name,
  label,
  value,
  error,
  onChange,
  type = 'text',
  autoComplete,
  maxLength
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <FieldShell name={name} label={label} error={error}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={controlClass(Boolean(error))}
        {...describedBy(name, error)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  label,
  value,
  error,
  onChange,
  maxLength
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <FieldShell name={name} label={label} error={error}>
      <textarea
        id={name}
        name={name}
        rows={5}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`${controlClass(Boolean(error))} resize-y`}
        {...describedBy(name, error)}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  value,
  error,
  onChange,
  placeholder,
  options
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly {value: string; label: string}[];
}) {
  return (
    <FieldShell name={name} label={label} error={error}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={controlClass(Boolean(error))}
        {...describedBy(name, error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * Le choix du public passe par de vrais boutons radio, masqués visuellement : la
 * navigation par flèches et l'annonce du groupe restent celles du navigateur.
 */
export function RadioCardGroup({
  name,
  legend,
  value,
  error,
  onChange,
  options
}: {
  name: string;
  legend: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  options: readonly {value: string; label: string}[];
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer rounded-lg border border-line bg-surface px-4 py-4 text-sm transition-colors duration-200 hover:border-ink-muted hover:bg-raised has-[:checked]:border-accent has-[:checked]:bg-raised has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
              {...describedBy(name, error)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
