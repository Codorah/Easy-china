// @ts-nocheck
export function CityPill({ children }) {
  return (
    <span
      className="bg-surface-alt text-text border border-border px-5 py-[0.45rem] rounded-full text-sm font-semibold hover:bg-accent/[0.07] hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(201,48,44,0.1)] transition-all duration-150 cursor-default"
    >
      {children}
    </span>
  );
}
