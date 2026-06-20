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
  icon: Icon,
}) {
  const base = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold font-body tracking-[0.02em]",
    "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none select-none",
    "active:scale-[0.98]",
    disabled && "opacity-55 cursor-not-allowed pointer-events-none",
    !disabled && "cursor-pointer"
  );

  const variants = {
    solid: cn(
      "bg-gradient-to-r from-accent to-accent-strong text-white px-6 py-3 text-sm",
      "shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
      "hover:shadow-accent hover:-translate-y-0.5"
    ),
    glow: cn(
      "bg-gradient-to-r from-accent to-accent-strong text-white px-6 py-3 text-sm",
      "shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
      "hover:shadow-accent hover:-translate-y-0.5",
      "animate-pulse-glow"
    ),
    outline: cn(
      "border-2 border-accent text-accent px-6 py-3 text-sm bg-transparent",
      "hover:bg-accent hover:text-white hover:-translate-y-0.5",
      "hover:shadow-accent"
    ),
    ghost: cn(
      "bg-transparent text-text px-5 py-2.5 text-sm",
      "hover:bg-accent/5 hover:-translate-y-0.5"
    ),
    white: cn(
      "bg-white text-accent px-6 py-3 text-sm",
      "shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
      "hover:shadow-lg hover:-translate-y-0.5"
    ),
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
      {/* Button-in-Button: nested circle for icon/arrow */}
      {Icon && (
        <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
          <Icon size={14} />
        </span>
      )}
    </button>
  );
}
