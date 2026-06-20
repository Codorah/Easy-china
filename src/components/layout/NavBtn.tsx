// @ts-nocheck
import { cn } from "@/lib/utils";

export function NavBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative border-none cursor-pointer px-4 py-2 rounded-sm text-sm font-semibold tracking-[0.02em] font-body transition-colors duration-150 min-h-[44px] min-w-[44px] group",
        active
          ? "bg-accent-soft text-accent"
          : "bg-transparent text-muted hover:bg-[rgba(26,20,16,0.04)] hover:text-text"
      )}
    >
      {label}
      {/* Underline -- GPU-composited */}
      <span
        className={cn(
          "absolute bottom-1.5 left-[10%] w-[80%] h-0.5 bg-accent rounded-full origin-left transition-transform duration-[180ms] ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </button>
  );
}
