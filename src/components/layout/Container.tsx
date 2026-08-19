import type {ReactNode} from 'react';

/**
 * Gouttière unique du site. À 360 px, les 20 px latéraux laissent 320 px de contenu,
 * ce qui reste confortable pour une ligne de texte.
 */
export function Container({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
