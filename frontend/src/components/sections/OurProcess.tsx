import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lightbulb,
  PaintRoller,
  Smartphone,
  Sparkles,
  ShoppingBag,
  Cpu,
} from "lucide-react";
import Button from "@/components/shared/Button";
import { OurProcessSection, ProcessCard, ProcessCardMobile } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface OurProcessProps {
  data?: OurProcessSection;
}

function DefaultLightbulbIcon() {
  return <Lightbulb className="w-7 h-7 text-white/90" strokeWidth={1.8} />;
}

function MobileCardIcon({ title }: { title?: string | null }) {
  const t = (title || "").toLowerCase();

  if (t.includes("ui") || t.includes("design")) {
    return <Lightbulb className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }
  if (t.includes("web") || t.includes("site")) {
    return <PaintRoller className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }
  if (t.includes("app") || t.includes("mobile")) {
    return <Smartphone className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }
  if (t.includes("ai") || t.includes("auto")) {
    return <Sparkles className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }
  if (t.includes("commerce") || t.includes("e-com")) {
    return <ShoppingBag className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }
  if (t.includes("iot") || t.includes("innov")) {
    return <Cpu className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
  }

  return <Lightbulb className="w-6 h-6 text-white/90" strokeWidth={1.8} />;
}

const DEFAULT_MOBILE_CARDS: ProcessCardMobile[] = [
  {
    id: 1,
    title: "UI/UX Design",
    description:
      "Human-centered UI/UX design blending creativity, usability, and aesthetics for memorable experiences.",
  },
  {
    id: 2,
    title: "Websites",
    description:
      "Fast, scalable, and beautiful websites crafted for performance, engagement, and lasting impact.",
  },
  {
    id: 3,
    title: "Mobile Apps",
    description:
      "Seamless Android and iOS apps delivering intuitive experiences and powerful business functionality.",
  },
  {
    id: 4,
    title: "AI & Automation",
    description:
      "Smart systems that streamline processes, enhance decisions, and unlock next-level efficiency.",
  },
  {
    id: 5,
    title: "E-Commerce",
    description:
      "Custom online stores and marketplaces engineered for growth, flexibility, and effortless user journeys.",
  },
  {
    id: 6,
    title: "IoT & Innovation",
    description:
      "Connected devices and embedded systems bringing digital intelligence into real-world products.",
  },
];

