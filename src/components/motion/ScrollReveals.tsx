'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {prefersReducedMotion} from './reduced-motion';

/**
 * Apparition des blocs marqués `data-reveal` à leur entrée dans l'écran.
 *
 * Le balisage reste rendu sur le serveur : l'état masqué n'est posé que par ce
 * composant, donc sans JavaScript la page s'affiche entière.
 *
 * L'observation d'intersection remplace un calcul de position de défilement. La
 * distinction compte : une position se périme dès que la mise en page bouge, et le
 * formulaire de contact monté à l'approche de l'écran, les captures chargées en différé
 * et la substitution des polices la font bouger. Un bloc dont la position avait glissé
 * n'était jamais atteint et restait invisible pour de bon. L'observateur, lui, réagit à
 * ce que le navigateur voit, y compris après un saut vers une ancre.
 */

/** Doit rester aligné sur les valeurs de `globals.css`. */
const REVEAL_DURATION_MS = 500;
const STAGGER_MS = 60;

/** Le bloc apparaît quand son haut franchit les 85 % de la hauteur de l'écran. */
const TRIGGER_RATIO = 0.85;
const ROOT_MARGIN = `0px 0px -${Math.round((1 - TRIGGER_RATIO) * 100)}% 0px`;

export function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    const timers = new Set<ReturnType<typeof setTimeout>>();

    function children(block: HTMLElement): HTMLElement[] {
      return Array.from(block.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
      );
    }

    /** Rend le bloc à son état naturel : plus aucune trace de l'animation. */
    function settle(block: HTMLElement) {
      delete block.dataset.revealState;
      for (const child of children(block)) {
        child.style.removeProperty('--reveal-index');
      }
    }

    /**
     * Un bloc déjà franchi à l'hydratation n'est pas masqué : le cacher pour le
     * réafficher aussitôt produirait un battement sous les yeux du visiteur. Ce qu'il
     * regarde déjà n'a pas à apparaître.
     */
    const pending = blocks.filter(
      (block) =>
        block.getBoundingClientRect().top > window.innerHeight * TRIGGER_RATIO
    );

    for (const block of pending) {
      children(block).forEach((child, index) => {
        child.style.setProperty('--reveal-index', String(index));
      });
      block.dataset.revealState = 'armed';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const block = entry.target as HTMLElement;
          observer.unobserve(block);
          block.dataset.revealState = 'shown';

          /**
           * Le nettoyage est programmé sur la durée connue de l'animation plutôt que
           * sur `transitionend`, qui ne se déclenche pas dans un onglet d'arrière-plan
           * et laisserait le bloc figé dans son état de transition.
           */
          const total =
            REVEAL_DURATION_MS + STAGGER_MS * Math.max(children(block).length - 1, 0);
          timers.add(setTimeout(() => settle(block), total + 50));
        }
      },
      {rootMargin: ROOT_MARGIN}
    );

    for (const block of pending) observer.observe(block);

    return () => {
      observer.disconnect();
      for (const timer of timers) clearTimeout(timer);
      // Un démontage en cours d'animation ne doit jamais laisser un bloc masqué.
      for (const block of pending) settle(block);
    };
  }, [pathname]);

  return null;
}
