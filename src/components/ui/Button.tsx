import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {actionBase, actionVariants, type ActionVariant} from './action';

/** Même géométrie que `ActionLink` : un bouton et un lien d'action se ressemblent. */
export function Button({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ActionVariant;
  children: ReactNode;
}) {
  return (
    <button
      className={`${actionBase} ${actionVariants[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
