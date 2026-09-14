"use client";

import Image from "next/image";
import { PointerEvent, useState, useEffect, useRef } from "react";
import { CaseStudy, CaseStudyShowcaseSection } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface CaseStudyShowcaseProps {
  data?: CaseStudyShowcaseSection;
}

const DESKTOP_DUST_DOTS = [
  { left: "4px", top: "48%", size: "5px", bg: "#FFFFFF", glow: "0 0 8px #FFFFFF, 0 0 16px #38BDF8, 0 0 24px rgba(49,69,221,0.8)", anim: "animate-dust-1", delay: "0s" },
  { left: "6px", top: "36%", size: "2.5px", bg: "#93C5FD", glow: "0 0 6px #38BDF8", anim: "animate-dust-2", delay: "0.4s" },
  { left: "5px", top: "62%", size: "2.5px", bg: "#A78BFA", glow: "0 0 6px #C084FC", anim: "animate-dust-3", delay: "0.8s" },
  { left: "8px", top: "25%", size: "1.5px", bg: "#E0F2FE", glow: "0 0 4px #38BDF8", anim: "animate-dust-1", delay: "1.2s" },
  { left: "7px", top: "75%", size: "2px", bg: "#60A5FA", glow: "0 0 5px #3145DD", anim: "animate-dust-2", delay: "0.6s" },
  { left: "14px", top: "42%", size: "5.5px", bg: "#FFFFFF", glow: "0 0 10px #FFFFFF, 0 0 20px #38BDF8, 0 0 28px rgba(49,69,221,0.9)", anim: "animate-dust-3", delay: "0.3s" },
  { left: "16px", top: "54%", size: "3px", bg: "#38BDF8", glow: "0 0 8px #38BDF8", anim: "animate-dust-1", delay: "1.5s" },
  { left: "18px", top: "28%", size: "3.5px", bg: "#67E8F9", glow: "0 0 8px #38BDF8", anim: "animate-dust-2", delay: "0.9s" },
  { left: "20px", top: "66%", size: "3px", bg: "#C084FC", glow: "0 0 8px #A855F7", anim: "animate-dust-3", delay: "0.1s" },
  { left: "22px", top: "38%", size: "2px", bg: "#BAE6FD", glow: "0 0 5px #38BDF8", anim: "animate-dust-1", delay: "1.8s" },
  { left: "25px", top: "78%", size: "2.5px", bg: "#818CF8", glow: "0 0 6px #4F46E5", anim: "animate-dust-2", delay: "1.1s" },
  { left: "28px", top: "18%", size: "1.5px", bg: "#E0E7FF", glow: "0 0 4px #818CF8", anim: "animate-dust-3", delay: "0.5s" },
  { left: "30px", top: "48%", size: "2px", bg: "#E0F2FE", glow: "0 0 5px #38BDF8", anim: "animate-dust-1", delay: "2.1s" },
  { left: "34px", top: "32%", size: "4px", bg: "#FFFFFF", glow: "0 0 8px #FFFFFF, 0 0 14px #38BDF8", anim: "animate-dust-2", delay: "1.3s" },
  { left: "38px", top: "58%", size: "4px", bg: "#38BDF8", glow: "0 0 10px #38BDF8, 0 0 18px #3145DD", anim: "animate-dust-3", delay: "0.7s" },
  { left: "42px", top: "24%", size: "2.5px", bg: "#C084FC", glow: "0 0 6px #C084FC", anim: "animate-dust-1", delay: "1.6s" },
  { left: "45px", top: "68%", size: "3px", bg: "#60A5FA", glow: "0 0 7px #38BDF8", anim: "animate-dust-2", delay: "0.2s" },
  { left: "48px", top: "44%", size: "2px", bg: "#E0F2FE", glow: "0 0 5px #38BDF8", anim: "animate-dust-3", delay: "1.9s" },
  { left: "52px", top: "82%", size: "1.5px", bg: "#A78BFA", glow: "0 0 4px #A78BFA", anim: "animate-dust-1", delay: "0.8s" },
  { left: "56px", top: "34%", size: "3px", bg: "#BAE6FD", glow: "0 0 7px #38BDF8", anim: "animate-dust-2", delay: "1.4s" },
  { left: "60px", top: "54%", size: "3.5px", bg: "#38BDF8", glow: "0 0 8px #38BDF8", anim: "animate-dust-3", delay: "0.6s" },
  { left: "64px", top: "28%", size: "1.5px", bg: "#FFFFFF", glow: "0 0 5px #FFFFFF", anim: "animate-dust-1", delay: "2.3s" },
  { left: "68px", top: "64%", size: "2px", bg: "#818CF8", glow: "0 0 5px #818CF8", anim: "animate-dust-2", delay: "1.0s" },
  { left: "72px", top: "42%", size: "2px", bg: "#67E8F9", glow: "0 0 5px #38BDF8", anim: "animate-dust-3", delay: "1.7s" },
  { left: "76px", top: "50%", size: "1.5px", bg: "#C084FC", glow: "0 0 4px #C084FC", anim: "animate-dust-1", delay: "0.4s" },
];

