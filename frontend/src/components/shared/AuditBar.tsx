"use client";

import React, { useEffect, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import Button from "@/components/shared/Button";

interface AuditBarProps {
  auditText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function AuditBar({
  auditText = "Not ready yet? Get your Free Store Audit.",
  primaryButtonText = "Get My Instant Quote",
  secondaryButtonText = "Book a Free Call",
  onPrimaryClick,
  onSecondaryClick,
}: AuditBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
      return;
    }
    const target = document.getElementById("lead-form") || document.querySelector("form");
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -60, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
      return;
    }

    const target = document.getElementById("footer") || document.querySelector("footer");
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-[880px] -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      role="region"
      aria-label="Bottom notification and quick quote action"
    >
      <div className="grid items-center gap-1.5 rounded-[clamp(1.25rem,2vw,1.5rem)] border border-black/[0.08] bg-white px-3.5 md:px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] md:min-h-[78px] md:grid-cols-[minmax(0,1fr)_242px_208px] md:gap-4 md:py-3">
        <p className="flex min-h-7 w-full items-center justify-start font-nohemi text-[clamp(0.9rem,1.25vw,1.125rem)] font-medium leading-snug text-[#0F1D07] text-left md:w-auto md:min-h-12 md:leading-normal whitespace-nowrap select-none">
          {auditText}
        </p>

        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] min-[360px]:gap-4 md:contents">
          <Button
            text={primaryButtonText}
            onClick={handlePrimaryClick}
            theme="light"
            variant="solid"
            shape="pill"
            size="md"
            arrowType="right"
            noHover
            className="h-[clamp(2.2rem,8vw,2.75rem)] w-full justify-center px-3 text-[clamp(0.75rem,1.2vw,1rem)] font-medium leading-none tracking-normal whitespace-nowrap active:scale-[0.97] md:h-12 md:px-5"
          />

          <Button
            text={secondaryButtonText}
            onClick={handleSecondaryClick}
            theme="light"
            variant="outline"
            shape="pill"
            size="md"
            arrowType="right"
            noHover
            className="h-[clamp(2.2rem,8vw,2.75rem)] w-full justify-center !bg-white hover:!bg-gray-50 !border-[#0F1D07] px-3 text-[clamp(0.75rem,1.2vw,1rem)] font-medium leading-none tracking-normal whitespace-nowrap active:scale-[0.97] md:h-12 md:px-5"
          />
        </div>
      </div>
    </div>
  );
}
