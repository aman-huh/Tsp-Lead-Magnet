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

  const renderTitle = (text: string) => {
    if (!text) return null;

    if (text.includes("\n")) {
      return text
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line, idx) => (
          <span key={idx} className="block">
            {line.trim()}
          </span>
        ));
    }

    if (text.includes("|")) {
      return text
        .split("|")
        .filter((part) => part.trim().length > 0)
        .map((part, idx) => (
          <span key={idx} className="block">
            {part.trim()}
          </span>
        ));
    }

    const match = text.match(/^(where\s+this)\s+(engagement\s+works,?)\s+(.*)$/i);
    if (match) {
      return (
        <>
          <span className="block whitespace-nowrap">{match[1]}</span>
          <span className="block whitespace-nowrap">{match[2]}</span>
          <span className="block whitespace-nowrap">{match[3]}</span>
        </>
      );
    }

    const words = text.trim().split(/\s+/);
    if (words.length <= 3) {
      return <span className="block whitespace-nowrap">{text}</span>;
    }

    const totalLength = text.trim().length;
    const targetLen = totalLength / 3;

    let bestI = 1;
    let bestJ = 2;
    let minDiff = Infinity;

    for (let i = 1; i <= words.length - 2; i++) {
      const len1 = words.slice(0, i).join(" ").length;
      for (let j = i + 1; j <= words.length - 1; j++) {
        const len2 = words.slice(i, j).join(" ").length;
        const len3 = words.slice(j).join(" ").length;
        const diff =
          Math.pow(len1 - targetLen, 2) +
          Math.pow(len2 - targetLen, 2) +
          Math.pow(len3 - targetLen, 2);

        if (diff < minDiff) {
          minDiff = diff;
          bestI = i;
          bestJ = j;
        }
      }
    }

    return (
      <>
        <span className="block whitespace-nowrap">{words.slice(0, bestI).join(" ")}</span>
        <span className="block whitespace-nowrap">{words.slice(bestI, bestJ).join(" ")}</span>
        <span className="block whitespace-nowrap">{words.slice(bestJ).join(" ")}</span>
      </>
    );
  };

  return (
    <section className="min-h-0 xl:min-h-screen flex flex-col justify-center pt-[clamp(4.5rem,7vw,9rem)] pb-[clamp(5rem,8vw,10rem)] px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] max-w-[1920px] mx-auto w-full">
      <div className="w-full flex flex-col xl:flex-row items-stretch justify-between gap-[clamp(2rem,3.5vw,4.5rem)]">
        <div className="w-full xl:w-[44%] 2xl:w-[42%] flex flex-col justify-center self-stretch">
          <h2 className="font-delight! text-[clamp(1.65rem,4.2vw,2.35rem)] xl:text-[clamp(2.125rem,3.2vw,4.85rem)] 2xl:text-[clamp(2.5rem,4.2vw,4.02rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#0F1D07]">
            {renderTitle(header?.mobileTitle || title)}
          </h2>
          {(description || header?.mobileDescription) && (
            <p className="font-satoshi font-medium text-[clamp(0.8125rem,4.2vw,1.13rem)] leading-[1.7] text-[#0F1D07] mt-[clamp(1.25rem,3vw,2rem)] max-w-2xl xl:w-[95%]">
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

        <div className="w-full xl:w-[56%] 2xl:w-[55%] flex flex-col sm:flex-row gap-[clamp(1.25rem,2.5vw,2rem)] items-stretch justify-end self-stretch">
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
      className={`w-full sm:basis-1/2 flex-1 self-stretch rounded-xl p-[clamp(1.25rem,2.4vw,1.2rem)] border border-[#C8C8C8] flex flex-col gap-6 ${
        isSuitable ? "bg-[#EFF0FC]" : "bg-white"
      }`}
    >
      <div>
        <h3 className="font-delight! text-[clamp(1.12rem,2.5vw,1.4rem)] font-medium leading-tight text-[#0F1D07]">
          {card.title}
        </h3>
      </div>

      <ul className="flex flex-1 flex-col justify-between gap-5">
        {validItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 sm:gap-3.5 lg:w-[95%]"
          >
            <Image
              src="/tick.svg"
              alt=""
              width={24}
              height={19}
              aria-hidden="true"
              className="w-[20px] sm:w-[24px] h-auto shrink-0"
            />
            <span className="font-satoshi font-normal text-[clamp(0.9375rem,1.2vw,1.0625rem)] leading-[1.4] text-[#000000]">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
