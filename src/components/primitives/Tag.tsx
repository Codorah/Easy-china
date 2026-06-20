// @ts-nocheck
export function Tag({ children }) {
  return (
    <span
      className="bg-accent/5 text-accent border border-accent/[0.18] px-3 py-[0.45rem] rounded-[20px] text-xs font-semibold hover:bg-accent/10 hover:border-accent/35 hover:-translate-y-px transition-all duration-150 cursor-default"
    >
      {children}
    </span>
  );
}
