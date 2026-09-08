import ProblemSelector from "@/components/sections/ProblemSelector";
import { ProblemAssessmentSection } from "@/types";

interface ProblemAssessmentProps {
  data?: ProblemAssessmentSection;
}

export default function ProblemAssessment({ data }: ProblemAssessmentProps) {
  const title =
    data?.header?.title || "Where is the storefront costing you margin?";
  const description =
    data?.header?.description ||
    "Select what applies. Most brands recognise three or four — and rarely the one they contacted us about.";

  return (
    <section className="mt-[clamp(3.5rem,4.2vw,8.5rem)] px-[clamp(1.25rem,4.2vw,5.6875rem)] max-w-[1920px] mx-auto">
      <div className="w-full flex flex-col gap-y-[clamp(0.75rem,4.2vw,1.25rem)] mb-[clamp(1.75rem,4.2vw,3.25rem)]">
        <h1 className="font-delight! text-[clamp(2.125rem,4.2vw,5rem)] font-medium leading-[1.12] tracking-[-0.01em]">
          {title}
        </h1>
        <p className="font-satoshi text-[clamp(0.9375rem,4.2vw,1.25rem)] font-medium leading-[1.6] tracking-normal w-auto max-w-xl 2xl:max-w-2xl">
          {description}
        </p>
      </div>

      <ProblemSelector
        cards={data?.problemCards}
        summaryText={data?.summaryText}
        submitButton={data?.submitButton}
      />
    </section>
  );
}
