import {useLocale} from 'next-intl';
import {Container} from '@/components/layout/Container';
import {ClearToHash} from '@/components/signature/ClearToHash';
import {site} from '@/content';

/**
 * Le motif ne paraît qu'ici. Répété, il deviendrait un ornement ; posé une fois, juste
 * après la carte de Rendoc, il explique le projet que la page met le plus en avant.
 */
export function SignatureBand() {
  const locale = useLocale();

  return (
    <section className="border-t border-line">
      <Container className="py-16 sm:py-24">
        <div className="max-w-2xl">
          <ClearToHash
            clearValue={site.signature.clearValue}
            hashedValue={site.signature.hashedValue}
          />
          <p className="mt-6 text-sm text-ink-muted sm:text-base">
            {site.signature.caption[locale]}
          </p>
        </div>
      </Container>
    </section>
  );
}
