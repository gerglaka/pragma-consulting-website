import { cn } from "@/lib/utils";

// Pragma logo: minimal enso-like open circle (process, continuity) with a
// precise gold square at its core (precision, the "pragma" — the deed).
// Placeholder by design — swap the SVG paths when the final logo is ready.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="size-6 text-primary"
        fill="none"
      >
        <path
          d="M16 3.5 A12.5 12.5 0 1 0 28.5 16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="12.5" y="12.5" width="7" height="7" rx="1" fill="var(--gold)" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight">
        Pragma
      </span>
    </span>
  );
}
