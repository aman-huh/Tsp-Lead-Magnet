import Image from "next/image";
import { BrandFitSection, BrandCard } from "@/types";

interface BrandFitProps {
  data?: BrandFitSection;
}

export default function BrandFit({ data }: BrandFitProps) {
  const header = data?.header;
  const title =
    header?.title ||
    "Where this engagement works, and where it does not.";
  const description =
    header?.description ||
    "The trading calendar has taught shoppers here to wait. When a storefront doesn't make the case for a product at full price, the promotion has to — and margin pays for it. We redesign Shopify stores so the buying argument sits on the page, not in the discount code.";

  const suitableCard = data?.suitableCard;
  const unsuitableCard = data?.unsuitableCard;

  return (
    <section className="min-h-0 xl:min-h-screen flex flex-col justify-center pt-[clamp(4.5rem,7vw,9rem)] pb-[clamp(5rem,8vw,10rem)] px-[clamp(1.25rem,4.2vw,5.59375rem)] max-w-[1920px] mx-auto w-full">
      <div className="w-full flex flex-col xl:flex-row items-stretch justify-between gap-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="w-full xl:w-[38%] 2xl:w-[42%] flex flex-col justify-center self-stretch">
          <h2 className="font-delight! text-[clamp(1.875rem,4.2vw,4.375rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F1D07]">
            {header?.mobileTitle ? (
              <>
                <span className="block lg:hidden">{header.mobileTitle}</span>
                <span className="hidden lg:block">{title}</span>
              </>
            ) : (
              title
            )}
          </h2>
          {(description || header?.mobileDescription) && (
            <p className="font-satoshi font-normal text-[clamp(0.8125rem,4.2vw,1.125rem)] leading-[1.5] text-[#0F1D07] mt-[clamp(1.25rem,3vw,2rem)] max-w-2xl xl:max-w-none">
              {header?.mobileDescription ? (
                <>
                  <span className="block lg:hidden">{header.mobileDescription}</span>
                  <span className="hidden lg:block">{description}</span>
                </>
              ) : (
                description
              )}
            </p>
          )}
        </div>

        <div className="w-full xl:w-[62%] 2xl:w-[58%] flex flex-col sm:flex-row gap-[clamp(1.25rem,3vw,2rem)] items-stretch justify-end self-stretch">
          {suitableCard && (
            <BrandCardItem card={suitableCard} isSuitable={true} />
          )}
          {unsuitableCard && (
            <BrandCardItem card={unsuitableCard} isSuitable={false} />
          )}
        </div>
      </div>
    </section>
  );
}

function BrandCardItem({
  card,
  isSuitable,
}: {
  card: BrandCard;
  isSuitable: boolean;
}) {
  const validItems =
    card.items?.filter((item) => Boolean(item.text?.trim())) ?? [];

  return (
    <div
      className={`w-full sm:basis-1/2 flex-1 self-stretch rounded-xl p-[clamp(1.5rem,4vw,2.25rem)] border border-[#C8C8C8] flex flex-col gap-[clamp(1.75rem,4vw,2.5rem)] ${
        isSuitable ? "bg-[#EFF0FC]" : "bg-white"
      }`}
    >
      <div>
        <h3 className="font-delight! text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium leading-tight text-[#0F1D07]">
          {card.title}
        </h3>
      </div>

      <ul className="flex flex-1 flex-col justify-between gap-[clamp(1.25rem,2.5vw,1.75rem)]">
        {validItems.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 sm:gap-3.5"
          >
            <Image
              src="/tick.svg"
              alt=""
              width={22}
              height={17}
              aria-hidden="true"
              className="w-5 h-auto shrink-0 mt-0.5"
            />
            <span className="font-satoshi font-normal text-[clamp(0.9375rem,1.2vw,1.0625rem)] leading-[1.55] text-[#000000] flex-1">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
