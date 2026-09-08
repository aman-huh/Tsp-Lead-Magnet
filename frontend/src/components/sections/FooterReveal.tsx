"use client";

import React, { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { FooterSection } from "@/types";
import Footer from "./Footer";

interface FooterRevealProps {
  children: React.ReactNode;
  footerData?: FooterSection;
}

export default function FooterReveal({
  children,
  footerData,
}: FooterRevealProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const update = () => {
      if (!contentRef.current || !spacerRef.current || !footerRef.current) return;

      const spacerRect = spacerRef.current.getBoundingClientRect();
      const spacerHeight = spacerRect.height;
      const windowHeight = window.innerHeight;

      const travel = windowHeight - spacerRect.top;

      if (travel <= 0) {
        contentRef.current.style.transform = "";
        footerRef.current.style.transform = "translateY(100%)";
        footerRef.current.style.visibility = "hidden";
      } else if (travel >= spacerHeight) {
        contentRef.current.style.transform = `translateY(${spacerHeight}px)`;
        footerRef.current.style.transform = "translateY(0%)";
        footerRef.current.style.visibility = "visible";
      } else {
        const progress = travel / spacerHeight;
        contentRef.current.style.transform = `translateY(${travel}px)`;
        footerRef.current.style.transform = `translateY(${(1 - progress) * 100}%)`;
        footerRef.current.style.visibility = "visible";
      }
    };

    update();

    if (lenis) {
      lenis.on("scroll", update);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      if (lenis) {
        lenis.off("scroll", update);
      }
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  return (
    <div className="relative w-full">
      <div ref={contentRef} className="w-full will-change-transform">
        {children}
      </div>
      <div
        ref={spacerRef}
        className="h-140 sm:h-150 2xl:h-165 3xl:h-180 w-full pointer-events-none"
      />
      <Footer ref={footerRef} data={footerData} />
    </div>
  );
}
