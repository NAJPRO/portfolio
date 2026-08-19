import {useLocale, useTranslations} from 'next-intl';
import {Section} from '@/components/ui/Section';
import {TagList} from '@/components/ui/Tag';
import {ArrowUpRight} from '@/components/ui/icons';
import {otherWork} from '@/content';

/**
 * Liste dense, une ligne par réalisation. Aucune carte, aucune image : cette section
 * porte le volume du parcours sans disputer l'attention aux deux projets détaillés.
 */
export function OtherWorkSection() {
  const t = useTranslations('sections.otherWork');
  const locale = useLocale();

  return (
    <Section id="other-work" title={t('title')}>
      <ul data-reveal className="border-t border-line">
        {otherWork.map((work) => (
          <li
            key={work.id}
            className="grid gap-3 border-b border-line py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8"
          >
            <div>
              <h3 className="font-medium">
                {work.url ? (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-accent"
                  >
                    {work.title[locale]}
                    <ArrowUpRight className="size-3.5 text-ink-muted transition-colors duration-200 group-hover:text-accent" />
                  </a>
                ) : (
                  work.title[locale]
                )}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                {work.detail[locale]}
              </p>
            </div>
            <TagList items={work.stack} className="sm:justify-end" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
