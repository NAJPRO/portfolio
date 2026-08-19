/**
 * Flèche d'ouverture vers l'extérieur. Décorative par défaut : le libellé du lien
 * porte déjà l'information, la dupliquer pour un lecteur d'écran serait du bruit.
 */
export function ArrowUpRight({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M5 11 11 5" />
      <path d="M5.5 5H11v5.5" />
    </svg>
  );
}

/** Flèche de retour, employée par le lien de remontée vers l'accueil. */
export function ArrowLeft({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 8H4" />
      <path d="M7.5 4.5 4 8l3.5 3.5" />
    </svg>
  );
}
