// @ts-nocheck
import { cn } from "@/lib/utils";

export function Tag({ children, className = "" }) {
  return (
    /* Double-Bezel: outer shell */
    <span
      className={cn(
        "inline-flex p-px rounded-full bg-accent/[0.06] ring-1 ring-accent/10",
        "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:-translate-y-px hover:ring-accent/20",
        "cursor-default",
        className
      )}
    >
      {/* Inner pill */}
      <span className="rounded-full bg-accent/[0.04] px-3 py-1 text-accent text-xs font-semibold">
        {children}
      </span>
    </span>
  );
}
