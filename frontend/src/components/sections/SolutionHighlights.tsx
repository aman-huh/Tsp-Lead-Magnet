import Image from "next/image";
import { SolutionHighlightsSection, Feature } from "@/types";
import { getStrapiMediaUrl } from "@/lib/fetcher";

interface SolutionHighlightsProps {
  data?: SolutionHighlightsSection;
}

const variantStyles: Record<
  string,
  { container: string; title: string; desc: string }
> = {
  navy: {
    container: "bg-[#014051]",
    title: "text-white",
    desc: "text-white/80",
  },
  lavender: {
    container: "bg-[#B7C0FF]",
    title: "text-[#0F1D07]",
    desc: "text-[#0F1D07]/80",
  },
  sage: {
    container: "bg-[#D1E6D1]",
    title: "text-[#0F1D07]",
    desc: "text-[#0F1D07]/80",
  },
};

export default function SolutionHighlights({ data }: SolutionHighlightsProps) {
  const header = data?.header;
  const title =
    header?.title || "Discounting is not a conversion strategy.";
  const description =
    header?.description ||
    "The trading calendar has taught shoppers here to wait. When a storefront doesn't make the case for a product at full price, the promotion has to — and margin pays for it. We redesign Shopify stores so the buying argument sits on the page, not in the discount code.";

  return (
    <section id="solutions" className="mb-[clamp(4.5rem,7vw,9rem)] px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] max-w-[1920px] mx-auto scroll-mt-20">
      <div className="w-full max-w-full flex flex-col lg:table lg:w-fit mb-[clamp(1.75rem,4.2vw,3.25rem)]">
        <h2 className="font-delight! text-[clamp(1.75rem,5.5vw,2.75rem)] lg:text-[clamp(2.125rem,4.2vw,5rem)] font-medium leading-tight lg:leading-[1.12] tracking-[-0.01em] w-full lg:w-fit">
          {header?.mobileTitle ? (
            <>
              <span className="block lg:hidden">{header.mobileTitle}</span>
              <span className="hidden lg:block">{title}</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-[1.5] tracking-normal pt-[clamp(0.75rem,4.2vw,1.25rem)] w-full max-w-xl lg:max-w-none lg:w-auto lg:table-caption lg:caption-bottom">
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
      <div className="mt-[clamp(2rem,4.2vw,4.5rem)] grid grid-cols-1 lg:grid-cols-3 gap-[clamp(1.5rem,3vw,3.5rem)] w-full">
        {data?.features?.map((feature) => (
          <SolutionHighlightCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function SolutionHighlightCard({ feature }: { feature?: Feature }) {
  const variant =
    (feature?.backgroundColor && variantStyles[feature.backgroundColor]) ||
    variantStyles.lavender;

  const illustrationUrl = feature?.illustration?.url
    ? getStrapiMediaUrl(feature.illustration.url)
    : null;

  return (
    <div
      className={`w-full rounded-[16px] md:rounded-[clamp(20px,4.2vw,30px)] p-6 sm:p-8 lg:p-[clamp(1.75rem,3vw,2.5rem)] flex flex-col justify-between  h-full ${variant.container}`}
    >
      <div className="w-full h-[clamp(110px,13vw,180px)] relative shrink-0">
        {illustrationUrl && (
          <Image
            src={illustrationUrl}
            alt={
              feature?.illustration?.alternativeText ||
              feature?.title ||
              "Feature illustration"
            }
            fill
            unoptimized
            className="object-contain object-left"
          />
        )}
      </div>

      <div className="w-full flex-1 flex flex-col gap-y-2.5 sm:gap-y-3 pt-5 sm:pt-6">
        <h3
          className={`font-heading font-normal text-[20px] sm:text-[22px] lg:text-[clamp(1.125rem,2vw,1.75rem)] leading-snug tracking-normal ${variant.title}`}
        >
          {feature?.title}
        </h3>
        <p
          className={`font-satoshi text-[15px] sm:text-[16px] lg:text-[clamp(0.875rem,1.1vw,1rem)] leading-[1.5] tracking-normal ${variant.desc}`}
        >
          {feature?.description}
        </p>
      </div>
    </div>
  );
}