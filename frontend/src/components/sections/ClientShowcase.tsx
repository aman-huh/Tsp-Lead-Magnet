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
      className="relative inline-flex items-center justify-center align-middle mx-[clamp(0.55rem,1.8vw,0.85rem)] sm:mx-[clamp(0.75rem,1.2vw,1.15rem)] w-[clamp(2.625rem,10.5vw,3.5rem)] h-[clamp(2.625rem,10.5vw,3.5rem)] sm:w-[clamp(3.125rem,3.8vw,4.75rem)] sm:h-[clamp(3.125rem,3.8vw,4.75rem)] aspect-square rounded-[8px] sm:rounded-[10px] border border-black/[0.08] overflow-hidden shrink-0 select-none -translate-y-[0.1em] sm:-translate-y-[0.12em] transition-[background-color] motion-reduce:transition-none"
      style={{
        backgroundColor: targetBgColor,
        transitionDuration: `${CROSSFADE_MS}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
    >
      {brandA?.logo?.url && (
        <span
          className="absolute inset-[clamp(0.5rem,1.6vw,0.75rem)] sm:inset-[clamp(0.6rem,1.1vw,0.9rem)] flex items-center justify-center transition-opacity motion-reduce:transition-none pointer-events-none"
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
            className="object-contain"
            unoptimized
          />
        </span>
      )}
      {brandB?.logo?.url && (
        <span
          className="absolute inset-[clamp(0.5rem,1.6vw,0.75rem)] sm:inset-[clamp(0.6rem,1.1vw,0.9rem)] flex items-center justify-center transition-opacity motion-reduce:transition-none pointer-events-none"
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
            className="object-contain"
            unoptimized
          />
        </span>
      )}
    </span>
  );
}

export default function ClientShowcase({ data, brands }: ClientShowcaseProps) {
  const badge = data?.badge || "5+ Years of Shopify Excellence";
  const title = data?.title || "Where brands like {logo} transformed their Shopify.";
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

  const parsedTitle = useMemo(() => {
    const logoPlaceholderRegex = /\{\{brandLogo\}\}|\{logo\}|\[logo\]/i;
    if (!logoPlaceholderRegex.test(title)) {
      return null;
    }

    const [rawPrefix, rawSuffix] = title.split(logoPlaceholderRegex);

    // Split prefix into "Where brands" and "like"
    const prefixMatch = rawPrefix.match(/^(.*?)\b(like)\s*$/i);
    const line1Prefix = prefixMatch ? prefixMatch[1].trim() : rawPrefix.trim();
    const likeText = prefixMatch ? prefixMatch[2] : "";

    // Split suffix into first word ("transformed") and rest ("their Shopify.")
    const suffixMatch = rawSuffix.match(/^\s*(\S+)\s*([\s\S]*)$/);
    const firstSuffixWord = suffixMatch ? suffixMatch[1].trim() : rawSuffix.trim();
    const restSuffixText = suffixMatch ? suffixMatch[2].trim() : "";

    return {
      line1Prefix,
      likeText,
      firstSuffixWord,
      restSuffixText,
      rawPrefix: rawPrefix.trim(),
      rawSuffix: rawSuffix.trim(),
    };
  }, [title]);

  const renderTitle = () => {
    if (!parsedTitle) {
      return title;
    }

    return (
      <>
        {/* Mobile layout (< sm): exactly 3 lines */}
        <span className="block sm:hidden">
          <span className="block leading-[1.14]">{parsedTitle.line1Prefix}</span>
          <span className="block whitespace-nowrap leading-[1.14] my-0.5">
            {parsedTitle.likeText && <span>{parsedTitle.likeText}</span>}
            <DynamicBrandLogo key={`mob-${brands?.length ?? 0}`} brands={brands} />
            {parsedTitle.firstSuffixWord && <span>{parsedTitle.firstSuffixWord}</span>}
          </span>
          {parsedTitle.restSuffixText && (
            <span className="block leading-[1.14]">{parsedTitle.restSuffixText}</span>
          )}
        </span>

        {/* Middle and desktop layout (sm+): exactly 2 lines with 'transformed' on line 1 */}
        <span className="hidden sm:inline">
          <span className="sm:inline-block sm:whitespace-nowrap leading-[1.14]">
            {parsedTitle.line1Prefix}
            {parsedTitle.likeText ? ` ${parsedTitle.likeText}` : ""}
            <DynamicBrandLogo key={`desk-${brands?.length ?? 0}`} brands={brands} />
            {parsedTitle.firstSuffixWord}
          </span>
          <br />
          <span className="sm:inline-block sm:whitespace-nowrap leading-[1.14]">
            {parsedTitle.restSuffixText}
          </span>
        </span>
      </>
    );
  };

  return (
    <section className="bg-[#95E7D30D] pt-[clamp(6rem,16vw,9rem)] sm:pt-[clamp(7rem,12vw,10.5rem)] lg:pt-0 flex flex-col justify-between overflow-hidden lg:h-screen lg:min-h-[640px]">
      <div className="max-w-[1920px] mx-auto lg:my-auto w-full px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] text-left sm:text-center flex flex-col items-start sm:items-center">
        <div className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl 3xl:max-w-[90rem]">
          {badge && (
            <div className="hidden sm:block sm:mb-[clamp(1.5rem,2.1vw,2rem)] 2xl:mb-[clamp(2rem,2.5vw,2.5rem)] 3xl:mb-12">
              <Badge>{badge}</Badge>
            </div>
          )}

          <h2 className="font-heading text-[clamp(2rem,8.8vw,2.5rem)] sm:text-[clamp(1.875rem,2.9vw,4.25rem)] 2xl:text-[clamp(3.85rem,3.4vw,4.625rem)] text-[#0F1D07] text-left sm:text-center leading-[1.12] sm:leading-[1.14] 2xl:leading-[1.25] tracking-[-0.02em] mx-auto">
            {renderTitle()}
          </h2>

          {description && (
            <p className="font-satoshi text-[clamp(0.875rem,3.8vw,1.125rem)] font-semibold text-[#0F1D07]/90 leading-[1.5] max-w-md sm:max-w-xl 2xl:max-w-2xl sm:mx-auto mt-[clamp(1.25rem,4vw,1.75rem)] sm:mt-[clamp(1.5rem,1.828vw,2rem)]">
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
                  arrowType="right"
                  text={action.text}
                  url={action.url}
                  className={`w-full sm:w-auto justify-center ${
                    !isPrimary ? "bg-white! hover:bg-white!" : ""
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#4A71A5] shrink-0 overflow-hidden py-[clamp(0.75rem,3vw,1rem)] sm:py-[clamp(1.125rem,1.25vw,1.25rem)] mt-[clamp(5rem,14vw,8.5rem)] sm:mt-[clamp(6.5rem,11vw,9.5rem)] lg:mt-0 select-none">
        <div className="flex whitespace-nowrap w-max animate-marquee">
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex items-center shrink-0"
              aria-hidden={copyIndex === 1 ? true : undefined}
            >
              {[...services, ...services, ...services, ...services].map((service, idx) => (
                <span key={`${copyIndex}-${idx}`} className="inline-flex items-center">
                  <span className="text-white font-satoshi sm:font-heading text-[clamp(0.8125rem,3.2vw,0.9375rem)] sm:text-[clamp(1.0625rem,1.25vw,1.25rem)] leading-4.5 tracking-normal uppercase sm:lowercase">
                    {service}
                  </span>
                  <span
                    className="w-[clamp(0.4375rem,1.8vw,0.5625rem)] h-[clamp(0.4375rem,1.8vw,0.5625rem)] sm:w-[clamp(0.625rem,0.625vw,0.6875rem)] sm:h-[clamp(0.625rem,0.625vw,0.6875rem)] rounded-full bg-white mx-[clamp(1.25rem,5vw,1.75rem)] sm:mx-[clamp(2rem,2.2vw,2.25rem)] shrink-0 inline-block"
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
