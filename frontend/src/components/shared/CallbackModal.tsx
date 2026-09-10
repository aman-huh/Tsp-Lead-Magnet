"use client";

import React, { useState, useEffect } from "react";
import { LeadForm as LeadFormType } from "@/types";
import { submitLead } from "@/services/lead";
import { useLenis } from "@/components/providers/SmoothScroll";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: LeadFormType;
}

export default function CallbackModal({
  isOpen,
  onClose,
  data,
}: CallbackModalProps) {
  const lenis = useLenis();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (lenis) {
      lenis.stop();
    }
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

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
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, lenis]);

  if (!isOpen) return null;

  const step = data?.Steps?.[0];
  const fields = step?.fields ?? [];
  const formTitle = step?.formTitle || "Get a callback";
  const description =
    step?.description ||
    "Let's make something amazing together.\nBook a call - we've got coffee (or tea) ready and are always up for a good conversation.";
  const buttonText = step?.primaryButton?.text || "Book My Free Call";
  const footerText =
    step?.footerText ||
    "We'll reach out within 24 hours — no spam, just expert guidance.";

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    for (const field of fields) {
      if (field.required && !formValues[String(field.id)]?.trim()) {
        setError(`Please enter your ${field.label.toLowerCase()}`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const emailField = fields.find((f) => f.type === "email");
      const phoneField = fields.find((f) => f.type === "phone");
      const shopifyField = fields.find(
        (f) =>
          f.type === "url" ||
          f.label.toLowerCase().includes("shopify")
      );

      const formData: Record<string, string> = {};
      fields.forEach((f) => {
        formData[f.label] = formValues[String(f.id)] || "";
      });

      await submitLead({
        email: emailField ? formValues[String(emailField.id)] : undefined,
        name: phoneField ? formValues[String(phoneField.id)] : undefined,
        shopifyUrl: shopifyField ? formValues[String(shopifyField.id)] : undefined,
        source: "callback_modal",
        formData,
      });

      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="callback-modal"
      data-modal="callback"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className="fixed inset-0 bg-black/60 cursor-pointer touch-none"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        data-lenis-prevent="true"
        className="relative w-full sm:min-w-[580px] md:min-w-[620px] max-w-[580px] sm:max-w-[620px] md:max-w-[660px] max-h-[92vh] sm:max-h-[88vh] bg-[#FAFAFC] rounded-none p-[clamp(1.125rem,3.5vw,2rem)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close callback modal"
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

        {submitted ? (
          <div className="text-center py-8 sm:py-14 space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-nohemi text-[clamp(1.25rem,4.5vw,1.875rem)] font-normal text-[#111827] leading-tight">
              Thanks! We'll be in touch soon.
            </h2>
            <p className="font-satoshi text-[#555555] text-[clamp(0.75rem,2.8vw,0.875rem)]">
              We received your information and will reach out shortly.
            </p>
            <div className="pt-3 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="font-satoshi py-3 px-8 rounded-full bg-[#242120] hover:bg-black text-white text-[clamp(0.8125rem,3vw,0.9375rem)] font-medium transition-all cursor-pointer shadow-md active:scale-[0.99]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="mb-3 sm:mb-4 pr-8">
                <h2 className="font-nohemi text-[clamp(1.25rem,4.5vw,1.875rem)] font-normal text-[#111827] leading-[1.15] tracking-tight">
                  {formTitle}
                </h2>
                {description && (
                  <p className="font-satoshi text-[#555555] text-[clamp(0.6875rem,2.5vw,0.8125rem)] leading-relaxed mt-1 whitespace-pre-line">
                    {description}
                  </p>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                {fields.map((field) => {
                  const inputType =
                    field.type === "phone"
                      ? "tel"
                      : field.type === "email"
                        ? "email"
                        : "text";

                  return (
                    <div key={field.id}>
                      <label className="font-nohemi block text-[clamp(0.875rem,3.2vw,1.0625rem)] font-normal text-[#111827] mb-2">
                        {field.label}
                      </label>
                      <input
                        type={inputType}
                        value={formValues[String(field.id)] || ""}
                        onChange={(e) => {
                          setError(null);
                          setFormValues((prev) => ({
                            ...prev,
                            [String(field.id)]: e.target.value,
                          }));
                        }}
                        placeholder={field.placeholder ?? ""}
                        required={field.required}
                        className="font-satoshi w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(0.75rem,2.8vw,0.875rem)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 sm:mt-10 md:mt-16">
              {error && <p className="text-red-500 text-xs sm:text-sm mb-2.5">{error}</p>}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3.5 md:py-4 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[clamp(0.8125rem,3vw,0.96875rem)] cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Booking..." : buttonText}</span>
                {!isSubmitting && <span className="text-[clamp(0.875rem,3.5vw,1.0625rem)]">→</span>}
              </button>
              {footerText ? (
                <p className="font-satoshi text-[clamp(0.625rem,2.2vw,0.75rem)] mt-2 text-center text-[#555555]">
                  {footerText}
                </p>
              ) : (
                <p className="text-[11px] mt-2 text-center invisible select-none" aria-hidden="true">
                  &nbsp;
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
