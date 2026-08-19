import type {ReactNode} from 'react';

/** Pilule discrète pour un libellé technique : stack, outil, technologie. */
export function Tag({children}: {children: ReactNode}) {
  return (
    <li className="inline-flex items-center rounded-full border border-line bg-deep px-2.5 py-1 font-mono text-xs text-ink-muted">
      {children}
    </li>
  );
}

export function TagList({
  items,
  className = ''
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}
