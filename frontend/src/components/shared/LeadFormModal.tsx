"use client";

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/blocks/ModalForm";
import { LeadForm as LeadFormType } from "@/types";
import { useLenis } from "@/components/providers/SmoothScroll";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: LeadFormType;
  source?: string;
}

export default function LeadFormModal({
  isOpen,
  onClose,
  data,
  source = "modal",
}: LeadFormModalProps) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setMounted(true);
      setIsClosing(false);
    } else if (mounted) {
      setIsClosing(true);
      timer = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;

    if (lenis) {
      lenis.stop();
    }
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (lenis) {
        lenis.start();
      }
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, lenis]);

  if (!mounted) return null;

  return (
    <div
      id="quote-modal"
      data-modal="quote"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className={`fixed inset-0 bg-black/60 cursor-pointer touch-none ${
          isClosing ? "modal-backdrop-out" : "modal-backdrop-in"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        data-lenis-prevent="true"
        className={`relative w-full sm:min-w-[580px] md:min-w-[620px] max-w-[580px] sm:max-w-[620px] md:max-w-[660px] max-h-[92vh] sm:max-h-[88vh] bg-[#FAFAFC] rounded-none p-[clamp(1.125rem,3.5vw,2rem)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain ${
          isClosing ? "modal-dialog-out pointer-events-none" : "modal-dialog-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quote modal"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ModalForm data={data} onClose={onClose} source={source} />
      </div>
    </div>
  );
}
