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
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

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
      const val = formValues[String(field.id)]?.trim() || "";
      const labelLower = (field.label || "").toLowerCase();

      if (field.required && !val) {
        if (field.type === "phone" || labelLower.includes("phone")) {
          setError("Please enter your phone number.");
          return;
        }
        if (field.type === "email" || labelLower.includes("email")) {
          setError("Please enter your email address.");
          return;
        }
        if (labelLower.includes("name")) {
          setError("Please enter your name.");
          return;
        }
        const cleanLabel = field.label.replace(/[?:!]+$/, "").trim();
        setError(`Please enter your ${cleanLabel.toLowerCase()}.`);
        return;
      }

      if (val) {
        if (field.type === "phone" || labelLower.includes("phone")) {
          const digitsOnly = val.replace(/\D/g, "");
          if (digitsOnly.length < 7 || digitsOnly.length > 15) {
            setError("Please enter a valid phone number (7 to 15 digits).");
            return;
          }
        }
        if (field.type === "email" || labelLower.includes("email")) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            setError("Please enter a valid email address (e.g., name@example.com).");
            return;
          }
        }
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const emailField = fields.find((f) => f.type === "email");
      const phoneField = fields.find(
        (f) => f.type === "phone" || f.label?.toLowerCase().includes("phone")
      );
      const nameField = fields.find(
        (f) => f.type === "text" && f.label?.toLowerCase().includes("name")
      );
      const shopifyField = fields.find(
        (f) =>
          f.type === "url" ||
          f.label?.toLowerCase().includes("shopify") ||
          f.label?.toLowerCase().includes("store")
      );

      const formData: Record<string, unknown> = {};
      fields.forEach((f) => {
        formData[f.label] = formValues[String(f.id)] || "";
      });

      await submitLead({
        email: emailField ? (formValues[String(emailField.id)] as string)?.trim() : undefined,
        name: nameField ? (formValues[String(nameField.id)] as string)?.trim() : undefined,
        phone: phoneField ? (formValues[String(phoneField.id)] as string)?.trim() : undefined,
        shopifyUrl: shopifyField ? (formValues[String(shopifyField.id)] as string)?.trim() : undefined,
        source: "callback_modal",
        honeypot,
        formData: formData as Record<string, string>,
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

          <div className="flex flex-col justify-between flex-1">
            <fieldset disabled={submitted || isSubmitting} className="contents">
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
            </fieldset>

            <div className="mt-5 sm:mt-10 md:mt-16">
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="opacity-0 absolute -top-[9999px] left-0 h-0 w-0 pointer-events-none"
                aria-hidden="true"
              />
              {submitted ? (
                <div
                  className="font-satoshi w-full bg-[#005540] text-white font-medium py-2.5 sm:py-3.5 md:py-4 px-5 sm:px-6 rounded-full flex justify-center items-center gap-2 text-[clamp(0.8125rem,3vw,0.96875rem)] shadow-md select-none"
                  role="status"
                  aria-live="polite"
                >
                  <svg
                    className="w-4 h-4 text-[#95E7D3] shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Call Booked! We&apos;ll reach out shortly.</span>
                </div>
              ) : (
                <>
                  {error && <p className="text-red-500 text-xs sm:text-sm mb-2.5">{error}</p>}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit()}
                    className="group relative font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3.5 md:py-4 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[clamp(0.8125rem,3vw,0.96875rem)] cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span>Booking...</span>
                    ) : (
                      <span className="relative inline-flex flex-col justify-center overflow-hidden h-[1.3em] select-none">
                        <span className="inline-flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                          <span>{buttonText}</span>
                          <span className="text-[clamp(0.875rem,3.5vw,1.0625rem)]">→</span>
                        </span>
                        <span
                          className="absolute top-full left-0 w-full inline-flex items-center justify-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full"
                          aria-hidden="true"
                        >
                          <span>{buttonText}</span>
                          <span className="text-[clamp(0.875rem,3.5vw,1.0625rem)]">→</span>
                        </span>
                      </span>
                    )}
                  </button>
                </>
              )}
              {footerText ? (
                <p className="font-satoshi text-[clamp(0.625rem,2.2vw,0.75rem)] mt-2 text-center text-black">
                  {footerText}
                </p>
              ) : (
                <p className="text-[11px] mt-2 text-center invisible select-none" aria-hidden="true">
                  &nbsp;
                </p>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
