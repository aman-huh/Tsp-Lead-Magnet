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
  const title =
    data?.header?.title || "Discounting is not a conversion strategy.";
  const description =
    data?.header?.description ||
    "The trading calendar has taught shoppers here to wait. When a storefront doesn't make the case for a product at full price, the promotion has to — and margin pays for it. We redesign Shopify stores so the buying argument sits on the page, not in the discount code.";

  return (
    <section className="mt-[clamp(2.75rem,4.2vw,5rem)] mb-[clamp(2.5rem,4.2vw,5.5rem)] px-[clamp(1.25rem,4.2vw,5.6875rem)] max-w-[1920px] mx-auto">
      <div className="flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)] mb-[clamp(1.75rem,4.2vw,3.25rem)] w-full max-w-full">
        <h1 className="font-delight! text-[clamp(2.125rem,4.2vw,5rem)] font-medium leading-[1.12] tracking-[-0.01em] w-full">
          {title}
        </h1>
        <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-normal leading-[1.5] tracking-normal w-auto max-w-xl 2xl:max-w-2xl">
          {description}
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
      className={`w-full min-h-[clamp(20rem,30vw,30rem)] rounded-[clamp(16px,4.2vw,30px)] p-[clamp(1.25rem,3vw,2.5rem)] flex flex-col justify-between gap-4 overflow-hidden ${variant.container}`}
    >
      <div className="w-full h-[clamp(9.5rem,28vw,14rem)] relative flex items-center justify-start shrink-0">
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

      <div className="flex flex-col gap-y-2.5">
        <h3
          className={`font-heading font-normal text-[clamp(1.125rem,2vw,1.75rem)] leading-snug tracking-normal ${variant.title}`}
        >
          {feature?.title}
        </h3>
        <p
          className={`font-satoshi font-normal text-[clamp(0.75rem,1vw,0.875rem)] leading-[1.5] tracking-normal ${variant.desc}`}
        >
          {feature?.description}
        </p>
      </div>
    </div>
  );
}