"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import Button from "@/components/shared/Button";
import { OurProcessSection, ProcessCard } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface OurProcessProps {
  data?: OurProcessSection;
}

function DefaultLightbulbIcon() {
  return <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" strokeWidth={1.8} />;
}

function ContentCardItem({ card }: { card: ProcessCard }) {
  const [isTapped, setIsTapped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaText = card.cta?.text || "Explore";
  const ctaUrl = card.cta?.url || "#";
  const hasHoverList = card.hoverList && card.hoverList.length > 0;

  useEffect(() => {
    if (!isTapped) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsTapped(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isTapped]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!hasHoverList) return;
    const target = e.target as HTMLElement;
    if (isTapped && target.closest("a")) {
      return;
    }
    setIsTapped((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`bg-[#1B2F10] ${
        hasHoverList ? "" : "hover:bg-[#254419]"
      } rounded-xl p-[clamp(0.95rem,1.8vw,2.25rem)] flex flex-col justify-between aspect-331/421 sm:aspect-4/3 lg:aspect-331/421 max-h-75 sm:max-h-77.5 md:max-h-85 lg:max-h-105 min-h-52.5 h-full w-full relative group overflow-hidden transition-all duration-300 ${
        hasHoverList ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`flex flex-col justify-between flex-1 h-full w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isTapped
            ? "opacity-0 -translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0 lg:group-hover:opacity-0 lg:group-hover:-translate-y-3"
        }`}
      >
        <div>
          <div className="w-[clamp(1.3rem,2vw,2.25rem)] h-[clamp(1.3rem,2vw,2.25rem)] relative mb-2.5 sm:mb-4 lg:mb-4 xl:mb-6 flex items-center">
            {card.icon?.url ? (
              <Image
                src={getStrapiMediaUrl(card.icon.url)}
                alt={card.title || "Process icon"}
                width={32}
                height={32}
                className="w-full h-full object-contain brightness-0 invert opacity-90"
              />
            ) : (
              <DefaultLightbulbIcon />
            )}
          </div>

          <h3 className="text-white font-medium text-[clamp(0.875rem,1.6vw,1.75rem)] tracking-[-0.01em] mb-1.5 sm:mb-2.5 lg:mb-3 font-delight! leading-[1.15] sm:leading-tight">
            {card.title}
          </h3>

          <p className="text-[#95A897] font-satoshi text-[clamp(0.7rem,1vw,0.9375rem)] font-medium leading-snug sm:leading-normal lg:leading-relaxed line-clamp-4 sm:line-clamp-none">
            {card.description}
          </p>
        </div>

        <div className="pt-2 sm:pt-4 lg:pt-5 xl:pt-6 mt-auto">
          <Link
            href={ctaUrl}
            onClick={(e) => {
              if (hasHoverList && !isTapped) {
                e.preventDefault();
                setIsTapped(true);
              }
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-white font-medium text-[clamp(0.75rem,1vw,0.9375rem)] hover:text-white/80 transition-colors"
          >
            <span>{ctaText}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {hasHoverList && (
        <div
          className={`absolute inset-0 z-20 bg-[#2D4620] p-[clamp(0.75rem,1.6vw,1.75rem)] flex flex-col justify-start transition-opacity duration-300 ease-out rounded-xl overflow-y-auto no-scrollbar ${
            isTapped
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto lg:group-hover:duration-500"
          }`}
        >
          <ul className="divide-y divide-white/10 w-full">
            {card.hoverList?.map((item, idx) => (
              <li
                key={item.id}
                style={{
                  ["--enter-delay" as string]: `${idx * 40}ms`,
                }}
                className={`flex items-center gap-[4.5px] sm:gap-2.5 py-1.75 sm:py-3.5 lg:py-[clamp(0.75rem,0.7vw,0.65rem)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isTapped
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 delay-0 lg:group-hover:delay-(--enter-delay)"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white/70 shrink-0"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-satoshi text-[clamp(0.54rem,2.2vw,0.9375rem)] leading-[1.3] font-normal">
                  {item.Text || item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LazyProcessVideo({
  url,
  alt,
  poster,
}: {
  url: string;
  alt?: string;
  poster?: string;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fullMediaUrl = getStrapiMediaUrl(url);
  const rawPoster =
    poster ||
    (url.includes("cloudinary.com")
      ? fullMediaUrl.replace(/\.[^.]+$/, ".webp")
      : undefined);
  const posterUrl =
    rawPoster && rawPoster.includes("cloudinary.com")
      ? rawPoster.replace(/\.[^.]+$/, ".webp")
      : rawPoster;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );

    loadObserver.observe(el);
    return () => {
      loadObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    playbackObserver.observe(video);
    return () => {
      playbackObserver.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="bg-black rounded-xl overflow-hidden relative w-full h-full aspect-755/421 max-h-105 flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={shouldLoad ? fullMediaUrl : undefined}
        poster={posterUrl}
        preload={shouldLoad ? "auto" : "none"}
        loop
        muted
        playsInline
        aria-label={alt || "Process video"}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function MediaCardItem({ card }: { card: ProcessCard }) {
  const isVideo =
    card.media?.mime?.includes("video") ||
    card.media?.url?.endsWith(".mp4") ||
    card.media?.url?.endsWith(".webm");

  if (isVideo && card.media?.url) {
    const poster = card.media.formats?.thumbnail?.url
      ? getStrapiMediaUrl(card.media.formats.thumbnail.url)
      : undefined;

    return (
      <LazyProcessVideo
        url={card.media.url}
        alt={card.media.alternativeText || undefined}
        poster={poster}
      />
    );
  }

  if (card.media?.url) {
    return (
      <div className="bg-white rounded-xl overflow-hidden relative w-full h-full aspect-755/421 max-h-105 flex items-center justify-center p-3 sm:p-4">
        <Image
          src={getStrapiMediaUrl(card.media.url)}
          alt={card.media.alternativeText || "Strategic design process"}
          width={card.media.width || 1679}
          height={card.media.height || 937}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#1B2F10] rounded-xl w-full h-full aspect-755/421 max-h-105" />
  );
}

function chunkCardsIntoRows(cards: ProcessCard[]): ProcessCard[][] {
  const rows: ProcessCard[][] = [];
  let currentRow: ProcessCard[] = [];
  let currentWeight = 0;

  for (const card of cards) {
    const weight = card.size === "wide" || card.variant === "media" ? 2 : 1;
    if (currentWeight + weight > 4 && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [card];
      currentWeight = weight;
    } else {
      currentRow.push(card);
      currentWeight += weight;
      if (currentWeight >= 4) {
        rows.push(currentRow);
        currentRow = [];
        currentWeight = 0;
      }
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

function getRowGridTemplate(row: ProcessCard[]): string {
  const wideIndex = row.findIndex(
    (c) => c.size === "wide" || c.variant === "media"
  );

  if (row.length === 3 && wideIndex !== -1) {
    if (wideIndex === 0) return "lg:grid-cols-[2.28fr_1fr_1fr]";
    if (wideIndex === 1) return "lg:grid-cols-[1fr_2.28fr_1fr]";
    if (wideIndex === 2) return "lg:grid-cols-[1fr_1fr_2.28fr]";
  }

  if (row.length === 4) return "lg:grid-cols-4";
  if (row.length === 3) return "lg:grid-cols-3";
  if (row.length === 2) {
    if (wideIndex === 0) return "lg:grid-cols-[2.28fr_1fr]";
    if (wideIndex === 1) return "lg:grid-cols-[1fr_2.28fr]";
    return "lg:grid-cols-2";
  }

  return "lg:grid-cols-1";
}

export default function OurProcess({ data }: OurProcessProps) {
  const eyebrow = data?.eyebrow || "Our Process";
  const title =
    data?.header?.title || "Every Capability Runs Through The Same System.";
  const description =
    data?.header?.description ||
    "Whether we are building a Shopify store, a custom website, a CMS platform, or a mobile app ecosystem, the process stays connected.";
  const ctaText = data?.CTA?.text || "Explore Our Services";
  const ctaUrl = data?.CTA?.url || "#services";
  const cards = data?.desktopCards || data?.cards || [];
  const rows = chunkCardsIntoRows(cards);

  return (
    <section id="process" className="bg-[#0F1D07] py-[clamp(3.5rem,6vw,8rem)] px-[clamp(1rem,4.2vw,11.2rem)] sm:px-[clamp(1.5rem,6vw,11.2rem)] lg:px-[clamp(2.5rem,11.5vw,11.2rem)] text-white scroll-mt-20">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12 px-0 lg:px-[clamp(1rem,2vw,2rem)]">
          <div className="flex flex-col gap-3 sm:gap-5 lg:gap-6">
            <p className="text-white text-[clamp(0.75rem,4.2vw,0.9375rem)] font-satoshi font-normal tracking-wide">
              {eyebrow}
            </p>
            <h2 className="font-delight! text-[clamp(1.65rem,3.8vw,2.8rem)] font-medium text-white leading-tight sm:leading-normal tracking-[-0.02em] max-w-[95%] lg:max-w-[70%]">
              {title}
            </h2>
            <p className="text-white text-[clamp(0.75rem,4.2vw,0.95rem)] font-satoshi leading-normal max-w-[95%] lg:max-w-[75%]">
              {description}
            </p>
          </div>

          <div className="shrink-0 self-start lg:self-center">
            <Button
              theme="dark"
              shape="rounded"
              variant="solid"
              showArrow={false}
              size="md"
              text={ctaText}
              url={ctaUrl}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[clamp(0.75rem,2vw,2rem)] mt-[clamp(2rem,4vw,4.5rem)]">
          {rows.map((row, rowIndex) => {
            const template = getRowGridTemplate(row);

            return (
              <div
                key={rowIndex}
                className={`grid grid-cols-2 ${template} gap-[clamp(0.625rem,2vw,2rem)] items-stretch`}
              >
                {row.map((card) => {
                  const isWide = card.size === "wide" || card.variant === "media";
                  const spanClass = isWide ? "col-span-2 lg:col-span-1" : "col-span-1 lg:col-span-1";
                  const orderClass = isWide ? "order-first lg:order-0" : "";
                  const maxHClass = isWide
                    ? "max-h-105"
                    : "max-h-105 sm:max-h-70 md:max-h-75 lg:max-h-105";

                  return (
                    <div key={card.id} className={`${spanClass} ${orderClass} h-full ${maxHClass}`}>
                      {card.variant === "media" ? (
                        <MediaCardItem card={card} />
                      ) : (
                        <ContentCardItem card={card} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
