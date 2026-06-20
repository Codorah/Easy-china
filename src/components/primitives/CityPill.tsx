// @ts-nocheck
import { cn } from "@/lib/utils";

export function CityPill({ children, className = "" }) {
  return (
    /* Double-Bezel outer shell */
    <span
      className={cn(
        "inline-flex p-px rounded-full bg-black/[0.03] ring-1 ring-black/[0.06]",
        "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
        "hover:ring-accent/20",
        "cursor-default",
        className
      )}
    >
      {/* Inner pill */}
      <span className="rounded-full bg-white/80 px-5 py-1.5 text-sm font-semibold text-text transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-accent">
        {children}
      </span>
    </span>
  );
}
