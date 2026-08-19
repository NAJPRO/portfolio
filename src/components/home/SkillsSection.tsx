import {useLocale, useTranslations} from 'next-intl';
import {Section} from '@/components/ui/Section';
import {TagList} from '@/components/ui/Tag';
import {skillBlocks} from '@/content';

/**
 * Chaque bloc rend ses groupes tels qu'ils sont déclarés. Les deux volets du bloc IA
 * gardent donc leur titre et leur explication propres, sans fusion possible.
 */
export function SkillsSection() {
  const t = useTranslations('sections.skills');
  const locale = useLocale();

  return (
    <Section id="skills" title={t('title')}>
      {/* items-start : chaque bloc s'arrête à sa hauteur propre, le bloc IA étant
          nettement plus haut que les deux autres. */}
      <div data-reveal className="grid items-start gap-5 sm:gap-6 lg:grid-cols-3">
        {skillBlocks.map((block) => (
          <section
            key={block.id}
            className="rounded-xl border border-line bg-surface p-5 sm:p-6"
          >
            <h3 className="font-display text-xl font-bold">
              {block.title[locale]}
            </h3>

            <div className="mt-5 space-y-6">
              {block.groups.map((group) => (
                <div key={group.id}>
                  {group.title ? (
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      {group.title[locale]}
                    </h4>
                  ) : null}
                  {group.note ? (
                    <p className="mt-2 text-sm text-ink-muted">
                      {group.note[locale]}
                    </p>
                  ) : null}
                  <TagList items={group.items} className="mt-3" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
