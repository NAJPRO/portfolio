/**
 * Réglage système du visiteur. Vit à part du chargeur GSAP : les apparitions au
 * défilement le consultent sans avoir besoin de GSAP.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
