"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const HeroFlow = lazy(() =>
  import("./hero-flow").then((m) => ({ default: m.HeroFlow })),
);

// Keeps the hero animation code out of the critical bundle: the chunk is
// fetched only after the browser goes idle, well past LCP. The canvas fades
// in from nothing, so a late start is invisible.
export function HeroFlowLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <HeroFlow />
    </Suspense>
  );
}