function ContentCardItem({ card }: { card: ProcessCard }) {
  const ctaText = card.cta?.text || `Explore ${card.title || "More"}`;
  const ctaUrl = card.cta?.url || "#";
  const hasHoverList = card.hoverList && card.hoverList.length > 0;

  return (
    <div className="bg-[#1B2F10] hover:bg-[#254419] rounded-xl p-6 sm:p-7 2xl:p-8 3xl:p-9 flex flex-col justify-between h-105.25 w-full relative group overflow-hidden transition-all duration-300">
      <div className="flex flex-col justify-between h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-3">
        <div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative mb-6 flex items-center">
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

          <h3 className="text-white font-medium text-[24px] 2xl:text-[28px] tracking-[-0.01em] mb-3 font-delight!">
            {card.title}
          </h3>

          <p className="text-[#95A897] font-satoshi text-[14px] 2xl:text-[15px] leading-relaxed">
            {card.description}
          </p>
        </div>

        <div className="pt-6">
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 text-white font-medium text-[14px] 2xl:text-[15px] hover:text-white/80 transition-colors"
          >
            <span>{ctaText}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {hasHoverList && (
        <div className="absolute inset-0 z-20 bg-[#243D1A] p-6 sm:p-7 2xl:p-8 3xl:p-9 flex flex-col justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-500 ease-out pointer-events-none group-hover:pointer-events-auto rounded-xl">
          <ul className="divide-y divide-white/15 w-full">
            {card.hoverList?.map((item, idx) => (
              <li
                key={item.id}
                style={{
                  ["--enter-delay" as string]: `${idx * 45}ms`,
                }}
                className="flex items-start gap-3.5 py-3.5 sm:py-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] delay-0 group-hover:[transition-delay:var(--enter-delay)]"
              >
                <svg
                  viewBox="0 0 10 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-2.25 h-4 sm:h-4.25 2xl:w-2.5 2xl:h-4.5 text-white/80 shrink-0"
                >
                  <path d="M1.5 1.5L8.5 9L1.5 16.5" />
                </svg>
                <span className="text-white font-satoshi text-[14px] sm:text-[15px] 2xl:text-[15.5px] leading-snug">
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
      <div className="bg-black rounded-xl overflow-hidden relative h-105.25 w-full flex items-center justify-center">
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
      <div className="bg-white rounded-xl overflow-hidden relative h-105.25 w-full flex items-center justify-center p-3 sm:p-4">
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
    <div className="bg-[#1B2F10] rounded-xl h-105.25 w-full" />
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
  const mobileEyebrow = data?.mobileEyebrow || "Services.";
  const title =
    data?.header?.title || "Every Capability Runs Through The Same System.";
  const mobileTitle =
    data?.header?.mobileTitle || "Lets Build Something Exceptional Together";
  const description =
    data?.header?.description ||
    "Whether we are building a Shopify store, a custom website, a CMS platform, or a mobile app ecosystem, the process stays connected.";
  const mobileDescription =
    data?.header?.mobileDescription ||
    "Powerful digital services designed to support your brand’s full journey.";
  const ctaText = data?.CTA?.text || "Explore Our Services";
  const ctaUrl = data?.CTA?.url || "#services";
  const cards = data?.desktopCards || data?.cards || [];
  const mobileCards =
    data?.mobileCards && data.mobileCards.length > 0
      ? data.mobileCards
      : DEFAULT_MOBILE_CARDS;
  const rows = chunkCardsIntoRows(cards);

  const primaryMobileCta = {
    text: data?.desktopCta?.[0]?.text || "Get My Instant Quote",
    url: data?.desktopCta?.[0]?.url || "#quote",
  };
  const secondaryMobileCta = {
    text: data?.desktopCta?.[1]?.text || "Book a Free Call",
    url: data?.desktopCta?.[1]?.url || "#book-call",
  };

  return (
    <section className="bg-[#0F1D07] py-12 sm:py-16 lg:py-28 2xl:py-36 3xl:py-40 px-6 sm:px-12 2xl:px-36 3xl:px-40 text-white">
      <div className="max-w-[1920px] mx-auto w-full">
        {/* Desktop Header */}
        <div className="hidden lg:flex lg:items-center justify-between gap-8 lg:gap-12">
          <div className="flex flex-col gap-8">
            <p className="text-white/60 text-[14px] 2xl:text-[15px] font-satoshi font-normal tracking-wide">
              {eyebrow}
            </p>
            <h2 className="font-delight! text-[34px] sm:text-[42px] 2xl:text-[50px] 3xl:text-[64px] font-medium text-white leading-[1.08] tracking-[-0.02em] max-w-167.5">
              {title}
            </h2>
            <p className="text-white text-[15px] 2xl:text-[16px] 3xl:text-[17px] font-satoshi font-normal leading-relaxed max-w-[90%]">
              {description}
            </p>
          </div>

          <div className="shrink-0 self-start lg:self-center">
            <Button
              theme="dark"
              shape="rounded"
              variant="solid"
              showArrow={false}
              text={ctaText}
              url={ctaUrl}
            />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden flex-col">
          <p className="text-[#8E9F8D] text-[14px] sm:text-[15px] font-satoshi font-normal tracking-normal mb-2.5">
            {mobileEyebrow}
          </p>
          <h2 className="font-delight! text-[32px] sm:text-[36px] font-medium text-white leading-[1.12] tracking-[-0.02em] max-w-xs">
            {mobileTitle}
          </h2>
          <p className="text-[#A8B7A7] text-[14px] sm:text-[15px] font-satoshi font-normal leading-[1.55] mt-3.5 max-w-[95%]">
            {mobileDescription}
          </p>
        </div>

        {/* Mobile View: 2 cards visible side-by-side with smooth horizontal scroll */}
        <div
          data-lenis-prevent
          className="flex lg:hidden overflow-x-auto gap-3 sm:gap-4 no-scrollbar -mx-6 sm:-mx-12 px-6 sm:px-12 mt-8 pb-1 scroll-smooth snap-x snap-mandatory"
        >
          {mobileCards.map((card) => (
            <div
              key={card.id}
              className="w-[calc((100vw-60px)/2)] sm:w-[240px] shrink-0 rounded-[14px] bg-[#243320] p-4 sm:p-5 flex flex-col justify-start min-h-[270px] select-none snap-start"
            >
              <div className="h-6 w-6 mb-5 flex items-center justify-start text-white/90">
                {card.icon?.url ? (
                  <Image
                    src={getStrapiMediaUrl(card.icon.url)}
                    alt={card.title || "Capability icon"}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <MobileCardIcon title={card.title} />
                )}
              </div>
              <h3 className="font-delight text-[17px] sm:text-[18px] font-medium leading-tight text-white mb-2.5">
                {card.title}
              </h3>
              <p className="font-satoshi text-[13px] sm:text-[13.5px] font-normal leading-[1.5] text-[#9EAFA0] flex-1">
                {card.description}
              </p>
            </div>
          ))}
          <div className="w-1 shrink-0" aria-hidden="true" />
        </div>

        {/* Mobile CTA Buttons */}
        <div className="flex lg:hidden flex-col gap-3 w-full mt-8">
          <Link
            href={primaryMobileCta.url}
            className="w-full h-[50px] sm:h-[52px] rounded-full bg-[#F3F4F6] active:bg-white text-[#0F1D07] font-satoshi font-medium text-[15px] sm:text-[16px] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <span>{primaryMobileCta.text}</span>
            <span className="text-[17px] leading-none">→</span>
          </Link>
          <Link
            href={secondaryMobileCta.url}
            className="w-full h-[50px] sm:h-[52px] rounded-full bg-transparent active:bg-white/5 border border-white/20 text-white font-satoshi font-medium text-[15px] sm:text-[16px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{secondaryMobileCta.text}</span>
            <span className="text-[17px] leading-none">→</span>
          </Link>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="hidden lg:flex flex-col gap-6 2xl:gap-8 mt-14 sm:mt-16 2xl:mt-20">
          {rows.map((row, rowIndex) => {
            const template = getRowGridTemplate(row);

            return (
              <div
                key={rowIndex}
                className={`grid grid-cols-1 md:grid-cols-2 ${template} gap-6 2xl:gap-8 items-stretch`}
              >
                {row.map((card) => {
                  const isWide = card.size === "wide" || card.variant === "media";
                  const mdSpan = isWide ? "md:col-span-2 lg:col-span-1" : "md:col-span-1 lg:col-span-1";

                  return (
                    <div key={card.id} className={`${mdSpan} h-full`}>
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
