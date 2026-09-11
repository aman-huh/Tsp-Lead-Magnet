"use client";

import React, { useState } from "react";
import Button from "@/components/shared/Button";
import { LeadForm as LeadFormType, FormField, BudgetRange } from "@/types";
import { submitLead } from "@/services/lead";

interface LeadFormProps {
  data?: LeadFormType;
  className?: string;
}

export default function LeadForm({ data, className = "" }: LeadFormProps) {
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
  const buttonText = step?.primaryButton?.text || (currentStep < totalSteps - 1 ? "Continue" : "Submit");
  const successMessage = data?.successMessage || "Thanks! We'll be in touch soon.";

  const isMultiSelectField = (field: FormField): boolean => {
    return field.label.toLowerCase().includes("improvement");
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
    setError(null);
    setFormValues((prev) => ({ ...prev, [String(fieldId)]: value }));
  };

  const handleMultiSelectToggle = (fieldId: number, value: string) => {
    setError(null);
    setFormValues((prev) => {
      const current = prev[String(fieldId)];
      const list = Array.isArray(current)
        ? current
        : current
          ? [current]
          : [];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [String(fieldId)]: updated };
    });
  };

  const isOptionActive = (field: FormField, optionValue: string): boolean => {
    const val = formValues[String(field.id)];
    if (isMultiSelectField(field)) {
      const list = Array.isArray(val) ? val : val ? [val] : [];
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
              .map((v) => field.options?.find((o) => o.value === v)?.label || v)
              .join(", ");
            formData[field.label] = labels;
          } else {
            formData[field.label] = val ?? getFieldValue(field);
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
      const shopifyField =
        allFields.find(
          (f) =>
            (f.type === "radio" || f.type === "select") &&
            (f.label?.toLowerCase().includes("shopify") ||
              f.options?.some((o) => o.value === "yes" || o.value === "no"))
        ) || allFields.find((f) => f.type === "radio" || f.type === "select");

      const urlField = allFields.find(
        (f) =>
          f.type === "url" ||
          f.label?.toLowerCase().includes("link") ||
          (f.label?.toLowerCase().includes("url") && f.type !== "radio" && f.type !== "select") ||
          (f.label?.toLowerCase().includes("shopify") && f.type !== "radio" && f.type !== "select")
      );

      const emailField = allFields.find((f) => f.type === "email");
      const phoneField = allFields.find((f) => f.type === "phone" || f.label?.toLowerCase().includes("phone"));
      const nameField = allFields.find((f) => f.type === "text" && f.label?.toLowerCase().includes("name"));

      const rawShopify = shopifyField
        ? ((formValues[String(shopifyField.id)] as string) ?? getFieldValue(shopifyField))
        : undefined;
      const normalizedShopify = rawShopify?.toLowerCase();
      const validShopify =
        normalizedShopify === "yes" || normalizedShopify === "no"
          ? normalizedShopify
          : normalizedShopify?.includes("yes")
          ? "yes"
          : normalizedShopify?.includes("no")
          ? "no"
          : undefined;

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
        <label className="font-heading text-[clamp(0.9375rem,4.2vw,1.25rem)] leading-[160%] tracking-tight text-[#1F2A37] block mb-2.5">
          {field.label}
        </label>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const active = isOptionActive(field, option.value);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  isMulti
                    ? handleMultiSelectToggle(field.id, option.value)
                    : handleFieldChange(field.id, option.value)
                }
                className={`px-[clamp(1rem,4.2vw,1.5rem)] py-[clamp(0.5rem,4.2vw,0.65rem)] rounded-full border text-[clamp(0.875rem,4.2vw,1.125rem)] transition-all cursor-pointer flex items-center justify-center ${active
                  ? "border-[#005540]/80 bg-[#95E7D3]/30 text-[#005540]"
                  : "border-[#CAC4D0] text-[#3C3C3C] hover:border-gray-400"
                  }`}
              >
                {option.label}
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
      field.type === "url" ? "url"
        : field.type === "email" ? "email"
          : field.type === "phone" ? "tel"
            : "text";

    if (field.type === "textarea") {
      return (
        <div key={field.id}>
          <label className="font-heading text-[clamp(0.9375rem,4.2vw,1.25rem)] leading-[160%] tracking-tight text-[#1F2A37] block mb-2.5">
            {field.label}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder ?? ""}
            required={field.required}
            rows={4}
            className="w-full bg-[#F2F2F2] border border-black/20 rounded-2xl px-5 py-4 text-[clamp(0.875rem,4.2vw,1rem)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#3749E9] focus:ring-1 focus:ring-[#3749E9] transition-all resize-none"
          />
        </div>
      );
    }

    return (
      <div key={field.id}>
        <label className="font-heading text-[clamp(0.9375rem,4.2vw,1.25rem)] leading-[160%] tracking-tight text-[#1F2A37] block mb-2.5">
          {field.label}
        </label>
        <input
          type={inputType}
          value={value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className="w-full h-[clamp(2.75rem,4.2vw,3.25rem)] bg-[#F2F2F2] border border-black/20 rounded-[48px] px-5 text-[clamp(0.875rem,4.2vw,1rem)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#3749E9] focus:ring-1 focus:ring-[#3749E9] transition-all"
        />
      </div>
    );
  };

  const getSelectedBudgetId = (tiers: BudgetRange[]): string => {
    const budget = formValues["__budget"];
    if (typeof budget === "string" && budget) return budget;

    const recommended =
      tiers.find((t) => t.label?.toLowerCase() === "balanced") ||
      tiers.find((t) => t.label?.toLowerCase().includes("balanced")) ||
      tiers.find((t) => t.recommended) ||
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
      .map((v) => improvementField.options?.find((o) => o.value === v)?.label)
      .filter((label): label is string => Boolean(label));
  };

  const renderBudgetTiers = (tiers: BudgetRange[]) => {
    const selectedId = getSelectedBudgetId(tiers);
    const selections = getPreviousStepSelections();
    return (
      <div className="">
        <p className="text-[clamp(0.9375rem,4.2vw,1.0625rem)] font-heading text-[#1F2A37]">Your Estimated Budget</p>
        {selections.length > 0 && (
          <p className="text-[clamp(0.8125rem,4.2vw,0.9375rem)] text-gray-500">
            Based on your selections:{" "}
            {selections.map((s, i) => (
              <span key={i}>
                <span className="text-[#3749E9] underline">{s}</span>
                {i < selections.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
        <div className="pt-2 space-y-1">
          {tiers.map((tier) => {
            const tierValue = String(tier.id);
            const isSelected = selectedId === tierValue;
            const price = tier.minAmount !== undefined
              ? `${formatINR(tier.minAmount)}${tier.maxAmount ? ` - ${formatINR(tier.maxAmount)}` : "+"}`
              : tier.label ?? "";
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setFormValues((prev) => ({ ...prev, __budget: tierValue }))}
                className="w-full text-left cursor-pointer transition-all duration-200 py-1"
              >
                {isSelected ? (
                  <div>
                    <p className="text-[clamp(0.9375rem,4.2vw,1.0625rem)] text-[#3749E9]">
                      {tier.label ?? ""} (Chosen Plan)
                    </p>
                    <p className="text-[clamp(1.5rem,4.2vw,1.75rem)] font-medium text-[#3749E9] flex items-center gap-2 leading-tight">
                      {price}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] text-gray-500">{tier.label ?? ""}</p>
                    <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] text-gray-500">{price}</p>
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
    if (field.type === "radio" || field.type === "select") return renderRadioOrSelect(field);
    return renderInput(field);
  };

  return (
    <div className={`bg-[#F6F6F6] px-[clamp(1.25rem,4vw,1.75rem)] py-[clamp(2.5rem,7vw,3.75rem)] xl:p-[clamp(1.2rem,4.2vw,2.25rem)] text-gray-900 flex flex-col justify-between min-h-0 rounded-t-[clamp(16px,4.2vw,24px)] xl:rounded-t-none ${className}`}>
      <fieldset disabled={submitted || isSubmitting} className={`contents ${submitted ? "pointer-events-none opacity-85 select-none" : ""}`}>
        <div>
          {step?.formTitle && (
            <>
              <h2 className="font-heading text-[clamp(1.8rem,4.2vw,2.25rem)] text-[#2A2523]">{step.formTitle}</h2>
              {step.description && (
                <p className="text-[clamp(0.75rem,4.2vw,0.875rem)] text-[#2A2523]">{step.description}</p>
              )}
            </>
          )}

          <div className={step?.formTitle ? "mt-6" : ""}>
            <span className="text-[clamp(0.9375rem,4.2vw,1.125rem)] text-[#3145DD] font-medium block">
              {step?.title || "Store Info"}
            </span>
            <div
              className="grid gap-2 mt-4"
              style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
            >
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                const isClickable = i <= maxStepReached && !isCurrent && !submitted;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(i);
                      }
                    }}
                    title={steps[i]?.title ? `Step ${i + 1}: ${steps[i].title}` : `Step ${i + 1}`}
                    aria-label={`Step ${i + 1}${steps[i]?.title ? `: ${steps[i].title}` : ""}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`group py-2 -my-2 flex items-center w-full transition-all ${isClickable ? "cursor-pointer" : "cursor-default"
                      }`}
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-all duration-200 ${isCurrent || isCompleted
                        ? "bg-[#0F1D07]"
                        : "bg-[#E5E7EB]"
                        } ${isClickable ? "group-hover:bg-[#3145DD]" : ""}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>


          <div className="mt-6 space-y-5">
            {step?.showEstimate && data?.pricingTiers && data.pricingTiers.length > 0 &&
              renderBudgetTiers(data.pricingTiers)
            }
          </div>
          {fields.length > 0 && (
            <div className={`mt-5 ${step?.layout === "two-column" ? "grid grid-cols-2 gap-4" : "space-y-5"}`}>
              {fields.map((field) => renderField(field))}
            </div>
          )}
        </div>
      </fieldset>

      <div className="mt-32 sm:mt-36 lg:mt-6 pb-6 lg:pb-0">
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
            className="w-full rounded-full bg-[#005540] text-white flex items-center justify-center gap-2 px-[clamp(1.25rem,2vw,1.65rem)] py-[clamp(0.5rem,1.2vw,0.8rem)] text-[clamp(0.9375rem,1.2vw,1.15rem)] font-medium select-none shadow-sm"
            role="status"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 text-[#95E7D3] shrink-0"
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
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <Button
              text={isSubmitting ? "Submitting..." : buttonText}
              variant="action"
              className="w-full text-[clamp(0.9375rem,1.2vw,1.15rem)]"
              showArrow={!isSubmitting}
              onClick={handleNext}
              arrowType="right"
              size="lg"
              noHover
            />
          </>
        )}
        {step?.footerText ? (
          <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] mt-2 text-center text-gray-500">{step.footerText}</p>
        ) : (
          <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] mt-2 text-center invisible select-none" aria-hidden="true">
            &nbsp;
          </p>
        )}
      </div>
    </div>
  );
}
