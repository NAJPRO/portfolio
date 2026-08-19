'use client';

import {useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';

/**
 * Le formulaire et son schéma de validation pèsent 66 ko compressés, pour une section
 * en bas de page que la plupart des visites n'atteignent jamais. Il est donc chargé
 * quand il approche de l'écran, et non au premier rendu.
 *
 * L'envoi passe de toute façon par du JavaScript : le rendre côté serveur n'apporterait
 * rien à un visiteur qui n'en a pas. L'adresse e-mail affichée juste en dessous, elle,
 * reste dans le HTML.
 */
const ContactForm = dynamic(
  () => import('./ContactForm').then((module) => module.ContactForm),
  {ssr: false}
);

export function ContactFormLoader() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      // Marge confortable : le chargement se termine avant que la section soit lue.
      {rootMargin: '400px'}
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  // La hauteur n'est réservée que tant que le formulaire n'est pas là. Une fois monté,
  // c'est lui qui donne sa hauteur au bloc, sans laisser de vide sous la carte.
  return (
    <div ref={anchorRef} className={shouldMount ? undefined : 'min-h-[26rem]'}>
      {shouldMount ? <ContactForm /> : null}
    </div>
  );
}
