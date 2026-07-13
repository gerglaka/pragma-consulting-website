import { cn } from "@/lib/utils";

// Pragma mark: labyrinth-P line art (public/pragma-mark.svg). Painted via CSS
// mask (.logo-mark) so one cached file serves both themes — navy on light,
// off-white on dark. The mark is decorative; the wordmark carries the name.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className="logo-mark size-8 shrink-0" />
      <span className="font-display text-xl font-bold tracking-tight">
        Pragma
      </span>
    </span>
  );
}
