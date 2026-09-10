"use client";

import React, { useEffect } from "react";
import LeadForm from "@/components/blocks/LeadForm";
import { LeadForm as LeadFormType } from "@/types";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: LeadFormType;
}

export default function LeadFormModal({
  isOpen,
  onClose,
  data,
}: LeadFormModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-[#F6F6F6] shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <LeadForm data={data} className="w-full !rounded-[24px]" />
      </div>
    </div>
  );
}
