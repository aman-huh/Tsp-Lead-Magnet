"use client";

import React, { useState } from "react";
import { ButtonComponent, ProblemCard as ProblemCardType } from "@/types";

interface ProblemSelectorProps {
  cards?: ProblemCardType[];
  summaryText?: string;
  submitButton?: ButtonComponent;
}

export default function ProblemSelector({
  cards = [],
  summaryText = "{{selectedCount}} identified. At that point the structure is the problem, not the styling.",
  submitButton,
}: ProblemSelectorProps) {
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<Set<string>>(
    new Set()
  );

  const toggleCard = (identifier: string) => {
    setSelectedIdentifiers((prev) => {
      const next = new Set(prev);
      if (next.has(identifier)) {
        next.delete(identifier);
      } else {
        next.add(identifier);
      }
      return next;
    });
  };

  const selectedCount = selectedIdentifiers.size;
  const formattedSummary = summaryText.replace(
    "{{selectedCount}}",
    selectedCount.toString()
  );

  return (
    <div className="space-y-[clamp(1.5rem,4.2vw,3.25rem)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(1rem,4.2vw,2.375rem)] w-full">
        {cards.map((card) => {
          const isSelected = selectedIdentifiers.has(card.identifier);

          return (
            <div
              key={card.id || card.identifier}
              onClick={() => toggleCard(card.identifier)}
              className={`w-full min-h-[clamp(9rem,4.2vw,13.375rem)] rounded-[clamp(12px,4.2vw,16px)] p-[clamp(1.5rem,4.2vw,2rem)] flex flex-col justify-between gap-3 relative transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[#CACDEB]"
                  : "bg-[#3145DD]/8 hover:bg-[#CACDEB]"
              }`}
            >
              <button
                type="button"
                aria-label={isSelected ? "Remove item" : "Add item"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCard(card.identifier);
                }}
                className={`absolute top-4 right-[11.5px] w-[clamp(2rem,4.2vw,2.25rem)] h-[clamp(2rem,4.2vw,2.25rem)] rounded-lg shadow-xs flex items-center justify-center transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? "bg-[#3145DD] text-white"
                    : "bg-white text-[#111827]"
                }`}
              >
                <div className="relative w-[21.33px] h-[21.33px] flex items-center justify-center">
                  <svg
                    className={`absolute inset-0 m-auto w-[21.33px] h-[21.33px] transition-all duration-150 ease-out ${
                      isSelected
                        ? "opacity-0 rotate-45 scale-50"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>

                  <svg
                    className={`absolute inset-0 m-auto w-4.5 h-4.5 transition-all duration-150 ease-out ${
                      isSelected
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-45 scale-50"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </button>

              <div className="w-full pr-9">
                <h3 className="font-delight! text-[clamp(1.25rem,4.2vw,1.5rem)] font-medium leading-snug tracking-normal text-[#0F1D07] mb-2">
                  {card.title}
                </h3>

                <p className="text-[clamp(1rem,4.2vw,1.125rem)] leading-[1.6] text-[#0F1D07]">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="w-full bg-transparent sm:bg-[#F8F8F8] sm:rounded-[clamp(12px,4.2vw,16px)] p-0 sm:p-[clamp(1rem,4.2vw,1.5rem)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-2.5">
          <p className="font-satoshi text-[clamp(1.0625rem,4.2vw,1.25rem)] leading-snug font-bold text-[#111827]">
            {formattedSummary}
          </p>

          <button
            type="button"
            className="w-full sm:w-[clamp(18rem,4.2vw,27.5rem)] h-[clamp(3.125rem,4.2vw,4rem)] text-[clamp(1rem,4.2vw,1.25rem)] rounded-full bg-[#3145DD] hover:bg-[#2838BD] text-white flex items-center justify-center gap-3 shrink-0 font-medium cursor-pointer transition-colors duration-200"
          >
            <span>{submitButton?.text || "Submit"}</span>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
