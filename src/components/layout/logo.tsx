import { cn } from "@/lib/utils";

// Placeholder wordmark — replaced by the final SVG logo in Phase 2
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-tight",
        className,
      )}
    >
      Pragma
      <span aria-hidden="true" className="text-gold">
        .
      </span>
    </span>
  );
}
