import React from "react";
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
  const ctaText = "Explore";
  const ctaUrl = card.cta?.url || "#";
  const hasHoverList = card.hoverList && card.hoverList.length > 0;

  return (
    <div className="bg-[#1B2F10] hover:bg-[#254419] rounded-xl p-[clamp(1rem,2vw,2.25rem)] flex flex-col justify-between min-h-[clamp(16.25rem,20vw,20rem)] lg:h-105.25 h-full w-full relative group overflow-hidden transition-all duration-300">
      <div className="flex flex-col justify-between flex-1 h-full w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-3">
        <div>
          <div className="w-[clamp(1.5rem,2vw,2.25rem)] h-[clamp(1.5rem,2vw,2.25rem)] relative mb-4 sm:mb-6 flex items-center">
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

          <h3 className="text-white font-medium text-[clamp(1rem,1.8vw,1.75rem)] tracking-[-0.01em] mb-2 sm:mb-3 font-delight! leading-tight">
            {card.title}
          </h3>

          <p className="text-[#95A897] font-satoshi text-[clamp(0.75rem,1vw,0.9375rem)] leading-relaxed line-clamp-4 sm:line-clamp-none">
            {card.description}
          </p>
        </div>

        <div className="pt-3 sm:pt-6 mt-auto">
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-white font-medium text-[clamp(0.75rem,1vw,0.9375rem)] hover:text-white/80 transition-colors"
          >
            <span>{ctaText}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {hasHoverList && (
        <div className="absolute inset-0 z-20 bg-[#243D1A] p-[clamp(0.75rem,2vw,2.25rem)] flex flex-col justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-500 ease-out pointer-events-none group-hover:pointer-events-auto rounded-xl overflow-y-auto no-scrollbar">
          <ul className="divide-y divide-white/15 w-full">
            {card.hoverList?.map((item, idx) => (
              <li
                key={item.id}
                style={{
                  ["--enter-delay" as string]: `${idx * 45}ms`,
                }}
                className="flex items-start gap-2 sm:gap-3 2xl:gap-3.5 py-2 sm:py-2.5 2xl:py-3.5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] delay-0 group-hover:[transition-delay:var(--enter-delay)]"
              >
                <svg
                  viewBox="0 0 10 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-1.5 h-3 sm:w-2.25 sm:h-4 2xl:w-2.5 2xl:h-4.5 text-white/80 shrink-0 mt-0.5 sm:mt-1"
                >
                  <path d="M1.5 1.5L8.5 9L1.5 16.5" />
                </svg>
                <span className="text-white font-satoshi text-[clamp(0.6875rem,1vw,0.96875rem)] leading-[1.35] sm:leading-snug">
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

function MediaCardItem({ card }: { card: ProcessCard }) {
  const isVideo =
    card.media?.mime?.includes("video") ||
    card.media?.url?.endsWith(".mp4") ||
    card.media?.url?.endsWith(".webm");

  if (isVideo && card.media?.url) {
    return (
      <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-[16/9] lg:aspect-auto lg:h-105.25 flex items-center justify-center">
        <video
          src={getStrapiMediaUrl(card.media.url)}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (card.media?.url) {
    return (
      <div className="bg-white rounded-xl overflow-hidden relative w-full aspect-[16/9] lg:aspect-auto lg:h-105.25 flex items-center justify-center p-3 sm:p-4">
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
    <div className="bg-[#1B2F10] rounded-xl w-full aspect-[16/9] lg:aspect-auto lg:h-105.25" />
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
    <section className="bg-[#0F1D07] pt-[clamp(5rem,7.5vw,10rem)] pb-[clamp(5.5rem,8.5vw,11.5rem)] px-[clamp(1.25rem,4.2vw,5.6875rem)] text-white">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8 lg:gap-12">
          <div className="flex flex-col gap-3 sm:gap-5 lg:gap-8">
            <p className="text-white/60 text-[clamp(0.8125rem,4.2vw,0.9375rem)] font-satoshi font-normal tracking-wide">
              {eyebrow}
            </p>
            <h2 className="font-delight! text-[clamp(1.75rem,3.8vw,3.2rem)] font-medium text-white leading-[1.08] tracking-[-0.02em] max-w-170">
              {title}
            </h2>
            <p className="text-white text-[clamp(0.8125rem,4.2vw,1.125rem)] font-satoshi font-normal leading-[1.5] max-w-[95%] lg:max-w-[90%]">
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
              className="px-[clamp(1rem,2vw,1.75rem)] py-[clamp(0.5rem,1vw,0.875rem)] text-[clamp(0.8125rem,1vw,0.9375rem)] font-medium"
              text={ctaText}
              url={ctaUrl}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[clamp(1rem,2vw,2rem)] mt-[clamp(2.5rem,4.2vw,5rem)]">
          {rows.map((row, rowIndex) => {
            const template = getRowGridTemplate(row);

            return (
              <div
                key={rowIndex}
                className={`grid grid-cols-2 ${template} gap-[clamp(1rem,2vw,2rem)] items-stretch`}
              >
                {row.map((card) => {
                  const isWide = card.size === "wide" || card.variant === "media";
                  const spanClass = isWide ? "col-span-2 lg:col-span-1" : "col-span-1 lg:col-span-1";
                  const orderClass = isWide ? "order-first lg:order-none" : "";

                  return (
                    <div key={card.id} className={`${spanClass} ${orderClass} h-full`}>
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
