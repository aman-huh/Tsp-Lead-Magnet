"use client";

import React, { useState } from "react";
import Button from "@/components/shared/Button";
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

  const steps = data?.Steps ?? [];
  const totalSteps = steps.length || 1;
  const step = steps[currentStep];
  const fields = step?.fields ?? [];
  const buttonText =
    step?.primaryButton?.text ||
    (currentStep < totalSteps - 1 ? "Continue" : "Submit");
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
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join(",");
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

  const validateCurrentStep = (): boolean => {
    for (const field of fields) {
      if (!field.required) continue;
      const val = formValues[String(field.id)];
      if (val === undefined || val === null || val === "") {
        setError(`Please fill in "${field.label}"`);
        return false;
      }
      if (Array.isArray(val) && val.length === 0) {
        setError(`Please select at least one option for "${field.label}"`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
    } else {
      setIsSubmitting(true);
      setError(null);

      try {
        const payload: Record<string, unknown> = {};

        steps.forEach((s) => {
          s.fields?.forEach((f) => {
            const val = formValues[String(f.id)];
            if (val !== undefined && val !== "") {
              payload[f.label] = val;
            }
          });
        });

        const selectedTierId = formValues["__budget"];
        if (selectedTierId && data?.pricingTiers) {
          const matched = data.pricingTiers.find(
            (t) => String(t.id) === String(selectedTierId)
          );
          if (matched) {
            payload["Selected Plan"] = matched.label;
          }
        }

        const emailField = steps
          .flatMap((s) => s.fields ?? [])
          .find((f) => f.type === "email");
        const phoneField = steps
          .flatMap((s) => s.fields ?? [])
          .find((f) => f.type === "phone");
        const websiteField = steps
          .flatMap((s) => s.fields ?? [])
          .find((f) => f.label.toLowerCase().includes("shopify"));

        await submitLead({
          email: emailField ? (formValues[String(emailField.id)] as string) : undefined,
          name: phoneField ? (formValues[String(phoneField.id)] as string) : undefined,
          shopifyUrl: websiteField ? (formValues[String(websiteField.id)] as string) : undefined,
          source,
          formData: payload,
        });

        setSubmitted(true);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to submit. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderRadioOrSelect = (field: FormField) => {
    const isMulti = isMultiSelectField(field);
    const rawVal = formValues[String(field.id)];
    const selectedList = Array.isArray(rawVal)
      ? rawVal
      : rawVal
        ? [rawVal]
        : [];

    return (
      <div key={field.id} className="space-y-3">
        <label className="font-heading text-[clamp(1rem,1.4vw,1.15rem)] leading-snug text-[#1F2A37] block">
          {field.label}
        </label>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {field.options?.map((opt) => {
            const isSelected = selectedList.includes(opt.value);
            const [title, subtitle] = opt.label.split("\n");

            if (isMulti) {
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMultiSelectToggle(field.id, opt.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[20px] sm:rounded-[24px] border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#0F1D07] bg-white ring-1 ring-[#0F1D07]"
                      : "border-[#E5E5E5] bg-[#F4F4F4] hover:border-black/25"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-[#0F1D07] bg-[#0F1D07] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5"
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
                  <span className="flex flex-col">
                    <span className="text-[clamp(0.875rem,1.1vw,0.9375rem)] font-medium text-[#1F2A37] leading-tight">
                      {title}
                    </span>
                    {subtitle && (
                      <span className="text-[clamp(0.75rem,1vw,0.8125rem)] text-gray-500 leading-tight mt-0.5">
                        {subtitle}
                      </span>
                    )}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleFieldChange(field.id, opt.value)}
                className={`flex items-center gap-3 px-5 py-3 rounded-[48px] border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#0F1D07] bg-white ring-1 ring-[#0F1D07]"
                    : "border-[#E5E5E5] bg-[#F4F4F4] hover:border-black/25"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "border-[#0F1D07]"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F1D07]" />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-[clamp(0.875rem,1.1vw,0.9375rem)] font-medium text-[#1F2A37] leading-tight">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-[clamp(0.75rem,1vw,0.8125rem)] text-gray-500 leading-tight mt-0.5">
                      {subtitle}
                    </span>
                  )}
                </span>
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
      field.type === "phone"
        ? "tel"
        : field.type === "email"
          ? "email"
          : "text";

    return (
      <div key={field.id} className="space-y-2">
        <label className="font-heading text-[clamp(0.9375rem,1.2vw,1.0625rem)] leading-snug text-[#1F2A37] block">
          {field.label}
        </label>
        <input
          type={inputType}
          value={value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className="w-full h-[clamp(2.75rem,3.8vw,3.25rem)] bg-[#F4F4F4] border border-[#E5E5E5] rounded-[48px] px-5 text-[clamp(0.875rem,1.1vw,0.9375rem)] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#3145DD] focus:ring-1 focus:ring-[#3145DD] transition-all"
        />
      </div>
    );
  };

  const renderField = (field: FormField) => {
    if (field.type === "radio" || field.type === "select") {
      return renderRadioOrSelect(field);
    }
    return renderInput(field);
  };

  const formatINR = (amount?: number) =>
    amount !== undefined ? `₹${amount.toLocaleString("en-IN")}` : "";

  const renderBudgetTiers = (tiers: BudgetRange[]) => {
    const selectedId = formValues["__budget"];

    return (
      <div className="space-y-2.5">
        <p className="font-heading text-[clamp(1rem,1.4vw,1.15rem)] text-[#1F2A37]">
          Your Estimated Budget
        </p>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                className={`flex items-center gap-3 px-5 py-3 rounded-[48px] border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#0F1D07] bg-white ring-1 ring-[#0F1D07]"
                    : "border-[#E5E5E5] bg-[#F4F4F4] hover:border-black/25"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-[#0F1D07]" : "border-gray-400 bg-white"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F1D07]" />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-[clamp(0.875rem,1.1vw,0.9375rem)] font-medium text-[#1F2A37] leading-tight">
                    {tier.label}
                  </span>
                  <span className="text-[clamp(0.75rem,1vw,0.8125rem)] text-gray-500 leading-tight mt-0.5">
                    {price}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className={`p-8 sm:p-10 text-center space-y-4 ${className}`}>
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
        <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] text-[#1F2A37]">
          {successMessage}
        </h2>
        <p className="text-gray-500 text-sm">
          We received your information and will be in touch shortly.
        </p>
        {onClose && (
          <div className="pt-4">
            <Button
              text="Done"
              variant="action"
              onClick={onClose}
              className="px-8 justify-center mx-auto"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 md:p-9 flex flex-col justify-between ${className}`}>
      <div>
        {step?.formTitle && (
          <div>
            <h2 className="font-heading text-[clamp(1.75rem,3.8vw,2.25rem)] text-[#1F2A37] tracking-tight leading-[1.2]">
              {step.formTitle}
            </h2>
            {step.description && (
              <p className="text-[clamp(0.8125rem,1.1vw,0.875rem)] text-gray-500 mt-2 leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            )}
          </div>
        )}

        {totalSteps > 1 && (
          <div className="mt-5">
            <span className="text-[clamp(0.875rem,1.1vw,0.9375rem)] text-[#3145DD] font-medium block">
              {step?.title || `Step ${currentStep + 1}`}
            </span>
            <div
              className="grid gap-2 sm:gap-2.5 mt-2.5"
              style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
            >
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                const isClickable = i <= maxStepReached && !isCurrent;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => {
                      if (isClickable) setCurrentStep(i);
                    }}
                    className={`py-1 -my-1 flex items-center w-full ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-all duration-200 ${
                        isCurrent || isCompleted
                          ? "bg-[#0F1D07]"
                          : "bg-[#E5E7EB]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {step?.showEstimate &&
            data?.pricingTiers &&
            data.pricingTiers.length > 0 &&
            renderBudgetTiers(data.pricingTiers)}

          {fields.length > 0 && (
            <div className="space-y-4">
              {fields.map((field) => renderField(field))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-2">
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button
          text={isSubmitting ? "Submitting..." : buttonText}
          variant="action"
          className="w-full text-[clamp(0.9375rem,1.2vw,1.0625rem)] justify-center !bg-[#242220] hover:!bg-black"
          showArrow={!isSubmitting}
          arrowType="right"
          onClick={handleNext}
          size="lg"
          noHover
        />
        {step?.footerText && (
          <p className="text-[clamp(0.75rem,1vw,0.8125rem)] text-center text-gray-500 mt-2.5">
            {step.footerText}
          </p>
        )}
      </div>
    </div>
  );
}