const MOBILE_DUST_DOTS = [
  { left: "48%", top: "3px", size: "3.5px", bg: "#FFFFFF", glow: "0 0 6px #FFFFFF, 0 0 12px #38BDF8", anim: "animate-dust-1", delay: "0s" },
  { left: "38%", top: "5px", size: "2px", bg: "#93C5FD", glow: "0 0 4px #38BDF8", anim: "animate-dust-2", delay: "0.4s" },
  { left: "58%", top: "6px", size: "2px", bg: "#A78BFA", glow: "0 0 5px #C084FC", anim: "animate-dust-3", delay: "0.8s" },
  { left: "50%", top: "11px", size: "4px", bg: "#FFFFFF", glow: "0 0 8px #FFFFFF, 0 0 14px #38BDF8", anim: "animate-dust-1", delay: "0.2s" },
  { left: "42%", top: "14px", size: "2.5px", bg: "#38BDF8", glow: "0 0 6px #38BDF8", anim: "animate-dust-2", delay: "1.2s" },
  { left: "62%", top: "16px", size: "2px", bg: "#C084FC", glow: "0 0 5px #A855F7", anim: "animate-dust-3", delay: "0.6s" },
  { left: "32%", top: "18px", size: "1.5px", bg: "#BAE6FD", glow: "0 0 4px #38BDF8", anim: "animate-dust-1", delay: "1.5s" },
  { left: "52%", top: "22px", size: "3px", bg: "#38BDF8", glow: "0 0 7px #38BDF8", anim: "animate-dust-2", delay: "0.9s" },
  { left: "68%", top: "24px", size: "1.5px", bg: "#818CF8", glow: "0 0 4px #818CF8", anim: "animate-dust-3", delay: "1.7s" },
  { left: "44%", top: "28px", size: "2px", bg: "#FFFFFF", glow: "0 0 4px #FFFFFF", anim: "animate-dust-1", delay: "0.5s" },
  { left: "56%", top: "32px", size: "2.5px", bg: "#93C5FD", glow: "0 0 5px #38BDF8", anim: "animate-dust-2", delay: "1.4s" },
  { left: "36%", top: "36px", size: "1.5px", bg: "#A78BFA", glow: "0 0 4px #A78BFA", anim: "animate-dust-3", delay: "0.7s" },
  { left: "48%", top: "40px", size: "2px", bg: "#38BDF8", glow: "0 0 5px #38BDF8", anim: "animate-dust-1", delay: "1.1s" },
  { left: "60%", top: "44px", size: "1.5px", bg: "#C084FC", glow: "0 0 4px #C084FC", anim: "animate-dust-2", delay: "1.8s" },
];

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

  const [prevStudyId, setPrevStudyId] = useState(study?.id);
  if (study?.id !== prevStudyId) {
    setPrevStudyId(study?.id);
    setPosition(50);
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number, clientY: number, container: HTMLElement) => {
    const rect = container.getBoundingClientRect();
    if (isVertical) {
      const nextPosition = ((clientY - rect.top) / rect.height) * 100;
      setPosition(Math.min(100, Math.max(0, nextPosition)));
    } else {
      const nextPosition = ((clientX - rect.left) / rect.width) * 100;
      setPosition(Math.min(100, Math.max(0, nextPosition)));
    }
  };

  const handleContainerPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isVertical) return;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (containerRef.current) {
      updatePosition(event.clientX, event.clientY, containerRef.current);
    }
  };

  const handleContainerPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isVertical || !isDragging) return;
    if (containerRef.current) {
      updatePosition(event.clientX, event.clientY, containerRef.current);
    }
  };

  const handleContainerPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (isVertical) return;
    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
  };

  const handleSliderPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSliderPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (containerRef.current) {
      updatePosition(event.clientX, event.clientY, containerRef.current);
    }
  };

  const handleSliderPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
  };

  const beforeImage = study?.beforeImage?.url;
  const afterImage = study?.afterImage?.url;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-9/16 md:aspect-1720/969 rounded-xl md:rounded-2xl overflow-hidden select-none bg-white ${
        isVertical ? "touch-pan-y cursor-default" : "touch-none cursor-pointer"
      }`}
      onPointerDown={handleContainerPointerDown}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handleContainerPointerUp}
      onPointerCancel={handleContainerPointerUp}
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
        className={`absolute z-30 flex items-center justify-center select-none ${
          isVertical
            ? "left-0 right-0 h-14 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
            : "top-0 bottom-0 w-14 -translate-x-1/2 pointer-events-none"
        }`}
        style={isVertical ? { top: `${position}%` } : { left: `${position}%` }}
        onPointerDown={isVertical ? handleSliderPointerDown : undefined}
        onPointerMove={isVertical ? handleSliderPointerMove : undefined}
        onPointerUp={isVertical ? handleSliderPointerUp : undefined}
        onPointerCancel={isVertical ? handleSliderPointerUp : undefined}
      >
        <div
          className={`absolute bg-black pointer-events-none ${
            isVertical ? "left-0 right-0 h-0.5" : "top-0 bottom-0 w-0.5"
          }`}
        />
        <div className="relative z-10 flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 aspect-square items-center justify-center rounded-full bg-[#090C15] border border-white/35 animate-slider-handle-pulse pointer-events-none transition-transform duration-200">
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 aspect-square flex items-center justify-center pointer-events-none select-none">
            <Image
              src="/footercircle.avif"
              alt="Thumbstack Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain brightness-125 pointer-events-none select-none"
              style={{
                filter:
                  "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px #38bdf8) drop-shadow(0 0 20px rgba(49,69,221,0.7))",
              }}
              draggable={false}
            />
          </div>

          {isVertical ? (
            <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-20 h-14 pointer-events-none">
              {MOBILE_DUST_DOTS.map((dot, idx) => (
                <span
                  key={idx}
                  className={`absolute rounded-full pointer-events-none ${dot.anim}`}
                  style={{
                    left: dot.left,
                    top: dot.top,
                    width: dot.size,
                    height: dot.size,
                    backgroundColor: dot.bg,
                    boxShadow: dot.glow,
                    animationDelay: dot.delay,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none">
              {DESKTOP_DUST_DOTS.map((dot, idx) => (
                <span
                  key={idx}
                  className={`absolute rounded-full pointer-events-none ${dot.anim}`}
                  style={{
                    left: dot.left,
                    top: dot.top,
                    width: dot.size,
                    height: dot.size,
                    backgroundColor: dot.bg,
                    boxShadow: dot.glow,
                    animationDelay: dot.delay,
                  }}
                />
              ))}
            </div>
          )}
        </div>
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
    <section id="case-studies" className="w-full bg-[#F5F5F5] scroll-mt-20">
      <div className="max-w-[1920px] mx-auto w-full px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] pt-[clamp(4rem,6vw,7.5rem)] pb-[clamp(5rem,8vw,10rem)]">
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
          <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-normal tracking-normal w-full lg:w-[60%]">
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
      </div>
    </section>
  );
}