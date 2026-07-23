import { cn } from "@/lib/utils";

// Pragma mark: two-tone "P//". The P body is painted in the theme foreground
// (currentColor) while the twin slashes and the bowl counter are knocked out in
// the page background, so the mark adapts to both themes — near-black P on
// light, off-white P on dark — with the slashes reading as clean cuts.
// Geometry extracted from the brand source (new pragma logo/PRAGMA UJ UJ.svg).
export function PragmaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="1980 3370 4360 4360"
      role="img"
      aria-hidden="true"
      className={cn("text-foreground", className)}
    >
      <g fill="currentColor">
        <polygon points="3366.78,3693.74 2716.8,4731.92 2728.63,7215 4943.28,3693.74" />
        <path d="M3948.27 3687.82l1007.08 0c492.83,199.27 840.54,682.31 840.54,1246.57 0,742.31 -601.76,1344.07 -1344.07,1344.07 -742.31,0 -1344.07,-601.76 -1344.07,-1344.07 0,-564.26 347.7,-1047.3 840.53,-1246.57z" />
      </g>
      <line
        x1="2616.88"
        y1="6048.5"
        x2="4182.68"
        y2="3531.93"
        stroke="var(--background)"
        strokeWidth="242.53"
      />
      <line
        x1="2524.35"
        y1="7569.4"
        x2="5004.81"
        y2="3582.78"
        stroke="var(--background)"
        strokeWidth="242.52"
      />
      <path
        fill="var(--background)"
        d="M4620.15 4406.82l-578.38 928.87c103.55,111.62 251.5,181.47 415.76,181.47 313.15,0 567,-253.85 567,-567 0,-256.63 -170.48,-473.43 -404.38,-543.33z"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PragmaMark className="size-8 shrink-0" />
      <span className="font-display text-xl font-bold tracking-tight">
        Pragma
      </span>
    </span>
  );
}
