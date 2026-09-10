import React from "react";
import Button from "@/components/shared/Button";
import ClientShowcase from "@/components/blocks/ClientShowcase";
import LeadForm from "@/components/blocks/LeadForm";
import { HeroSection as HeroSectionType } from "@/types";

interface HeroProps {
  data?: HeroSectionType;
}

export default function Hero({ data }: HeroProps) {
  const header = data?.header;
  const primaryButton = data?.primaryButton;
  const leadForm = data?.leadForm;

  const title =
    header?.title || "Turn More of Your Traffic Into Customers.";
  const description =
    header?.description ||
    "Your products have already done the hard work of getting people through the door. We make sure your Shopify store gives them every reason to stay, trust and buy.";

  const buttonText = primaryButton?.text || "Book a Free Call";
  const buttonUrl = primaryButton?.url || "#book-call";

  const renderTitle = (text: string) => {
    if (!text) return null;
    
    if (text.includes("\n")) {
      return text.split("\n").map((line, idx) => (
        <span key={idx} className="block">
          {line.trim()}
        </span>
      ));
    }
    if (text.includes("|")) {
      return text.split("|").map((part, idx) => (
        <span key={idx} className="block">
          {part.trim()}
        </span>
      ));
    }
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) {
      return <span className="block">{text}</span>;
    }

    const half = text.length / 2;
    let accumulated = 0;
    let bestSplit = Math.ceil(words.length / 2);
    let minDiff = Infinity;

    for (let i = 1; i < words.length; i++) {
      accumulated += words[i - 1].length + 1;
      const diff = Math.abs(accumulated - half);
      if (diff < minDiff) {
        minDiff = diff;
        bestSplit = i;
      }
    }

    return (
      <>
        <span className="block">{words.slice(0, bestSplit).join(" ")}</span>
        <span className="block">{words.slice(bestSplit).join(" ")}</span>
      </>
    );
  };

  return (
    <section className="bg-[#37386B] min-h-0 lg:min-h-screen relative flex flex-col justify-between">

      <div className="relative mx-auto px-0 lg:px-[clamp(3.5rem,5.2vw,6.25rem)] max-w-[1920px] w-full lg:pt-0 lg:mt-[clamp(6rem,7vw,10.2rem)] flex-1 flex flex-col pb-0 lg:pb-[clamp(3.5rem,4.2vw,5.375rem)]">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-[clamp(2rem,4.2vw,3rem)] flex-1 items-stretch">
          <div className="w-full lg:w-[55%] flex flex-col justify-between px-[clamp(1.25rem,4.2vw,2rem)] lg:px-0 pt-[clamp(6rem,14vw,7.5rem)] lg:pt-0 pb-[clamp(1.5rem,4vw,2rem)] lg:pb-0 h-auto">
            <div className="flex flex-col gap-y-[clamp(1.5rem,3.2vw,1.5rem)] mb-[clamp(4.5rem,6vw,5rem)] lg:mb-0 my-0">
              <div className="space-y-5">
                <h1 className="font-heading! text-[clamp(2.2rem,4.2vw,5rem)] text-white leading-relaxed md:leading-tight tracking-[-0.02em]">
                {header?.mobileTitle ? (
                  <>
                    <span className="block lg:hidden">{renderTitle(header.mobileTitle)}</span>
                    <span className="hidden lg:block">{renderTitle(title)}</span>
                  </>
                ) : (
                  renderTitle(title)
                )}
              </h1>
              {(description || header?.mobileDescription) && (
                <p className="w-full lg:w-[85%] font-satoshi text-[clamp(14px,2.8vw,1.15rem)] font-normal text-white/90 sm:text-white leading-relaxed tracking-normal">
                  {header?.mobileDescription ? (
                    <>
                      <span className="block lg:hidden">{header.mobileDescription}</span>
                      <span className="hidden lg:block">{description}</span>
                    </>
                  ) : (
                    description
                  )}
                </p>
              )}
              </div>
              
              <div className="w-full lg:w-auto">
                <Button
                  theme="dark"
                  shape="pill"
                  variant="solid"
                  size="lg"
                  arrowType="right"
                  text={buttonText}
                  url={buttonUrl}
                  className="w-full lg:w-auto justify-center"
                />
              </div>
            </div>

            <ClientShowcase
              logos={data?.brandLogos}
              className="lg:pt-12"
            />
          </div>

          <div id="lead-form" className="w-full flex-none lg:flex-1 self-stretch">
            <LeadForm data={leadForm} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}