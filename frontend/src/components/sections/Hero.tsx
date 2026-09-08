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

  return (
    <section className="bg-[#37386B] min-h-0 lg:min-h-screen relative flex flex-col justify-between">

      <div className="relative mx-auto px-0 lg:px-[clamp(3.5rem,4.2vw,6.25rem)] max-w-[1920px] w-full lg:pt-0 lg:mt-[clamp(6rem,6vw,9.2rem)] flex-1 flex flex-col pb-0 lg:pb-[clamp(3.5rem,4.2vw,5.375rem)]">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-[clamp(2rem,4.2vw,3rem)] flex-1 items-stretch">
          <div className="w-full lg:w-[55%] flex flex-col justify-between px-[clamp(1.25rem,4.2vw,2rem)] lg:px-0 pt-[clamp(6rem,14vw,7.5rem)] lg:pt-0 pb-[clamp(1.5rem,4vw,2rem)] lg:pb-0 h-auto">
            <div className="space-y-[clamp(1.25rem,4.2vw,2rem)] mb-[clamp(3rem,6vw,4.5rem)] lg:mb-0 my-0">
              <div className="flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)]">
                <h1 className="font-heading! text-[clamp(3.12rem,4.2vw,5rem)] text-white leading-[1.14] tracking-[-0.02em]">
                  {title}
                </h1>
                {description && (
                  <p className="w-full lg:w-[85%] font-satoshi text-[clamp(0.9375rem,4.2vw,1.25rem)] font-normal text-white/90 sm:text-white leading-[1.6] tracking-normal">
                    {description}
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
                  containerClassName="w-full lg:w-auto"
                />
              </div>
            </div>

            <ClientShowcase
              logos={data?.brandLogos}
              className="lg:pt-12"
            />
          </div>

          <LeadForm data={leadForm} className="w-full flex-none lg:flex-1 self-stretch" />
        </div>
      </div>
    </section>
  );
}