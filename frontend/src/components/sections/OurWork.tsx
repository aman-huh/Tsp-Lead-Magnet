"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OurWorkSection, Brand } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface OurWorkProps {
  data?: OurWorkSection;
}

function SliderArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="25"
      height="9"
      viewBox="0 0 25 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.53846 8L1 4.5L4.53846 1M1 4.5H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const [swiped, setSwiped] = useState(false);

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setSwiped(false);
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
      setSwiped(true);
      handleNext();
    } else if (isRightSwipe) {
      setSwiped(true);
      handlePrev();
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setDragStartX(e.clientX);
    setDragOffset(0);
    setIsPointerDown(true);
    setIsDragging(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown || dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 6) {
      setIsDragging(true);
    }
    setDragOffset(diff);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (isDragging) {
      if (dragOffset > minSwipeDistance) {
        handleNext();
      } else if (dragOffset < -minSwipeDistance) {
        handlePrev();
      }
    }

    setIsPointerDown(false);
    setIsDragging(false);
    setDragStartX(null);
    setDragOffset(0);
  };

  return (
    <section id="our-work" className="bg-[#F5F5F5] w-full scroll-mt-20">
      <div className="max-w-[1920px] mx-auto w-full px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] pt-[clamp(4.5rem,7vw,9rem)]">
        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-[clamp(1.5rem,4.2vw,2.5rem)]">
            <div className="w-full sm:w-[72%] lg:w-[78%] flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)]">
              <h2 className="font-heading! text-[clamp(2.125rem,4.2vw,5.2rem)] font-normal leading-tight 2xl:leading-[1.12] tracking-[-0.01em]">
                {header?.mobileTitle ? (
                  <>
                    <span className="block lg:hidden">{header.mobileTitle}</span>
                    <span className="hidden lg:block">{title}</span>
                  </>
                ) : (
                  title
                )}
              </h2>
              {(description || header?.mobileDescription) && (
                <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.2rem)] font-semibold leading-[1.5] tracking-normal w-full sm:w-[85%] lg:w-[77%]">
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
            <div className="hidden sm:flex items-center gap-4 shrink-0 self-end pb-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="w-[clamp(3rem,4.2vw,3.5rem)] h-[clamp(3rem,4.2vw,3.5rem)] rounded-lg bg-[#0F1D07] text-white flex items-center justify-center transition-all duration-200 hover:bg-black cursor-pointer shadow-sm active:scale-95"
                >
                  <SliderArrowIcon className="w-[clamp(1.35rem,2vw,1.65rem)] h-auto text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="w-[clamp(3rem,4.2vw,3.5rem)] h-[clamp(3rem,4.2vw,3.5rem)] rounded-lg bg-[#0F1D07] text-white flex items-center justify-center transition-all duration-200 hover:bg-black cursor-pointer shadow-sm active:scale-95"
                >
                  <SliderArrowIcon className="w-[clamp(1.35rem,2vw,1.65rem)] h-auto text-white rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>

        {projects.length > 1 && (
          <div className="flex sm:hidden items-center justify-between w-full py-3 mb-6">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 font-satoshi text-[clamp(0.875rem,4.2vw,1rem)] font-medium text-[#0F1D07] hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Previous project"
            >
              <span className="text-[1.15em] leading-none select-none" aria-hidden="true">←</span>
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
              <span className="text-[1.15em] leading-none select-none" aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <div
        className="relative w-full aspect-[375/580] sm:aspect-[1920/680] overflow-hidden shadow-sm touch-pan-y select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {projects.length > 1 && (
          <div className="absolute inset-0 z-20 flex sm:hidden pointer-events-none">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => {
                if (!swiped) handlePrev();
              }}
              className="w-1/2 h-full pointer-events-auto cursor-pointer focus:outline-none"
            />
            <button
              type="button"
              aria-label="Next project"
              onClick={() => {
                if (!swiped) handleNext();
              }}
              className="w-1/2 h-full pointer-events-auto cursor-pointer focus:outline-none"
            />
          </div>
        )}

        <div
          className={`flex w-full h-full will-change-transform ${
            isDragging
              ? "transition-none"
              : "transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          }`}
          style={{
            transform: isDragging
              ? `translateX(calc(-${activeIndex * 100}% - ${dragOffset}px))`
              : `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {projects.map((brand, idx) => {
            const desktopImg = brand.desktopImage?.url ? brand.desktopImage : brand.mobileImage;
            const mobileImg = brand.mobileImage?.url ? brand.mobileImage : brand.desktopImage;

            return (
              <div
                key={brand.id || idx}
                className="w-full h-full shrink-0 relative overflow-hidden select-none"
                style={{
                  backgroundColor: brand.brandColor || "#ffffff",
                }}
              >
                {desktopImg?.url && (
                  <div className={`relative w-full h-full select-none pointer-events-none ${mobileImg?.url ? "hidden sm:block" : "block"}`}>
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
                      className="object-contain object-bottom select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}

                {mobileImg?.url && (
                  <div className={`relative w-full h-full select-none pointer-events-none ${desktopImg?.url ? "block sm:hidden" : "block"}`}>
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
                      className="object-cover object-top select-none pointer-events-none"
                      draggable={false}
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