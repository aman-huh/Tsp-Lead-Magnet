import React from "react";
import Image from "next/image";
import { StrapiMedia } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface ClientShowcaseProps {
  heading?: string;
  logos?: StrapiMedia[];
  className?: string;
}

export default function ClientShowcase({
  heading = "Designed Shopify experiences for India’s most loved brands.",
  logos = [],
  className = "",
}: ClientShowcaseProps) {
  const displayLogos = logos && logos.length > 0 ? logos : [];

  if (displayLogos.length === 0) {
    return null;
  }

  const repeatCount = Math.max(2, Math.ceil(10 / displayLogos.length));
  const marqueeLogos = Array.from({ length: repeatCount }).flatMap(() => displayLogos);

  return (
    <div className={`space-y-4 sm:space-y-5 mb-5 ${className}`}>
      {heading && (
        <p className="font-satoshi text-white font-light text-[clamp(0.6rem,3.3vw,1.375rem)] leading-snug tracking-[-0.01em] text-center lg:text-left">
          {heading}
        </p>
      )}

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[clamp(1.5rem,4.2vw,4.5rem)] z-10 bg-linear-to-r from-[#37386B] to-[#37386B]/0" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[clamp(1.5rem,4.2vw,4.5rem)] z-10 bg-linear-to-l from-[#37386B] to-[#37386B]/0" />

        <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused] py-1">
          <div className="flex items-center gap-[clamp(1.5rem,4.2vw,3.5rem)] shrink-0 pr-[clamp(1.5rem,4.2vw,3.5rem)]">
            {marqueeLogos.map((logo, idx) => (
              <div
                key={`track1-${logo.id || idx}-${idx}`}
                className="relative shrink-0 h-6 sm:h-7 2xl:h-8 opacity-90 hover:opacity-100 transition-opacity"
              >
                <Image
                  src={getStrapiMediaUrl(logo.url)}
                  alt={logo.alternativeText || logo.name || "Brand logo"}
                  width={logo.width || 140}
                  height={logo.height || 36}
                  unoptimized
                  className="h-full w-auto max-h-8 2xl:max-h-9 object-contain brightness-0 invert"
                />
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-[clamp(1.5rem,4.2vw,3.5rem)] shrink-0 pr-[clamp(1.5rem,4.2vw,3.5rem)]"
            aria-hidden="true"
          >
            {marqueeLogos.map((logo, idx) => (
              <div
                key={`track2-${logo.id || idx}-${idx}`}
                className="relative shrink-0 h-6 sm:h-7 2xl:h-8 opacity-90 hover:opacity-100 transition-opacity"
              >
                <Image
                  src={getStrapiMediaUrl(logo.url)}
                  alt={logo.alternativeText || logo.name || "Brand logo"}
                  width={logo.width || 140}
                  height={logo.height || 36}
                  unoptimized
                  className="h-full w-auto max-h-8 2xl:max-h-9 object-contain brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
