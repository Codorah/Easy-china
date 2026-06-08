interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, center = true, className = "" }: Props) {
  return (
    <div className={`mb-14 ${center ? "text-center" : ""} ${className}`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-display font-bold text-[var(--color-text)] mb-4 text-[clamp(var(--text-xl),3vw,var(--text-3xl))] leading-[var(--leading-heading)] tracking-[var(--tracking-title)]">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[var(--color-muted)] leading-[var(--leading-body)] text-[var(--text-md)] ${center ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
