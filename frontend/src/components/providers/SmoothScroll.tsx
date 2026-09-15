"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) return;

    let destroyed = false;
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    import("lenis").then(({ default: LenisClass }) => {
      if (destroyed) return;
      lenis = new LenisClass({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
      });

      rafId = requestAnimationFrame((time) => {
        if (destroyed || !lenis) return;
        setLenisInstance(lenis);
        function loop(t: number) {
          if (destroyed || !lenis) return;
          lenis.raf(t);
          rafId = requestAnimationFrame(loop);
        }
        loop(time);
      });
    });

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        setLenisInstance(null);
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
