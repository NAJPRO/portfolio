import type {AnchorHTMLAttributes, ReactNode} from 'react';
import {actionBase, actionVariants, type ActionVariant} from './action';

export function ActionLink({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ActionVariant;
  children: ReactNode;
}) {
  return (
    <a
      className={`${actionBase} ${actionVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
