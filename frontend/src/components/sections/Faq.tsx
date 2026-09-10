"use client";

import React, { useState } from "react";
import { FaqSection, FaqItem } from "@/types";

interface FAQProps {
  data?: FaqSection;
}

const DEFAULT_QUESTIONS: FaqItem[] = [
  {
    id: 1,
    question: "Does the store remain live throughout the project?",
    answer:
      "Yes, absolutely. All design, development, and testing take place in a staging environment. Your live store remains completely unaffected and fully operational until we are ready for a seamless cutover.",
  },
  {
    id: 2,
    question: "Can the work be timed around peak trading?",
    answer:
      "Yes. We plan milestones around your commercial calendar, freezing major deployments during critical promotional or seasonal trading periods to safeguard your revenue.",
  },
  {
    id: 3,
    question: "How is a redesign priced?",
    answer:
      "We work on fixed-scope project pricing with clear deliverable milestones, or dedicated monthly retainers depending on the scale and ongoing requirements of your store.",
  },
  {
    id: 4,
    question: "Does this require a new theme or a replatform?",
    answer:
      "Not necessarily. We assess whether optimizing your existing theme, building custom bespoke components, or migrating to Shopify 2.0 / headless best serves your long-term margins.",
  },
  {
    id: 5,
    question: "What happens to our existing apps and integrations?",
    answer:
      "We audit your entire tech stack to retain essential integrations, consolidate redundant subscriptions, and ensure third-party scripts don't degrade your storefront's loading speed.",
  },
  {
    id: 6,
    question: "What is the impact on SEO?",
    answer:
      "We strictly preserve your URL structures, canonical tags, redirects, and metadata. In fact, our performance improvements and structured schema typically enhance organic visibility.",
  },
  {
    id: 7,
    question: "Can you work alongside our developer?",
    answer:
      "Yes. We frequently collaborate with in-house engineers, handling specialized UX/UI design, design systems, and frontend components while your team focuses on backend operations.",
  },
  {
    id: 8,
    question: "How does an offshore team operate in practice?",
    answer:
      "We provide dedicated project managers, daily async updates via Slack, and scheduled weekly syncs aligned with your working hours to ensure transparent and frictionless collaboration.",
  },
];

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const heading = data?.heading;
  const title = heading?.title || "FAQ";
  const description = heading?.description;

  const rawQuestions =
    data?.questions && data.questions.length > 0
      ? data.questions
      : DEFAULT_QUESTIONS;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white pt-[clamp(4.5rem,7vw,9.5rem)] pb-[clamp(5rem,8vw,11rem)] px-0 sm:px-12 2xl:px-20 3xl:px-[89.5px]">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="mb-8 sm:mb-14 2xl:mb-16 px-6 sm:px-0">
          <h2 className="font-heading font-medium text-[36px] sm:text-[52px] 2xl:text-[62px] 3xl:text-[70px] leading-[1.1] tracking-[-0.02em] text-[#0F1D07]">
            {heading?.mobileTitle ? (
              <>
                <span className="block lg:hidden">{heading.mobileTitle}</span>
                <span className="hidden lg:block">{title}</span>
              </>
            ) : (
              title
            )}
          </h2>
          {(description || heading?.mobileDescription) && (
            <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-[1.5] text-[#4A5568] mt-3 sm:mt-4 max-w-2xl">
              {heading?.mobileDescription ? (
                <>
                  <span className="block lg:hidden">{heading.mobileDescription}</span>
                  <span className="hidden lg:block">{description}</span>
                </>
              ) : (
                description
              )}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-0 sm:gap-4.75">
          {rawQuestions.map((item, index) => {
            const isOpen = openIndex === index;
            const fallbackItem =
              DEFAULT_QUESTIONS.find(
                (dq) =>
                  dq.question?.toLowerCase().trim() ===
                    item.question?.toLowerCase().trim() || dq.id === item.id
              ) || DEFAULT_QUESTIONS[index % DEFAULT_QUESTIONS.length];
            const answerText = item.answer?.trim() || fallbackItem?.answer;

            return (
              <div
                key={item.id || index}
                className="w-full border-b border-[#E5E5E5] sm:border-[#000000] transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 sm:py-6 2xl:py-7 px-6 sm:px-0 flex items-center justify-between gap-6 text-left cursor-pointer group select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-normal text-[17px] sm:text-[24px] 2xl:text-[28px] 3xl:text-[32px] leading-[1.4] tracking-[0.01em] text-[#0F1D07] group-hover:text-black transition-colors">
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
                    <div className="overflow-hidden px-6 sm:px-0">
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