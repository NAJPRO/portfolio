import {useTranslations} from 'next-intl';
import {Container} from '@/components/layout/Container';
import {site} from '@/content';

export function SiteFooter() {
  const t = useTranslations();
  // Passé en chaîne : un nombre serait formaté selon la langue, et 2026 deviendrait 2 026.
  const year = String(new Date().getFullYear());

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${site.email}`}
          className="font-mono text-sm text-ink-muted transition-colors duration-200 hover:text-accent"
        >
          {site.email}
        </a>
        <p className="font-mono text-xs text-ink-muted">
          {t('footer.rights', {year})}
        </p>
      </Container>
    </footer>
  );
}
