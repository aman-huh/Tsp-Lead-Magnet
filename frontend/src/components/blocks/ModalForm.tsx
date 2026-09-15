"use client";

import React, { useState } from "react";
import { LeadForm as LeadFormType, FormField, BudgetRange } from "@/types";
import { submitLead } from "@/services/lead";

interface ModalFormProps {
  data?: LeadFormType;
  onClose?: () => void;
  className?: string;
  source?: string;
}

export default function ModalForm({
  data,
  onClose,
  className = "",
  source = "modal_form",
}: ModalFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const steps = data?.Steps ?? [];
  const totalSteps = steps.length || 1;
  const step = steps[currentStep];
  const fields = step?.fields ?? [];
  const isLastStep = currentStep >= totalSteps - 1;
  const buttonText = step?.primaryButton?.text || (isLastStep ? "Submit" : "Continue");
  const successMessage = data?.successMessage || "Thanks! We'll be in touch soon.";

  const isMultiSelectField = (field: FormField): boolean => {
    return (
      field.type === "select" ||
      field.label.toLowerCase().includes("improvement") ||
      field.label.toLowerCase().includes("issues")
    );
  };

  const getFieldValue = (field: FormField): string => {
    const val = formValues[String(field.id)];
    if (typeof val === "string") {
      return val;
    }
    if (Array.isArray(val)) {
      return val.join(",");
    }
    return "";
  };

  const handleFieldChange = (fieldId: number, value: string) => {
    setFormValues((prev) => ({ ...prev, [String(fieldId)]: value }));
  };

  const handleMultiSelectToggle = (fieldId: number, optionValue: string) => {
    setFormValues((prev) => {
      const current = prev[String(fieldId)];
      const list = Array.isArray(current)
        ? [...current]
        : typeof current === "string" && current
        ? [current]
        : [];
      const idx = list.indexOf(optionValue);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(optionValue);
      }
      return { ...prev, [String(fieldId)]: list };
    });
  };

  const isOptionActive = (field: FormField, optionValue: string): boolean => {
    const val = formValues[String(field.id)];
    if (isMultiSelectField(field)) {
      const list = Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [];
      return list.includes(optionValue);
    }
    return typeof val === "string" && val === optionValue;
  };

  const validateField = (field: FormField, val: unknown): string | null => {
    const isEmpty =
      val === undefined ||
      val === null ||
      (typeof val === "string" && val.trim() === "") ||
      (Array.isArray(val) && val.length === 0);

    const labelLower = (field.label || "").toLowerCase();

    if (field.required && isEmpty) {
      if (labelLower.includes("shopify") && (field.type === "radio" || field.type === "select")) {
        return "Please select whether you own a Shopify store.";
      }
      if (labelLower.includes("improvement") || labelLower.includes("issue") || labelLower.includes("ux")) {
        return "Please choose at least one area you'd like to improve.";
      }
      if (labelLower.includes("budget") || labelLower.includes("plan") || labelLower.includes("range")) {
        return "Please select your budget range.";
      }
      if (field.type === "phone" || labelLower.includes("phone")) {
        return "Please enter your phone number to receive your quote.";
      }
      if (field.type === "email" || labelLower.includes("email")) {
        return "Please enter your email address.";
      }
      if (field.type === "url" || labelLower.includes("link") || labelLower.includes("url")) {
        return "Please enter your store link.";
      }
      if (labelLower.includes("name")) {
        return "Please enter your name.";
      }
      const cleanLabel = field.label.replace(/[?:!]+$/, "").trim();
      return `Please provide your ${cleanLabel.toLowerCase()}.`;
    }

    if (!isEmpty && typeof val === "string") {
      const rawString = val.trim();
      if (field.type === "phone" || labelLower.includes("phone")) {
        const digitsOnly = rawString.replace(/\D/g, "");
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          return "Please enter a valid phone number (7 to 15 digits).";
        }
      }

      if (field.type === "email" || labelLower.includes("email")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rawString)) {
          return "Please enter a valid email address (e.g., name@example.com).";
        }
      }

      if (field.type === "url" || (labelLower.includes("link") && field.type === "text")) {
        if (rawString.length > 0 && !rawString.includes(".") && !rawString.startsWith("http")) {
          return "Please enter a valid store link (e.g., yourstore.myshopify.com).";
        }
      }
    }

    return null;
  };

  const handleNext = async () => {
    const currentFields = step?.fields ?? [];
    for (const f of currentFields) {
      const val = formValues[String(f.id)];
      const validationError = validateField(f, val);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError(null);

    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      return;
    }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formData: Record<string, string> = {};
      steps.forEach((s) => {
        s.fields?.forEach((field) => {
          const val = formValues[String(field.id)];
          if (Array.isArray(val)) {
            const labels = val
              .map((v) => {
                const opt = field.options?.find((o) => o.value === v);
                return opt?.label?.split("\n")[0] || v;
              })
              .join(", ");
            formData[field.label] = labels;
          } else {
            const raw = (val as string) ?? getFieldValue(field);
            const opt = field.options?.find((o) => o.value === raw);
            formData[field.label] = opt?.label?.split("\n")[0] || raw;
          }
        });
      });

      const selectedTierId = getSelectedBudgetId(data?.pricingTiers ?? []);
      if (selectedTierId && data?.pricingTiers) {
        const matched = data.pricingTiers.find(
          (t) => String(t.id) === String(selectedTierId)
        );
        if (matched?.label) {
          formData["Selected Plan"] = matched.label;
        }
      }

      const allFields = steps.flatMap((s) => s.fields ?? []);
      const shopifyField = allFields.find(
        (f) => f.label.toLowerCase().includes("shopify") && (f.type === "radio" || f.type === "select")
      );
      const urlField = allFields.find(
        (f) => f.type === "url" || (f.label.toLowerCase().includes("shopify") && f.type === "text")
      );
      const emailField = allFields.find((f) => f.type === "email");
      const phoneField = allFields.find((f) => f.type === "phone");
      const nameField = allFields.find(
        (f) => f.type === "text" && f.label?.toLowerCase().includes("name")
      );

      const rawShopify = shopifyField
        ? ((formValues[String(shopifyField.id)] as string) ?? getFieldValue(shopifyField))
        : undefined;
      const validShopify = rawShopify === "yes" || rawShopify === "no" ? rawShopify : undefined;

      const shopifyUrl = urlField ? (formValues[String(urlField.id)] as string)?.trim() : undefined;
      const email = emailField ? (formValues[String(emailField.id)] as string)?.trim() : undefined;
      const phone = phoneField ? (formValues[String(phoneField.id)] as string)?.trim() : undefined;
      const name = nameField ? (formValues[String(nameField.id)] as string)?.trim() : undefined;

      await submitLead({
        hasShopifyWebsite: validShopify,
        shopifyUrl: shopifyUrl || undefined,
        email: email || undefined,
        phone: phone || undefined,
        name: name || undefined,
        source,
        honeypot,
        formData,
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRadioOrSelect = (field: FormField) => {
    const isMulti = isMultiSelectField(field);
    return (
      <div key={field.id}>
        <label className="font-nohemi block text-[clamp(0.875rem,3.2vw,1.0625rem)] font-normal text-[#111827] mb-2 sm:mb-2.5">
          {field.label}
        </label>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          {field.options?.map((option) => {
            const active = isOptionActive(field, option.value);
            const [title, subtitle] = option.label.split("\n");
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (isMulti) {
                    handleMultiSelectToggle(field.id, option.value);
                  } else {
                    handleFieldChange(field.id, option.value);
                    if (field.label.toLowerCase().includes("budget")) {
                      const matchedTier = data?.pricingTiers?.find(
                        (t) =>
                          t.label?.toLowerCase() === title.toLowerCase() ||
                          t.label?.toLowerCase() === option.value.toLowerCase() ||
                          String(t.id) === option.value
                      );
                      if (matchedTier) {
                        setFormValues((prev) => ({
                          ...prev,
                          __budget: String(matchedTier.id),
                        }));
                      }
                    }
                  }
                }}
                className={`w-full sm:w-auto flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border text-[clamp(0.75rem,2.6vw,0.875rem)] font-satoshi transition-all duration-200 cursor-pointer text-left ${
                  active
                    ? "border-[#18181B] text-[#111827] bg-white shadow-sm"
                    : "border-[#D1D5DB] text-[#111827] bg-transparent hover:border-[#9CA3AF]"
                }`}
              >
                {isMulti ? (
                  <span
                    className={`w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                      active
                        ? "border-[#18181B] bg-[#18181B] text-white"
                        : "border-[#4B5563]"
                    }`}
                  >
                    {active && (
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                ) : (
                  <svg
                    className="w-4 h-4 shrink-0 aspect-square"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.75"
                      stroke={active ? "#18181B" : "#4B5563"}
                      strokeWidth="1.5"
                      className="transition-colors duration-200"
                    />
                    {active && (
                      <circle
                        cx="8"
                        cy="8"
                        r="3.5"
                        fill="#18181B"
                        className="transition-all duration-200"
                      />
                    )}
                  </svg>
                )}
                <div className="flex flex-col text-left">
                  <span className="leading-tight">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-[clamp(0.625rem,2.2vw,0.75rem)] text-[#555555] leading-tight mt-0.5 font-normal">
                      {subtitle}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInput = (field: FormField) => {
    const value = getFieldValue(field);
    const inputType =
      field.type === "url"
        ? "url"
        : field.type === "email"
          ? "email"
          : field.type === "phone"
            ? "tel"
            : "text";

    const inputId = `modal-field-${field.id}`;

    if (field.type === "textarea") {
      return (
        <div key={field.id}>
          <label htmlFor={inputId} className="font-nohemi block text-[clamp(0.875rem,3.2vw,1.0625rem)] font-normal text-[#111827] mb-2">
            {field.label}
          </label>
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder ?? ""}
            required={field.required}
            rows={4}
            className="font-satoshi w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(0.75rem,2.8vw,0.875rem)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200 resize-none"
          />
        </div>
      );
    }

    return (
      <div key={field.id}>
        <label htmlFor={inputId} className="font-nohemi block text-[clamp(0.875rem,3.2vw,1.0625rem)] font-normal text-[#111827] mb-2">
          {field.label}
        </label>
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className="font-satoshi w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(0.75rem,2.8vw,0.875rem)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
        />
      </div>
    );
  };

  const getSelectedBudgetId = (tiers: BudgetRange[]): string => {
    const budget = formValues["__budget"];
    if (typeof budget === "string" && budget) return budget;

    const budgetField = steps
      .flatMap((s) => s.fields ?? [])
      .find((f) => f.label.toLowerCase().includes("budget"));
    if (budgetField) {
      const budgetVal = formValues[String(budgetField.id)];
      if (typeof budgetVal === "string" && budgetVal) {
        const matched = tiers.find(
          (t) =>
            t.label?.toLowerCase() === budgetVal.toLowerCase() ||
            String(t.id) === budgetVal
        );
        if (matched) return String(matched.id);
      }
    }

    const recommended =
      tiers.find((t) => t.recommended) ||
      tiers.find((t) => t.label?.toLowerCase() === "balanced") ||
      tiers.find((t) => t.id === 2);
    if (recommended) return String(recommended.id);
    if (tiers.length > 0) return String(tiers[0].id);
    return "";
  };

  const formatINR = (amount?: number) =>
    amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "";

  const getPreviousStepSelections = (): string[] => {
    const improvementField = steps
      .flatMap((s) => s.fields ?? [])
      .find((f) => isMultiSelectField(f));

    if (!improvementField) return [];

    const val = formValues[String(improvementField.id)];
    const selectedValues = Array.isArray(val) ? val : val ? [val] : [];

    return selectedValues
      .map((v) => {
        const opt = improvementField.options?.find((o) => o.value === v);
        return opt?.label?.split("\n")[0] || opt?.label;
      })
      .filter((label): label is string => Boolean(label));
  };

  const renderBudgetTiers = (tiers: BudgetRange[]) => {
    const selectedId = getSelectedBudgetId(tiers);
    const selections = getPreviousStepSelections();
    return (
      <div className="">
        <p className="text-[clamp(0.9375rem,4.2vw,1.0625rem)] font-heading text-[#1F2A37]">
          Your Estimated Budget
        </p>
        {selections.length > 0 && (
          <p className="text-[clamp(0.8125rem,4.2vw,0.9375rem)] text-gray-500">
            Based on your selections:{" "}
            {selections.map((s, i) => (
              <span key={i}>
                <span className="text-[#3145DD] underline text-sm">{s}</span>
                {i < selections.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
        <div className="pt-2 space-y-1">
          {tiers.map((tier) => {
            const tierValue = String(tier.id);
            const isSelected = selectedId === tierValue;
            const price =
              tier.minAmount !== undefined
                ? `${formatINR(tier.minAmount)}${tier.maxAmount ? ` - ${formatINR(tier.maxAmount)}` : "+"}`
                : tier.label ?? "";
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() =>
                  setFormValues((prev) => ({ ...prev, __budget: tierValue }))
                }
                className="w-full text-left cursor-pointer transition-all duration-200 py-1"
              >
                {isSelected ? (
                  <div>
                    <p className="text-[clamp(0.9375rem,4.2vw,1.0625rem)] text-[#3145DD]">
                      {tier.label ?? ""} (Chosen Plan)
                    </p>
                    <p className="text-[clamp(1.5rem,4.2vw,1.75rem)] font-medium text-[#3145DD] flex items-center gap-2 leading-tight">
                      {price}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] text-gray-500">
                      {tier.label ?? ""}
                    </p>
                    <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] text-gray-500">
                      {price}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderField = (field: FormField) => {
    if (field.type === "radio" || field.type === "select") {
      return renderRadioOrSelect(field);
    }
    return renderInput(field);
  };

  if (submitted) {
    return (
      <div className={`text-center py-8 sm:py-14 space-y-3 sm:space-y-4 ${className}`}>
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
          {successMessage}
        </h2>
        <p className="font-satoshi text-[#555555] text-[clamp(0.75rem,2.8vw,0.875rem)]">
          We received your information and will personalize your quote shortly.
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
    );
  }

  return (
    <div className={`flex flex-col justify-between flex-1 w-full ${className}`}>
      <div>
        <div className="mb-3 sm:mb-4">
          <h2 id="quote-modal-title" className="font-nohemi text-[clamp(1.25rem,4.5vw,1.875rem)] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8">
            {step?.formTitle || "Get an instant quote"}
          </h2>
          {step?.description && (
            <p className="font-satoshi text-[#555555] text-[clamp(0.6875rem,2.5vw,0.8125rem)] leading-relaxed mt-1">
              {step.description}
            </p>
          )}
        </div>

        {totalSteps > 1 && (
          <div className="mb-4 sm:mb-6 select-none">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-satoshi text-[clamp(0.8125rem,3vw,0.96875rem)] font-medium text-[#3145DD]">
                {step?.title || "Store Info"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isCompletedOrCurrent = i <= currentStep;
                const isClickable = i <= maxStepReached && i !== currentStep;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (isClickable) setCurrentStep(i);
                    }}
                    className={`h-0.5 flex-1 transition-colors duration-300 ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    } ${isCompletedOrCurrent ? "bg-[#18181B]" : "bg-[#D8D8DC]"}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1">
        <fieldset disabled={submitted || isSubmitting} className="contents">
          <div className="space-y-4 sm:space-y-6">
            {step?.showEstimate &&
              data?.pricingTiers &&
              data.pricingTiers.length > 0 &&
              renderBudgetTiers(data.pricingTiers)}

            {fields.length > 0 && (
              <div
                className={
                  step?.layout === "two-column"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4"
                    : "space-y-4 sm:space-y-6"
                }
              >
                {fields.map((field) => renderField(field))}
              </div>
            )}
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
            className="opacity-0 absolute top-[-9999px] left-0 h-0 w-0 pointer-events-none"
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
              <span>{successMessage || "Quote Requested! We'll be in touch."}</span>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 text-xs sm:text-sm mb-2.5">{error}</p>}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="group relative font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3.5 md:py-4 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[clamp(0.8125rem,3vw,0.96875rem)] cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : isLastStep ? (
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
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <span className="text-[clamp(0.875rem,3.5vw,1.0625rem)]">→</span>
                  </>
                )}
              </button>
            </>
          )}
          {step?.footerText ? (
            <p className="font-satoshi text-[clamp(0.625rem,2.2vw,0.75rem)] mt-2 text-center text-black">
              {step.footerText}
            </p>
          ) : (
            <p className="text-[11px] mt-2 text-center invisible select-none" aria-hidden="true">
              &nbsp;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
