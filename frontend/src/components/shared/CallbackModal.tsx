"use client";

import React, { useState, useEffect } from "react";
import { LeadForm as LeadFormType } from "@/types";
import { submitLead } from "@/services/lead";

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
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[580px] max-h-[92vh] overflow-y-auto bg-white shadow-2xl my-auto rounded-none p-8 sm:p-10 md:p-12 text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 flex h-8 w-8 items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
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

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-[28px] sm:text-[32px] text-[#1F2A37]">
              Thanks! We'll be in touch soon.
            </h2>
            <p className="text-gray-500 text-sm">
              We received your information and will reach out shortly.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-8 rounded-full bg-[#1F1E1B] hover:bg-black text-white text-[15px] font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="pr-8">
              <h2 className="font-heading text-[30px] sm:text-[36px] md:text-[40px] text-[#1F2A37] font-normal tracking-tight leading-tight">
                {formTitle}
              </h2>
              {description && (
                <p className="text-[13px] sm:text-[13.5px] text-[#4B5563] mt-2 font-normal leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-7 sm:mt-8 space-y-5 sm:space-y-6">
              {fields.map((field) => {
                const inputType =
                  field.type === "phone"
                    ? "tel"
                    : field.type === "email"
                      ? "email"
                      : "text";

                return (
                  <div key={field.id}>
                    <label className="font-heading text-[15px] sm:text-[16px] text-[#1F2A37] block mb-2 font-normal">
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
                      className="w-full h-12 sm:h-13 bg-[#F2F2F2] border border-black/15 rounded-full px-5 text-[14px] sm:text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-black/30 transition-all"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="w-full py-4 px-6 rounded-full bg-[#1F1E1B] hover:bg-black text-white text-[15.5px] sm:text-[16px] font-medium transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : buttonText}
              </button>
              {footerText && (
                <p className="text-[12px] sm:text-[12.5px] text-[#4B5563] text-center mt-3">
                  {footerText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
