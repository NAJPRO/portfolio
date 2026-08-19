import {ImageResponse} from 'next/og';

export const ogImageSize = {width: 1200, height: 630};
export const ogImageContentType = 'image/png';

/**
 * Rendu commun des vignettes de partage. Le moteur d'images ne lit pas la feuille de
 * style : les jetons de la charte sont donc répétés ici en styles en ligne, une seule
 * fois pour tout le site.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
  footerLabel,
  footerItems
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  footerLabel: string;
  footerItems: readonly string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0B0E14',
          color: '#E8ECF2',
          padding: 72
        }}
      >
        <div
          style={{display: 'flex', width: 96, height: 6, backgroundColor: '#FF6B2C'}}
        />

        <div style={{display: 'flex', flexDirection: 'column'}}>
          {eyebrow ? (
            <div
              style={{
                fontSize: 24,
                letterSpacing: 4,
                color: '#FF6B2C',
                marginBottom: 16
              }}
            >
              {eyebrow.toUpperCase()}
            </div>
          ) : null}
          <div style={{fontSize: 104, fontWeight: 700, letterSpacing: -3}}>
            {title}
          </div>
          <div style={{marginTop: 16, fontSize: 36, color: '#8B95A5', maxWidth: 900}}>
            {subtitle}
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 22, color: '#8B95A5', letterSpacing: 3}}>
            {footerLabel.toUpperCase()}
          </div>
          <div style={{display: 'flex', gap: 32, marginTop: 12, fontSize: 28}}>
            {footerItems.map((item) => (
              <div key={item} style={{color: '#FFA366'}}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    ogImageSize
  );
}
