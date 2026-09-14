import ProblemSelector from "@/components/sections/ProblemSelector";
import { ProblemAssessmentSection } from "@/types";

interface ProblemAssessmentProps {
  data?: ProblemAssessmentSection;
}

export default function ProblemAssessment({ data }: ProblemAssessmentProps) {
  const header = data?.header;
  const title =
    header?.title || "Where is the storefront costing you margin?";
  const description =
    header?.description ||
    "Select what applies. Most brands recognise three or four — and rarely the one they contacted us about.";

  return (
    <section className="mt-[clamp(3.5rem,4.2vw,8.5rem)] pb-[clamp(4rem,6vw,8rem)] px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] max-w-[1920px] mx-auto">
      <div className="w-full flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)] mb-[clamp(1.75rem,4.2vw,3.25rem)]">
        <h2 className="font-delight! text-[clamp(2.125rem,4.2vw,5rem)] font-medium leading-[1.12] tracking-[-0.01em]">
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
          <p className="font-satoshi text-[clamp(0.8125rem,4.2vw,1.125rem)] font-medium leading-[1.5] tracking-normal w-auto max-w-xl 2xl:max-w-2xl">
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

      <ProblemSelector
        cards={data?.problemCards}
        summaryText={data?.summaryText}
        submitButton={data?.submitButton}
      />
    </section>
  );
}
