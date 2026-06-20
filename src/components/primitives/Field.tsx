// @ts-nocheck
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full border border-border rounded-lg px-4 py-3 text-sm font-body text-text bg-surface-alt focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white outline-none transition-all duration-200";

export function Field({ label, type = "text", value, onChange, placeholder, options, rows }) {
  return (
    <div className="mb-5 text-left">
      {label && (
        <label className="block text-sm text-accent mb-1.5 font-semibold tracking-wide">
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
