"use client";

import React, { useEffect } from "react";
import ModalForm from "@/components/blocks/ModalForm";
import { LeadForm as LeadFormType } from "@/types";

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
        className="relative w-full max-w-[620px] max-h-[92vh] overflow-y-auto rounded-none bg-[#F6F6F6] shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
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
