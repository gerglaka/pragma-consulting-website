"use client";

import { useEffect } from "react";

// Sitewide cursor tracker for `.spotlight` cards (see globals.css): one
// delegated listener writes the pointer position into CSS custom properties
// on the hovered card; the glow itself is pure CSS. Renders nothing.
export function SpotlightEffect() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const card = target.closest(".spotlight");
      if (!(card instanceof HTMLElement)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
