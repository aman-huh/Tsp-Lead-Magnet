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
  const buttonText = step?.primaryButton?.text || (currentStep < totalSteps - 1 ? "Continue" : "Submit");
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

  const handleNext = async () => {
    const currentFields = step?.fields ?? [];
    for (const f of currentFields) {
      if (f.required) {
        const val = formValues[String(f.id)];
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          setError(`Please complete "${f.label}" to continue.`);
          return;
        }
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

      await submitLead({
        hasShopifyWebsite: shopifyField
          ? ((formValues[String(shopifyField.id)] as string) ?? getFieldValue(shopifyField))
          : undefined,
        shopifyUrl: urlField ? (formValues[String(urlField.id)] as string) : undefined,
        email: emailField ? (formValues[String(emailField.id)] as string) : undefined,
        name: phoneField
          ? (formValues[String(phoneField.id)] as string)
          : nameField
            ? (formValues[String(nameField.id)] as string)
            : undefined,
        source,
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
        <div className="flex flex-wrap gap-2.5">
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
                className="px-5 py-2.5 rounded-full border border-[#D1D5DB] bg-white hover:border-black/40 transition-colors cursor-pointer flex items-center gap-3"
              >
                {isMulti ? (
                  <span
                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                      active
                        ? "bg-black text-white"
                        : "border border-black/40"
                    }`}
                  >
                    {active && (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
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
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      active
                        ? "border border-black"
                        : "border border-black/60"
                    }`}
                  >
                    {active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    )}
                  </span>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[14px] text-black font-normal leading-tight">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-[12px] text-gray-500 leading-tight mt-0.5">
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
                <span className="text-[#3145DD] underline">{s}</span>
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
      <div className={`bg-[#F6F6F6] px-[clamp(1.25rem,4vw,1.75rem)] py-[clamp(2.5rem,7vw,3.75rem)] lg:p-[clamp(1.25rem,4.2vw,2.25rem)] shadow-2xl text-gray-900 flex flex-col items-center justify-center rounded-t-[clamp(16px,4.2vw,24px)] lg:rounded-t-none ${className}`}>
        <div className="text-center space-y-4">
          <h2 className="font-heading text-[clamp(1.75rem,4.2vw,2.25rem)] text-[#2A2523]">
            {successMessage}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#F6F6F6] px-[clamp(1.25rem,4vw,1.75rem)] py-[clamp(2.5rem,7vw,3.75rem)] lg:p-[clamp(1.2rem,4.2vw,2.25rem)] text-gray-900 flex flex-col justify-between min-h-0 rounded-t-[clamp(16px,4.2vw,24px)] lg:rounded-t-none ${className}`}>
      <div>
        {step?.formTitle && (
          <div className="pr-8">
            <h2 className="font-heading text-[clamp(1.8rem,4.2vw,2.25rem)] text-[#2A2523]">
              {step.formTitle}
            </h2>
            {step.description && (
              <p className="text-[clamp(0.75rem,4.2vw,0.875rem)] text-[#2A2523]">
                {step.description}
              </p>
            )}
          </div>
        )}
        {totalSteps > 1 && (
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
                const isClickable = i <= maxStepReached && !isCurrent;

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
                    title={
                      steps[i]?.title
                        ? `Step ${i + 1}: ${steps[i].title}`
                        : `Step ${i + 1}`
                    }
                    aria-label={`Step ${i + 1}${
                      steps[i]?.title ? `: ${steps[i].title}` : ""
                    }`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`group py-2 -my-2 flex items-center w-full transition-all ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-all duration-200 ${
                        isCurrent || isCompleted
                          ? "bg-[#0F1D07]"
                          : "bg-[#E5E7EB]"
                      } ${isClickable ? "group-hover:bg-[#3145DD]" : ""}`}
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
        </div>

        {fields.length > 0 && (
          <div
            className={`mt-5 ${
              step?.layout === "two-column"
                ? "grid grid-cols-2 gap-4"
                : "space-y-5"
            }`}
          >
            {fields.map((field) => renderField(field))}
          </div>
        )}
      </div>

      <div className="mt-32 sm:mt-36 lg:mt-6 pb-6 lg:pb-0">
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button
          text={isSubmitting ? "Submitting..." : buttonText}
          variant="action"
          className="w-full text-[clamp(0.9375rem,1.2vw,1.15rem)] !bg-[#1F1E1B] hover:!bg-black !border-[#1F1E1B]"
          showArrow={!isSubmitting}
          onClick={handleNext}
          arrowType="right"
          size="lg"
          noHover
        />
        {step?.footerText ? (
          <p className="text-[clamp(0.75rem,4.2vw,0.8125rem)] mt-2 text-center text-gray-500">
            {step.footerText}
          </p>
        ) : (
          <p
            className="text-[clamp(0.75rem,4.2vw,0.8125rem)] mt-2 text-center invisible select-none"
            aria-hidden="true"
          >
            &nbsp;
          </p>
        )}
      </div>
    </div>
  );
}
