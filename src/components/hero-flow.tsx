"use client";

import { useEffect, useRef } from "react";

// Decorative "chaos → order" hero animation: scattered dots drift, then
// settle into a clean process-flow diagram (Pragma's pitch in one picture).
// Hand-written canvas 2D, no dependencies.
//
// LCP safety (see ERRORS.md): this renders an empty canvas at SSR and only
// paints after hydration — the hero headline is never held back by it.
// prefers-reduced-motion: draws the finished diagram once, no animation.
// The loop pauses when the hero scrolls off-screen or the tab is hidden.

const COLUMNS = [1, 3, 2, 1]; // flow nodes per column; the last node is gold
const SETTLE_DUR = 1300; // ms one node takes to fly to its slot
const EDGE_DUR = 550; // ms one connection takes to draw
const SIGNAL_DUR = 1200; // ms a signal dot travels along an edge
const SIGNAL_EVERY = 2400; // ms between signals

type FlowNode = {
  sx: number; // chaos start (0..1, region-relative)
  sy: number;
  tx: number; // ordered target (0..1, region-relative)
  ty: number;
  delay: number; // ms before this node starts settling
  phase: number; // per-node phase for drift/bob
  gold: boolean;
};

type Ambient = { x: number; y: number; vx: number; vy: number; r: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function buildGraph() {
  const nodes: FlowNode[] = [];
  const colOf: number[][] = [];
  let idx = 0;
  COLUMNS.forEach((count, c) => {
    const col: number[] = [];
    for (let r = 0; r < count; r++) {
      nodes.push({
        sx: Math.random(),
        sy: Math.random(),
        tx: c / (COLUMNS.length - 1),
        ty: count === 1 ? 0.5 : 0.12 + (0.76 * r) / (count - 1),
        delay: 350 + idx * 110 + Math.random() * 90,
        phase: Math.random() * Math.PI * 2,
        gold: c === COLUMNS.length - 1,
      });
      col.push(idx);
      idx++;
    }
    colOf.push(col);
  });

  // Connect columns: every right-node links to its nearest left-node, then
  // any left-node without an outgoing link gets one — no orphans.
  const edges: [number, number][] = [];
  for (let c = 0; c < COLUMNS.length - 1; c++) {
    const left = colOf[c];
    const right = colOf[c + 1];
    const nearest = (of: number, pool: number[]) =>
      pool.reduce((best, i) =>
        Math.abs(nodes[i].ty - nodes[of].ty) <
        Math.abs(nodes[best].ty - nodes[of].ty)
          ? i
          : best,
      );
    const connected = new Set<number>();
    for (const b of right) {
      const a = nearest(b, left);
      edges.push([a, b]);
      connected.add(a);
    }
    for (const a of left) {
      if (!connected.has(a)) edges.push([a, nearest(a, right)]);
    }
  }
  return { nodes, edges };
}

export function HeroFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const { nodes, edges } = buildGraph();
    const settleEnd = (i: number) => nodes[i].delay + SETTLE_DUR;
    const edgeStart = edges.map(
      ([a, b]) => Math.max(settleEnd(a), settleEnd(b)) + 120,
    );
    const allDrawnAt = Math.max(...edgeStart) + EDGE_DUR + 500;

    let ambient: Ambient[] = [];
    let width = 0;
    let height = 0;
    let region = { x: 0, y: 0, w: 0, h: 0 };
    let strength = 1; // global alpha multiplier (lower on small screens)

    const colors = { node: "", line: "", gold: "#e8a020" };
    const readTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      colors.node = dark ? "#93ace8" : "#3b5bad";
      colors.line = dark ? "rgba(147,172,232,0.32)" : "rgba(59,91,173,0.30)";
    };
    readTheme();
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduceMotion) drawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (width >= 1024) {
        region = {
          x: width * 0.55,
          y: height * 0.12,
          w: width * 0.42,
          h: height * 0.76,
        };
        strength = 1;
      } else if (width >= 640) {
        region = {
          x: width * 0.4,
          y: height * 0.08,
          w: width * 0.55,
          h: height * 0.6,
        };
        strength = 0.55;
      } else {
        region = {
          x: width * 0.08,
          y: height * 0.06,
          w: width * 0.84,
          h: height * 0.88,
        };
        strength = 0.35;
      }

      const count = width >= 1024 ? 26 : 14;
      ambient = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        r: 0.8 + Math.random() * 0.9,
      }));
      if (reduceMotion) drawStatic();
    };

    const px = (nx: number, ny: number): [number, number] => [
      region.x + nx * region.w,
      region.y + ny * region.h,
    ];

    // Position of a node at elapsed ms (canvas px), incl. drift and idle bob.
    const nodePos = (i: number, elapsed: number): [number, number] => {
      const n = nodes[i];
      const p = easeInOut(clamp01((elapsed - n.delay) / SETTLE_DUR));
      const cx = n.sx + Math.sin(elapsed / 1300 + n.phase) * 0.04;
      const cy = n.sy + Math.cos(elapsed / 1500 + n.phase) * 0.04;
      const [x0, y0] = px(cx, cy);
      const [x1, y1] = px(n.tx, n.ty);
      const bob = p >= 1 ? Math.sin(elapsed / 1700 + n.phase) * 2 : 0;
      return [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p + bob];
    };

    type Signal = { edge: number; start: number };
    let signals: Signal[] = [];
    let nextSignalAt = allDrawnAt + 600;

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      const fadeIn = reduceMotion ? 1 : clamp01(elapsed / 500);

      // ambient dust — the chaos that never joins
      ctx.fillStyle = colors.node;
      for (const a of ambient) {
        a.x = (a.x + a.vx + width) % width;
        a.y = (a.y + a.vy + height) % height;
        ctx.globalAlpha = 0.14 * strength * fadeIn;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connections
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      edges.forEach(([a, b], e) => {
        const p = easeInOut(clamp01((elapsed - edgeStart[e]) / EDGE_DUR));
        if (p <= 0) return;
        const [ax, ay] = nodePos(a, elapsed);
        const [bx, by] = nodePos(b, elapsed);
        ctx.globalAlpha = strength * fadeIn;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + (bx - ax) * p, ay + (by - ay) * p);
        ctx.stroke();
      });

      // travelling signals — the sparkle
      if (!reduceMotion && elapsed >= nextSignalAt) {
        signals.push({
          edge: Math.floor(Math.random() * edges.length),
          start: elapsed,
        });
        nextSignalAt = elapsed + SIGNAL_EVERY + Math.random() * 900;
      }
      signals = signals.filter((s) => elapsed - s.start < SIGNAL_DUR);
      for (const s of signals) {
        const p = easeInOut((elapsed - s.start) / SIGNAL_DUR);
        const [a, b] = edges[s.edge];
        const [ax, ay] = nodePos(a, elapsed);
        const [bx, by] = nodePos(b, elapsed);
        const fade = Math.sin(Math.PI * clamp01((elapsed - s.start) / SIGNAL_DUR));
        ctx.globalAlpha = 0.9 * strength * fade;
        ctx.fillStyle = colors.gold;
        ctx.shadowColor = colors.gold;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ax + (bx - ax) * p, ay + (by - ay) * p, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const [x, y] = nodePos(i, elapsed);
        if (n.gold) {
          const settled = elapsed > settleEnd(i);
          const pulse =
            settled && !reduceMotion ? 1 + Math.sin(elapsed / 850) * 0.22 : 1;
          ctx.globalAlpha = 0.95 * strength * fadeIn;
          ctx.fillStyle = colors.gold;
          ctx.shadowColor = colors.gold;
          ctx.shadowBlur = 14 * pulse;
          ctx.beginPath();
          ctx.arc(x, y, 5.5 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.globalAlpha = 0.8 * strength * fadeIn;
          ctx.fillStyle = colors.node;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Reduced motion: one static frame of the finished diagram.
    const drawStatic = () => draw(allDrawnAt + 10);

    let raf = 0;
    let running = false;
    let startTime = 0;
    let pausedAt = 0;

    const loop = (now: number) => {
      if (!running) return;
      if (!startTime) startTime = now;
      draw(now - startTime);
      raf = requestAnimationFrame(loop);
    };
    const setRunning = (next: boolean) => {
      if (reduceMotion || next === running) return;
      running = next;
      if (next) {
        if (pausedAt) startTime += performance.now() - pausedAt;
        raf = requestAnimationFrame(loop);
      } else {
        pausedAt = performance.now();
        cancelAnimationFrame(raf);
      }
    };

    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      setRunning(inView && !document.hidden);
    });
    const onVisibility = () => setRunning(inView && !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    resize();
    if (reduceMotion) drawStatic();
    ro.observe(canvas);
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
