"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OurWorkSection, Brand } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface OurWorkProps {
  data?: OurWorkSection;
}

export default function OurWork({ data }: OurWorkProps) {
  const header = data?.header;
  const title = header?.title || "Our Work";
  const description = header?.description || "";
  const projects = (data?.projects ?? []).filter(
    (b) => b.desktopImage?.url || b.mobileImage?.url
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section className="bg-[#F5F5F5]">
      <div className="px-[clamp(1.25rem,4.2vw,5.6875rem)] pt-[clamp(4.5rem,7vw,9rem)]">
        <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-[clamp(1.5rem,4.2vw,2.5rem)]">
          <div className="w-full lg:w-[78%] flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)]">
            <h1 className="font-delight! text-[clamp(2.125rem,4.2vw,5rem)] leading-tight 2xl:leading-[1.12] tracking-[-0.01em]">
              {header?.mobileTitle ? (
                <>
                  <span className="block lg:hidden">{header.mobileTitle}</span>
                  <span className="hidden lg:block">{title}</span>
                </>
              ) : (
                title
              )}
            </h1>
            {(description || header?.mobileDescription) && (
              <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-[1.5] tracking-normal max-w-3xl">
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

          {projects.length > 1 && (
            <div className="hidden lg:flex items-center gap-4 shrink-0 self-end pb-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="w-[clamp(3rem,4.2vw,3.5rem)] h-[clamp(3rem,4.2vw,3.5rem)] rounded-lg bg-[#0F1D07] text-white flex items-center justify-center transition-all duration-200 hover:bg-black cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-[clamp(1.25rem,4.2vw,1.5rem)] h-[clamp(1.25rem,4.2vw,1.5rem)] text-white" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="w-[clamp(3rem,4.2vw,3.5rem)] h-[clamp(3rem,4.2vw,3.5rem)] rounded-lg bg-[#0F1D07] text-white flex items-center justify-center transition-all duration-200 hover:bg-black cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowRight className="w-[clamp(1.25rem,4.2vw,1.5rem)] h-[clamp(1.25rem,4.2vw,1.5rem)] text-white" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </div>

        {projects.length > 1 && (
          <div className="flex lg:hidden items-center justify-between w-full py-3 mb-6">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 font-satoshi text-[clamp(0.875rem,4.2vw,1rem)] font-medium text-[#0F1D07] hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Previous project"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1.5">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to project ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-6 bg-[#3145DD]"
                      : "w-2 bg-[#3145DD]/25 hover:bg-[#3145DD]/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 font-satoshi text-[clamp(0.875rem,4.2vw,1rem)] font-medium text-[#0F1D07] hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Next project"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      <div
        className="relative w-full h-[clamp(30rem,165vw,40.25rem)] lg:h-[clamp(32rem,35.5vw,42.5rem)] overflow-hidden shadow-sm touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {projects.map((brand, idx) => {
            const desktopImg = brand.desktopImage?.url ? brand.desktopImage : brand.mobileImage;
            const mobileImg = brand.mobileImage?.url ? brand.mobileImage : brand.desktopImage;

            return (
              <div
                key={brand.id || idx}
                className="w-full h-full shrink-0 relative overflow-hidden"
                style={{
                  backgroundColor: brand.brandColor || "#ffffff",
                }}
              >
                {desktopImg?.url && (
                  <div className={`relative w-full h-full ${mobileImg?.url ? "hidden lg:block" : "block"}`}>
                    <Image
                      src={getStrapiMediaUrl(desktopImg.url)}
                      alt={
                        desktopImg.alternativeText ||
                        brand.name ||
                        "Project showcase"
                      }
                      fill
                      sizes="100vw"
                      priority={idx <= 1}
                      className="object-contain object-bottom"
                      unoptimized
                    />
                  </div>
                )}

                {mobileImg?.url && (
                  <div className={`relative w-full h-full ${desktopImg?.url ? "block lg:hidden" : "block"}`}>
                    <Image
                      src={getStrapiMediaUrl(mobileImg.url)}
                      alt={
                        mobileImg.alternativeText ||
                        brand.name ||
                        "Project showcase mobile"
                      }
                      fill
                      sizes="100vw"
                      priority={idx <= 1}
                      className="object-cover object-top"
                      unoptimized
                    />
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