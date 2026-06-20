// @ts-nocheck
import { cn } from "@/lib/utils";

export function GoldenBtn({
  children,
  variant = "solid",
  onClick,
  className = "",
  style = {},
  disabled = false,
  ariaLabel,
}) {
  const base = cn(
    "border-none rounded-full py-3 px-8 text-sm font-semibold font-body tracking-[0.02em]",
    "inline-flex items-center justify-center gap-2",
    "transition-all duration-300 outline-none select-none",
    "hover:-translate-y-px active:translate-y-0",
    disabled && "opacity-55 cursor-not-allowed pointer-events-none",
    !disabled && "cursor-pointer"
  );

  const variants = {
    solid: "bg-gradient-to-r from-accent to-accent-strong text-white shadow-sm hover:shadow-accent",
    glow: "bg-gradient-to-r from-accent to-accent-strong text-white shadow-sm hover:shadow-accent",
    outline:
      "bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-white",
    ghost: "bg-transparent text-text hover:bg-accent/5",
    white: "bg-white text-accent shadow-sm hover:shadow-md",
  };

  return (
    <button
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onClick}
      className={cn(base, variants[variant] || variants.solid, className)}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
