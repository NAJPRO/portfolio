'use client';

import {useEffect, useRef} from 'react';
import {loadGsap} from '@/components/motion/gsap-client';
import {prefersReducedMotion} from '@/components/motion/reduced-motion';

/**
 * Passage d'une donnée en clair à sa forme protégée, le mécanisme de Rendoc.
 *
 * Les deux chaînes ont la même longueur et occupent la même cellule : chaque caractère
 * se substitue au sien, sans décalage de la ligne. La bascule est pilotée par la
 * position de défilement, donc réversible, et n'a rien d'une frappe au clavier.
 */
export function ClearToHash({
  clearValue,
  hashedValue
}: {
  clearValue: string;
  hashedValue: string;
}) {
  const rootRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    void loadGsap().then(({gsap}) => {
      if (cancelled) return;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 0.4
          }
        });

        timeline
          .to('[data-cell="clear"]', {opacity: 0, duration: 1, stagger: 0.12}, 0)
          .to('[data-cell="hashed"]', {opacity: 1, duration: 1, stagger: 0.12}, 0);
      }, root);

      dispose = () => context.revert();
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  const characters = [...clearValue];
  const hashedCharacters = [...hashedValue];

  return (
    <p
      ref={rootRef}
      className="font-mono text-[clamp(1.15rem,4.6vw,2.5rem)] leading-none tracking-tight"
    >
      {/* La valeur en clair porte le texte accessible ; la forme protégée en est la
          représentation visuelle, sans intérêt pour un lecteur d'écran. */}
      <span className="sr-only">{clearValue}</span>
      <span aria-hidden="true" className="inline-flex">
        {characters.map((character, index) => (
          <span
            // Les caractères se répètent : la position fait partie de la clé.
            key={`${character}-${index}`}
            className="relative inline-block"
          >
            <span data-cell="clear">
              {character === ' ' ? ' ' : character}
            </span>
            <span
              data-cell="hashed"
              className="absolute inset-0 text-accent opacity-0"
            >
              {hashedCharacters[index] ?? ' '}
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}
