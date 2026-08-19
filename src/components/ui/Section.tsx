import type {ReactNode} from 'react';
import {Container} from '@/components/layout/Container';

/**
 * Ossature commune des sections : filet de séparation, ancre décalée sous l'en-tête
 * fixe, et un titre qui reste au même niveau typographique partout.
 */
export function Section({
  id,
  title,
  lede,
  children
}: {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line">
      <Container className="py-16 sm:py-20 lg:py-28">
        <header data-reveal className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          {lede ? <p className="mt-3 text-ink-muted">{lede}</p> : null}
        </header>
        <div className="mt-10 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
