import {useTranslations} from 'next-intl';
import {Section} from '@/components/ui/Section';
import {ProjectCard} from '@/components/home/ProjectCard';
import {featuredProjects} from '@/content';

/**
 * Deux colonnes à partir de md. La grille absorbe un troisième projet sans
 * ajustement, et n'affiche aucun emplacement en attente.
 */
export function ProjectsSection() {
  const t = useTranslations('sections.projects');

  return (
    <Section id="projects" title={t('title')} lede={t('lede')}>
      <ul data-reveal className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </Section>
  );
}
