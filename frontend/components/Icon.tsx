export default function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className ?? "ic"} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}
