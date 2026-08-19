export type ActionVariant = 'primary' | 'secondary';

export const actionBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-200';

/**
 * L'orange plein est réservé à l'action principale d'un écran. Le contour partage la
 * même géométrie pour que les deux se posent sur une même ligne sans ajustement.
 */
export const actionVariants: Record<ActionVariant, string> = {
  primary: 'bg-accent text-deep hover:bg-accent-soft',
  secondary: 'border border-line text-ink hover:border-ink-muted hover:bg-raised'
};
