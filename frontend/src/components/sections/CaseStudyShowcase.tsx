"use client";

import Image from "next/image";
import { PointerEvent, useState, useEffect } from "react";
import { CaseStudy, CaseStudyShowcaseSection } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface CaseStudyShowcaseProps {
  data?: CaseStudyShowcaseSection;
}

function BeforeAfterSlider({ study }: { study?: CaseStudy }) {
  const [position, setPosition] = useState(50);
  const [isVertical, setIsVertical] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsVertical(window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const updatePosition = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    if (isVertical) {
      const nextPosition = ((clientY - rect.top) / rect.height) * 100;
      setPosition(Math.min(100, Math.max(0, nextPosition)));
    } else {
      const nextPosition = ((clientX - rect.left) / rect.width) * 100;
      setPosition(Math.min(100, Math.max(0, nextPosition)));
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX, event.clientY, event.currentTarget);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(event.clientX, event.clientY, event.currentTarget);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
  };

  const beforeImage = study?.beforeImage?.url;
  const afterImage = study?.afterImage?.url;

  return (
    <div
      className={`relative w-full h-[724px] md:h-auto md:aspect-[1720/969] rounded-xl md:rounded-2xl overflow-hidden touch-none select-none bg-white ${
        isVertical ? "cursor-ns-resize" : "cursor-ew-resize"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {study?.afterMobileImage?.url ? (
        <>
          <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none select-none">
            <Image
              src={getStrapiMediaUrl(study.afterMobileImage.url)}
              alt={study.afterMobileImage.alternativeText || study?.afterLabel || "After"}
              fill
              sizes="100vw"
              className="object-cover object-top pointer-events-none select-none"
              draggable={false}
              unoptimized
            />
          </div>
          <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none select-none">
            {afterImage && (
              <Image
                src={getStrapiMediaUrl(afterImage)}
                alt={study?.afterImage?.alternativeText || study?.afterLabel || "After"}
                fill
                sizes="100vw"
                className="object-cover object-top pointer-events-none select-none"
                draggable={false}
                unoptimized
              />
            )}
          </div>
        </>
      ) : afterImage ? (
        <Image
          src={getStrapiMediaUrl(afterImage)}
          alt={study?.afterImage?.alternativeText || study?.afterLabel || "After"}
          fill
          sizes="100vw"
          className="object-cover object-top pointer-events-none select-none"
          draggable={false}
          unoptimized
        />
      ) : null}

      <div
        className="absolute inset-0 overflow-hidden bg-[#5AA5C0] pointer-events-none select-none"
        style={{
          clipPath: isVertical
            ? `inset(0 0 ${100 - position}% 0)`
            : `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        {study?.mobileBeforeImage?.url ? (
          <>
            <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none select-none">
              <Image
                src={getStrapiMediaUrl(study.mobileBeforeImage.url)}
                alt={study.mobileBeforeImage.alternativeText || study?.beforeLabel || "Before"}
                fill
                sizes="100vw"
                className="object-cover object-top pointer-events-none select-none"
                draggable={false}
                unoptimized
              />
            </div>
            <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none select-none">
              {beforeImage && (
                <Image
                  src={getStrapiMediaUrl(beforeImage)}
                  alt={study?.beforeImage?.alternativeText || study?.beforeLabel || "Before"}
                  fill
                  sizes="100vw"
                  className="object-cover object-top pointer-events-none select-none"
                  draggable={false}
                  unoptimized
                />
              )}
            </div>
          </>
        ) : beforeImage ? (
          <Image
            src={getStrapiMediaUrl(beforeImage)}
            alt={study?.beforeImage?.alternativeText || study?.beforeLabel || "Before"}
            fill
            sizes="100vw"
            className="object-cover object-top pointer-events-none select-none"
            draggable={false}
            unoptimized
          />
        ) : null}
      </div>

      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/80 px-4 py-1.5 font-satoshi text-[12px] sm:text-[13px] font-medium leading-none text-[#3C3C3C] shadow-sm backdrop-blur-sm pointer-events-none">
        {study?.beforeLabel || "Before"}
      </div>

      <div
        className={`absolute z-10 rounded-full bg-white/80 px-4 py-1.5 font-satoshi text-[12px] sm:text-[13px] font-medium leading-none text-[#3C3C3C] shadow-sm backdrop-blur-sm pointer-events-none ${
          isVertical ? "right-4 bottom-4" : "right-4 top-4"
        }`}
      >
        {study?.afterLabel || "After"}
      </div>

      <div
        className={`absolute z-20 bg-black pointer-events-none ${
          isVertical
            ? "left-0 right-0 h-0.5 -translate-y-1/2"
            : "top-0 bottom-0 w-0.5 -translate-x-1/2"
        }`}
        style={isVertical ? { top: `${position}%` } : { left: `${position}%` }}
      />
      <div
        className="absolute z-30 flex h-11 w-11 sm:h-13 sm:w-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)] pointer-events-none"
        style={
          isVertical
            ? { top: `${position}%`, left: "50%" }
            : { left: `${position}%`, top: "50%" }
        }
      >
        {isVertical ? (
          <div className="flex flex-col items-center gap-1">
            <svg
              viewBox="0 0 14 8"
              fill="none"
              className="w-3.5 h-2"
              aria-hidden="true"
            >
              <path
                d="M1.5 6.5L7 1.5L12.5 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 14 8"
              fill="none"
              className="w-3.5 h-2"
              aria-hidden="true"
            >
              <path
                d="M1.5 1.5L7 6.5L12.5 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 8 14"
              fill="none"
              className="h-4 w-2.5"
              aria-hidden="true"
            >
              <path
                d="M6.5 1.5L1.5 7L6.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 8 14"
              fill="none"
              className="h-4 w-2.5"
              aria-hidden="true"
            >
              <path
                d="M1.5 1.5L6.5 7L1.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudyShowcase({ data }: CaseStudyShowcaseProps) {
  const header = data?.header;
  const title =
    header?.title || "Where is the storefront costing you margin?";
  const description =
    header?.description ||
    "Select what applies. Most brands recognise three or four — and rarely the one they contacted us about.";

  const caseStudies = data?.caseStudies ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const currentSelectedId = selectedId ?? caseStudies[0]?.id;
  const selectedCaseStudy = caseStudies.find(
    (study) => study.id === currentSelectedId
  );

  return (
    <section className="px-[clamp(1.25rem,4.2vw,5.6875rem)] pt-[clamp(4rem,6vw,7.5rem)] pb-[clamp(5rem,8vw,10rem)] bg-[#F5F5F5] max-w-[1920px] mx-auto">
      <div className="w-full flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)] mb-[clamp(1.5rem,4.2vw,3.625rem)]">
        <h2 className="font-delight! text-[clamp(2.125rem,4.2vw,5rem)] font-medium leading-tight 2xl:leading-[1.12] tracking-[-0.01em] w-full lg:w-[78%]">
          {header?.mobileTitle ? (
            <>
              <span className="block lg:hidden">{header.mobileTitle}</span>
              <span className="hidden lg:block">{title}</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-[1.5] tracking-normal w-full lg:w-[60%]">
          {header?.mobileDescription ? (
            <>
              <span className="block lg:hidden">{header.mobileDescription}</span>
              <span className="hidden lg:block">{description}</span>
            </>
          ) : (
            description
          )}
        </p>
      </div>

      <div className="flex items-center gap-[clamp(0.5rem,4.2vw,1rem)] mb-[clamp(1.5rem,4.2vw,3.25rem)] overflow-x-auto no-scrollbar pb-2 sm:pb-0 flex-nowrap w-full">
        {caseStudies.map((study) => {
          const isActive = study.id === currentSelectedId;
          return (
            <button
              key={study.id}
              type="button"
              onClick={() => setSelectedId(study.id)}
              className={`h-[clamp(2.5rem,4.2vw,3.6875rem)] px-[clamp(1rem,4.2vw,2rem)] rounded-full border text-[clamp(0.875rem,4.2vw,1.375rem)] font-medium transition-all cursor-pointer flex items-center justify-center shrink-0 whitespace-nowrap ${
                isActive
                  ? "border-[#005540]/80 bg-[#95E7D3]/30 text-[#3C3C3C]"
                  : "border-[#CAC4D0] text-[#3C3C3C]"
              }`}
            >
              {study.clientName}
            </button>
          );
        })}
      </div>
      <BeforeAfterSlider study={selectedCaseStudy} />
    </section>
  );
}