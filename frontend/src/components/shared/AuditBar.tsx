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
      className={`fixed bottom-4 sm:bottom-6 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-[880px] -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
        }`}
      role="region"
      aria-label="Bottom notification and quick quote action"
    >
      <div className="flex flex-col md:flex-row md:items-center rounded-[clamp(1.25rem,2vw,1.5rem)] border border-black/[0.08] bg-white px-[clamp(0.875rem,2.3vw,1.25rem)] py-[clamp(0.5rem,1.6vw,0.875rem)] gap-[clamp(0.5rem,1.8vw,1rem)] shadow-[0_10px_30px_rgba(0,0,0,0.14)] min-h-[clamp(3rem,7.5vw,4.875rem)]">
        <p className="flex-1 min-w-0 md:flex-none flex items-center font-nohemi text-[clamp(0.8125rem,2vw,1.125rem)] font-medium leading-snug text-[#0F1D07] whitespace-nowrap select-none">
          {auditText}
        </p>

        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-[clamp(0.375rem,1.2vw,0.75rem)] md:flex md:flex-1 md:items-center md:gap-[clamp(0.375rem,1.2vw,0.75rem)]">
          <Button
            text={primaryButtonText}
            onClick={handlePrimaryClick}
            theme="light"
            variant="solid"
            shape="pill"
            size="md"
            arrowType="right"
            noHover
            containerClassName="md:flex-1"
            className="h-[clamp(2.25rem,5.5vw,3rem)] w-full justify-center px-[clamp(0.5rem,2.3vw,1rem)] text-[clamp(0.69rem,1.7vw,1.1rem)] font-normal leading-none tracking-normal whitespace-nowrap active:scale-[0.97]"
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
            containerClassName="md:flex-1"
            className="h-[clamp(2.25rem,5.5vw,3rem)] w-full justify-center !bg-white hover:!bg-gray-50 !border-[#0F1D07] px-[clamp(0.5rem,2.3vw,1rem)] text-[clamp(0.69rem,1.7vw,1.1rem)] font-medium leading-none tracking-normal whitespace-nowrap active:scale-[0.97]"
          />
        </div>
      </div>
    </div>
  );
}
