import Image from "next/image";
import { cn } from "@/lib/utils";

// Browser-window mockup. Shows a real screenshot when `image` is set, otherwise
// falls back to a CSS-only gradient + skeleton placeholder (no fake screenshots).
export function DeviceFrame({
  gradient,
  image,
  className,
  compact = false,
}: {
  gradient: string;
  image?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/60 px-3 py-2">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-foreground/8" />
      </div>
      {image ? (
        // Real screenshot, cropped to the window and anchored to the top so the
        // hero stays in view.
        <div className="relative aspect-16/10">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 40rem, (min-width: 768px) 20rem, 90vw"
            className="object-cover object-top"
          />
        </div>
      ) : (
        // Gradient + skeleton UI hints
        <div
          className={cn(
            "bg-linear-to-br p-4",
            gradient,
            compact ? "aspect-16/10" : "aspect-16/10 sm:p-6",
          )}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-2">
              <div className="h-2.5 w-1/3 rounded-full bg-white/40" />
              <div className="h-2 w-2/3 rounded-full bg-white/25" />
              <div className="h-2 w-1/2 rounded-full bg-white/25" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 rounded-md bg-white/20" />
              <div className="h-8 rounded-md bg-white/15" />
              <div className="h-8 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
