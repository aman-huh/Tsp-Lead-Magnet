"use client";

import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import { ClientShowcaseSection, Brand } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface ClientShowcaseProps {
  data?: ClientShowcaseSection;
  brands?: Brand[];
}

const DEFAULT_SERVICES = [
  "mobile apps",
  "human-centered products",
  "end-to-end ownership",
  "ecommerce",
  "product strategy",
  "rapid prototyping",
  "ux design",
];

const LOGO_DISPLAY_MS = 3200;
const CROSSFADE_MS = 700;

function DynamicBrandLogo({ brands }: { brands?: Brand[] }) {
  const displayBrands = useMemo(
    () => brands?.filter((b) => Boolean(b.logo?.url)) ?? [],
    [brands]
  );
  const n = displayBrands.length;
  const [slotIndex, setSlotIndex] = useState({ A: 0, B: n > 1 ? 1 : 0 });
  const [front, setFront] = useState<"A" | "B">("A");
  const [transitioning, setTransitioning] = useState(false);

  const frontRef = useRef(front);
  const slotIndexRef = useRef(slotIndex);

  useLayoutEffect(() => {
    frontRef.current = front;
    slotIndexRef.current = slotIndex;
  }, [front, slotIndex]);

  useEffect(() => {
    if (n <= 1) return;

    let transitionTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      const currentFront = frontRef.current;
      const back: "A" | "B" = currentFront === "A" ? "B" : "A";

      setTransitioning(true);

      transitionTimeout = setTimeout(() => {
        const newFrontIndex = slotIndexRef.current[back];
        const nextIndex = (newFrontIndex + 1) % n;

        setFront(back);
        setTransitioning(false);
        setSlotIndex((prev) => ({ ...prev, [currentFront]: nextIndex }));
      }, CROSSFADE_MS);
    }, LOGO_DISPLAY_MS);

    return () => {
      clearInterval(interval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [n]);

  if (n === 0) return null;

  const aIsFront = front === "A";
  const opacityA = aIsFront ? (transitioning ? 0 : 1) : (transitioning ? 1 : 0);
  const opacityB = !aIsFront ? (transitioning ? 0 : 1) : (transitioning ? 1 : 0);

  const brandA = displayBrands[Math.min(slotIndex.A, n - 1)];
  const brandB = n > 1 ? displayBrands[Math.min(slotIndex.B, n - 1)] : null;

  const frontBrand = aIsFront ? brandA : brandB;
  const backBrand = aIsFront ? brandB : brandA;
  const targetBgColor = (transitioning ? backBrand?.brandColor : frontBrand?.brandColor) ?? "#ffffff";

  return (
    <span
      className="relative inline-flex items-center justify-center align-middle mx-[clamp(0.25rem,1vw,0.5rem)] sm:mx-[clamp(0.5rem,0.7vw,0.75rem)] w-[clamp(2.75rem,11vw,4rem)] h-[clamp(2.75rem,11vw,4rem)] sm:w-[clamp(3rem,4.1vw,4.5rem)] sm:h-[clamp(3rem,4.1vw,4.5rem)] aspect-square rounded-lg border border-[#E2E4E8] shadow-xs p-[clamp(0.375rem,1.5vw,0.5rem)] sm:p-[clamp(0.375rem,0.7vw,0.5rem)] overflow-hidden -translate-y-[clamp(0.125rem,0.8vw,0.25rem)] sm:-translate-y-[clamp(0.125rem,0.35vw,0.25rem)] shrink-0 select-none transition-[background-color] motion-reduce:transition-none"
      style={{
        backgroundColor: targetBgColor,
        transitionDuration: `${CROSSFADE_MS}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
    >
      {brandA?.logo?.url && (
        <span
          className="absolute inset-[clamp(0.375rem,1.5vw,0.5rem)] sm:inset-[clamp(0.375rem,0.7vw,0.5rem)] flex items-center justify-center transition-opacity motion-reduce:transition-none pointer-events-none"
          style={{
            opacity: opacityA,
            transitionDuration: `${CROSSFADE_MS}ms`,
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <Image
            src={getStrapiMediaUrl(brandA.logo.url)}
            alt={brandA.logo.alternativeText || brandA.name || "Brand logo"}
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-contain p-0.5"
            unoptimized
          />
        </span>
      )}
      {brandB?.logo?.url && (
        <span
          className="absolute inset-[clamp(0.375rem,1.5vw,0.5rem)] sm:inset-[clamp(0.375rem,0.7vw,0.5rem)] flex items-center justify-center transition-opacity motion-reduce:transition-none pointer-events-none"
          style={{
            opacity: opacityB,
            transitionDuration: `${CROSSFADE_MS}ms`,
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <Image
            src={getStrapiMediaUrl(brandB.logo.url)}
            alt={brandB.logo.alternativeText || brandB.name || "Brand logo"}
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-contain p-0.5"
            unoptimized
          />
        </span>
      )}
    </span>
  );
}

export default function ClientShowcase({ data, brands }: ClientShowcaseProps) {
  const badge = data?.badge || "5+ Years of Shopify Excellence";
  const title = data?.title || "Where brands like {logo} transformed their Shopify experience.";
  const description =
    data?.description ||
    "We redesign Shopify stores with refined UX, stunning visuals, and performance-focused decisions.";

  const actions =
    data?.actions && data.actions.length > 0
      ? data.actions
      : [
        { id: 1, text: "Get My Instant Quote", url: "#quote" },
        { id: 2, text: "Book a Free Call", url: "#book-call" },
      ];

  const rawServices =
    data?.services && data.services.length > 0
      ? data.services.map((item) => item.Text || item.text).filter(Boolean)
      : DEFAULT_SERVICES;

  const services = (rawServices.length > 0 ? rawServices : DEFAULT_SERVICES) as string[];

  const renderTitle = () => {
    if (
      title.includes("{{brandLogo}}") ||
      title.includes("{logo}") ||
      title.includes("[logo]")
    ) {
      const parts = title.split(/\{\{brandLogo\}\}|\{logo\}|\[logo\]/);
      return (
        <>
          {parts[0]}
          <DynamicBrandLogo key={brands?.length ?? 0} brands={brands} />
          {parts[1]}
        </>
      );
    }

    return title;
  };

  return (
    <section className="bg-[#95E7D30D] pt-[clamp(6rem,24vw,7rem)] sm:pt-[clamp(4.5rem,6vw,7.5rem)] flex flex-col justify-between overflow-hidden sm:min-h-screen">
      <div className="max-w-[1920px] mx-auto sm:my-auto w-full px-[clamp(1.5rem,6vw,2rem)] sm:px-[clamp(3rem,4.2vw,5rem)] text-left sm:text-center flex flex-col items-start sm:items-center">
        <div className="w-full max-w-4xl 2xl:max-w-6xl 3xl:max-w-7xl">
          {badge && (
            <div className="hidden sm:block sm:mb-[clamp(1.5rem,2.1vw,2rem)] 2xl:mb-[clamp(2rem,2.5vw,2.5rem)] 3xl:mb-12">
              <Badge>{badge}</Badge>
            </div>
          )}

          <h2 className="font-heading text-[clamp(2.375rem,10vw,2.625rem)] sm:text-[clamp(3.5rem,3.889vw,4.25rem)] 3xl:text-[clamp(4.25rem,3.855vw,4.625rem)] text-[#0F1D07] text-left sm:text-center leading-[1.12] sm:leading-[1.14] 2xl:leading-[1.3] tracking-[-0.02em] mx-auto">
            {renderTitle()}
          </h2>

          {description && (
            <p className="font-satoshi font-medium text-[clamp(0.8125rem,4.2vw,1.125rem)] text-[#0F1D07]/90 leading-[1.5] max-w-xl 2xl:max-w-2xl sm:mx-auto mt-[clamp(1.5rem,5vw,1.75rem)] sm:mt-[clamp(1.5rem,1.828vw,2rem)]">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-[clamp(0.625rem,3vw,0.875rem)] sm:gap-[clamp(1rem,1.2vw,1rem)] mt-[clamp(2rem,6vw,2.25rem)] sm:mt-[clamp(2rem,2.286vw,2.5rem)]">
            {actions.map((action, idx) => {
              const isPrimary = idx === 0;

              return (
                <Button
                  key={action.id || idx}
                  theme="light"
                  shape="pill"
                  variant={isPrimary ? "solid" : "outline"}
                  size="lg"
                  text={action.text}
                  url={action.url}
                  className="w-full sm:w-auto justify-center"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#4A71A5] overflow-hidden py-[clamp(0.75rem,3vw,1rem)] sm:py-[clamp(1.125rem,1.25vw,1.25rem)] mt-[clamp(4.5rem,14vw,5rem)] sm:mt-[clamp(6rem,7.333vw,8rem)] select-none">
        <div className="flex whitespace-nowrap w-max animate-marquee">
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex items-center shrink-0"
              aria-hidden={copyIndex === 1 ? true : undefined}
            >
              {[...services, ...services, ...services, ...services].map((service, idx) => (
                <span key={`${copyIndex}-${idx}`} className="inline-flex items-center">
                  <span className="text-white font-satoshi sm:font-heading text-[clamp(0.875rem,3.6vw,1rem)] sm:text-[clamp(1.25rem,1.45vw,1.5rem)] leading-4.5 tracking-normal uppercase sm:lowercase">
                    {service}
                  </span>
                  <span
                    className="w-[clamp(0.5rem,2vw,0.625rem)] h-[clamp(0.5rem,2vw,0.625rem)] sm:w-[clamp(0.75rem,0.75vw,0.75rem)] sm:h-[clamp(0.75rem,0.75vw,0.75rem)] rounded-full bg-white mx-[clamp(1.25rem,5vw,1.75rem)] sm:mx-[clamp(2.25rem,2.5vw,2.5rem)] shrink-0 inline-block"
                    aria-hidden="true"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
