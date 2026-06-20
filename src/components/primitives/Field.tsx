// @ts-nocheck
import { cn } from "@/lib/utils";

const inputClasses = cn(
  "w-full rounded-xl bg-white/60 border border-border/60 px-4 py-3.5 text-sm font-body text-text",
  "shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
  "focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white",
  "outline-none",
  "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
  "placeholder:text-muted/50"
);

export function Field({ label, type = "text", value, onChange, placeholder, options, rows }) {
  return (
    <div className="mb-5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-accent tracking-wide uppercase mb-2">
          {label}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClasses, "cursor-pointer")}
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-white text-text">
              {o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(inputClasses, "resize-y")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}
