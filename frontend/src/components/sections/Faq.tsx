"use client";

import React, { useState } from "react";
import { FaqSection, FaqItem } from "@/types";

interface FAQProps {
  data?: FaqSection;
}

const DEFAULT_QUESTIONS: FaqItem[] = [
  { id: 1, question: "Does the store remain live throughout the project?" },
  { id: 2, question: "Can the work be timed around peak trading?" },
  { id: 3, question: "How is a redesign priced?" },
  { id: 4, question: "Does this require a new theme or a replatform?" },
  { id: 5, question: "What happens to our existing apps and integrations?" },
  { id: 6, question: "What is the impact on SEO?" },
  { id: 7, question: "Can you work alongside our developer?" },
  { id: 8, question: "How does an offshore team operate in practice?" },
];

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = data?.heading?.title || "FAQ";
  const description = data?.heading?.description;

  const rawQuestions =
    data?.questions && data.questions.length > 0
      ? data.questions
      : DEFAULT_QUESTIONS;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 sm:py-24 2xl:py-32 px-6 sm:px-12 2xl:px-20 3xl:px-[89.5px]">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="mb-10 sm:mb-14 2xl:mb-16">
          <h2 className="font-delight! text-[44px] sm:text-[52px] 2xl:text-[62px] 3xl:text-[70px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F1D07]">
            {title}
          </h2>
          {description && (
            <p className="font-satoshi text-[16px] 2xl:text-[18px] text-[#4A5568] mt-3 sm:mt-4 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4.75">
          {rawQuestions.map((item, index) => {
            const isOpen = openIndex === index;
            const answerText = item.answer?.trim();

            return (
              <div
                key={item.id || index}
                className="border-b border-[#000000] transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 sm:py-6 2xl:py-7 flex items-center justify-between gap-6 text-left cursor-pointer group select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-medium text-[20px] sm:text-[24px] 2xl:text-[28px] 3xl:text-[32px] leading-[1.35] tracking-[0.01em] text-[#0F1D07] group-hover:text-black transition-colors">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 flex items-center justify-center w-8 h-8 2xl:w-11 2xl:h-11 3xl:w-10 3xl:h-10 text-[26px] 2xl:text-[48px] 3xl:text-[34px] font-light text-[#0F1D07] transition-transform duration-300 ease-out select-none leading-none ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {answerText && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-6 sm:pb-7"
                        : "grid-rows-[0fr] opacity-0 pb-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-satoshi text-[15px] sm:text-[16px] 2xl:text-[17px] 3xl:text-[18px] text-[#4A5568] leading-relaxed max-w-4xl">
                        {answerText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}