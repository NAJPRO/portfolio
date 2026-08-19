import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {FeaturedProject} from '@/content';

/** Dimensions des captures produites par le script Playwright. */
const SHOT_WIDTH = 1440;
const SHOT_HEIGHT = 900;

/**
 * Cadre de la capture. Quand le fichier manque, le cadre garde ses proportions et
 * affiche le nom du projet : la mise en page ne bouge pas selon qu'une capture existe
 * ou non, et l'absence ne se lit pas comme une erreur.
 */
export function ProjectShot({
  project,
  sizes,
  priority = false
}: {
  project: FeaturedProject;
  sizes: string;
  priority?: boolean;
}) {
  const t = useTranslations('project');

  if (!project.screenshot) {
    return (
      <div
        className="flex w-full items-center justify-center border-b border-line bg-surface"
        style={{aspectRatio: `${SHOT_WIDTH} / ${SHOT_HEIGHT}`}}
      >
        <span className="font-display text-2xl font-bold text-ink-muted">
          {project.name}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={project.screenshot}
      alt={t('shotAlt', {name: project.name})}
      width={SHOT_WIDTH}
      height={SHOT_HEIGHT}
      sizes={sizes}
      priority={priority}
      className="w-full border-b border-line bg-surface"
    />
  );
}
