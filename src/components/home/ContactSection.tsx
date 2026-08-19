import {useTranslations} from 'next-intl';
import {Section} from '@/components/ui/Section';
import {ContactFormLoader} from '@/features/contact/ContactFormLoader';
import {site} from '@/content';

/**
 * La segmentation des publics vit dans le formulaire, nulle part ailleurs : le reste
 * du site s'adresse à tout le monde de la même voix.
 */
export function ContactSection() {
  const t = useTranslations();

  return (
    <Section
      id="contact"
      title={t('sections.contact.title')}
      lede={t('sections.contact.lede')}
    >
      <ContactFormLoader />

      <p className="mt-6 text-sm text-ink-muted">
        {t.rich('contact.fallback', {
          email: site.email,
          mail: (chunks) => (
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-ink transition-colors duration-200 hover:text-accent"
            >
              {chunks}
            </a>
          )
        })}
      </p>
    </Section>
  );
}
