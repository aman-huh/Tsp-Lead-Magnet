import React from "react";
import Link from "next/link";

export interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  url?: string | null;
  onClick?: () => void;
  theme?: "dark" | "light";
  shape?: "pill" | "rounded";
  variant?: "solid" | "outline" | "primary" | "secondary" | "action";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  arrowType?: "diagonal" | "right";
  noHover?: boolean;
  className?: string;
  containerClassName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function DiagonalArrow({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem]",
  };
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M5 15L15 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 5H15V13.125"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RightArrow({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base sm:text-[17px]",
  };
  return (
    <span
      className={`transition-transform duration-300 group-hover:translate-x-1 shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      →
    </span>
  );
}

export default function Button({
  text,
  children,
  url,
  onClick,
  theme = "dark",
  shape = "pill",
  variant = "solid",
  size = "md",
  showArrow = true,
  arrowType = "diagonal",
  noHover = false,
  className = "",
  containerClassName = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const normalizedVariant =
    variant === "primary"
      ? "solid"
      : variant === "secondary"
      ? "outline"
      : variant;

  const customRadiusMatch = className.match(/(^|\s)(rounded(?:-[a-z0-9\[\]]+)?)/);
  const customRadius = customRadiusMatch ? customRadiusMatch[2] : null;
  const shapeClass = customRadius || (shape === "rounded" ? "rounded-[12px] sm:rounded-[14px]" : "rounded-full");

  const offsetColorClass =
    theme === "light" ? "bg-[#3145DD]" : "bg-[#95E7D3]";

  const hasCustomText = /(^|\s)text-/.test(className);
  const hasCustomPadding = /(^|\s)(p-|px-|py-)/.test(className);
  const hasCustomGap = /(^|\s)gap-/.test(className);

  const pillPaddings = {
    sm: "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.25rem,0.7vw,0.4rem)]",
    md: "px-[clamp(1rem,1.8vw,1.25rem)] py-[clamp(0.375rem,0.9vw,0.55rem)]",
    lg: "px-[clamp(1.25rem,2vw,1.5rem)] py-[clamp(0.5rem,1.2vw,0.7rem)]",
  };

  const roundedPaddings = {
    sm: "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.25rem,0.7vw,0.4rem)]",
    md: "px-[clamp(1rem,1.8vw,1.25rem)] py-[clamp(0.375rem,0.9vw,0.55rem)]",
    lg: "px-[clamp(1.25rem,2vw,1.5rem)] py-[clamp(0.5rem,1.2vw,0.7rem)]",
  };

  const sizePaddings = shape === "rounded" ? roundedPaddings : pillPaddings;

  const sizeTextSizes = {
    sm: "text-[clamp(0.75rem,0.8vw,0.8125rem)]",
    md: "text-[clamp(0.8125rem,1vw,0.875rem)]",
    lg: "text-[clamp(0.9375rem,1.2vw,1.0625rem)]",
  };

  const sizeGaps = {
    sm: "gap-1.5",
    md: "gap-[clamp(0.375rem,0.8vw,0.5rem)]",
    lg: "gap-[clamp(0.5rem,1vw,0.625rem)]",
  };

  const appliedPadding = hasCustomPadding ? "" : sizePaddings[size];
  const appliedTextSize = hasCustomText ? "" : sizeTextSizes[size];
  const appliedGap = hasCustomGap ? "" : sizeGaps[size];

  let surfaceVariantClass = "";
  if (normalizedVariant === "action") {
    surfaceVariantClass =
      "bg-[#3145DD] hover:bg-[#2C3CD4] text-white border border-[#3145DD] shadow-md font-medium";
  } else if (theme === "light") {
    if (normalizedVariant === "outline") {
      surfaceVariantClass =
        "bg-white hover:bg-neutral-50 text-[#0F1D07] border border-[#C8C8C8] shadow-xs font-medium";
    } else {
      surfaceVariantClass =
        "bg-[#0F1D07] hover:bg-black text-white border border-[#0F1D07] shadow-xs font-medium";
    }
  } else {
    if (normalizedVariant === "outline") {
      surfaceVariantClass =
        "bg-[#0F1D07]/60 hover:bg-[#0F1D07] text-white border border-white/30 hover:border-white shadow-xs font-medium";
    } else {
      surfaceVariantClass =
        "bg-white hover:bg-neutral-50 text-[#0F1D07] border border-white shadow-xs font-medium";
    }
  }

  const hoverElevationClasses = noHover
    ? ""
    : "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:group-hover:-translate-x-1 sm:group-hover:-translate-y-1 active:translate-x-0 active:translate-y-0";

  const surfaceClasses = `relative z-10 inline-flex items-center justify-center font-satoshi cursor-pointer transition-transform duration-300 translate-x-0 translate-y-0 ${hoverElevationClasses} disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${shapeClass} ${appliedPadding} ${appliedTextSize} ${appliedGap} ${surfaceVariantClass} ${className}`;

  const backingClasses = noHover
    ? "hidden"
    : `absolute inset-0 z-0 ${shapeClass} ${offsetColorClass} opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 pointer-events-none`;

  const arrow =
    showArrow &&
    (arrowType === "diagonal" ? (
      <DiagonalArrow size={size} />
    ) : (
      <RightArrow size={size} />
    ));

  const content = (
    <>
      <span className="truncate">{text || children}</span>
      {arrow}
    </>
  );

  const isFullWidth = className.includes("w-full");
  const returnsToAutoWidthMatch = className.match(/(^|\s)(sm|md|lg):w-auto(\s|$)/);
  const containerWidthClass = isFullWidth
    ? returnsToAutoWidthMatch
      ? `w-full ${returnsToAutoWidthMatch[2]}:w-auto`
      : "w-full"
    : "";

  return (
    <div className={`relative group inline-flex shrink-0 ${containerWidthClass} ${containerClassName}`.trim()}>
      {!noHover && (
        <div
          className={backingClasses}
          style={{ transform: "translate(3px, 3px)" }}
          aria-hidden="true"
        />
      )}
      {url ? (
        <Link href={url} className={surfaceClasses}>
          {content}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={surfaceClasses}
        >
          {content}
        </button>
      )}
    </div>
  );
}
