/**
 * Chargement de GSAP à la demande.
 *
 * L'animation est une amélioration : elle ne doit peser ni sur le premier rendu ni sur
 * le budget de la page. Le module n'est donc demandé qu'après l'hydratation, et jamais
 * si le visiteur a réglé son système sur moins d'animation.
 *
 * Seule la signature `ClearToHash` en dépend : elle a besoin d'un défilement asservi,
 * ce qu'une transition CSS ne sait pas faire. Les apparitions au défilement, elles,
 * n'emploient plus GSAP du tout.
 */
export async function loadGsap() {
  const [{gsap}, {ScrollTrigger}] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);

  gsap.registerPlugin(ScrollTrigger);
  return {gsap, ScrollTrigger};
}
