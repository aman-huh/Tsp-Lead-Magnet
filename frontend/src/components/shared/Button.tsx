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
  arrowClassName?: string;
  noHover?: boolean;
  className?: string;
  containerClassName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function DiagonalArrow({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-[0.8em] h-[0.8em]",
    md: "w-[0.85em] h-[0.85em]",
    lg: "w-[0.9em] h-[0.9em]",
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
    sm: "w-[0.7em] h-auto",
    md: "w-[0.85em] h-auto",
    lg: "w-[1em] h-auto",
  };
  return (
    <svg
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} transition-transform duration-300 group-hover:translate-x-1 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M10.5121 1.24802L11.7841 2.13299e-05L19.7041 7.89602L11.7841 15.792L10.5121 14.52L16.2241 8.78402H5.88468e-05V7.00802L16.2241 6.98402L10.5121 1.24802Z"
        fill="currentColor"
      />
    </svg>
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
  arrowClassName = "",
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
  const shapeClass = customRadius || (shape === "rounded" ? "rounded-xl sm:rounded-[14px]" : "rounded-full");

  const offsetColorClass =
    theme === "light" ? "bg-[#3145DD]" : "bg-[#95E7D3]";

  const hasCustomText = /(^|\s)text-/.test(className);
  const hasCustomPadding = /(^|\s)(p-|px-|py-)/.test(className);
  const hasCustomGap = /(^|\s)gap-/.test(className);

  const pillPaddings = {
    sm: "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.25rem,0.7vw,0.4rem)]",
    md: "px-[clamp(1rem,1.8vw,1.25rem)] py-[clamp(0.375rem,0.9vw,0.55rem)]",
    lg: "px-[clamp(1.25rem,2vw,1.65rem)] py-[clamp(0.5rem,1.2vw,0.8rem)]",
  };

  const roundedPaddings = {
    sm: "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.25rem,0.7vw,0.4rem)]",
    md: "px-[clamp(1rem,1.8vw,1.25rem)] py-[clamp(0.375rem,0.9vw,0.55rem)]",
    lg: "px-[clamp(1.25rem,2vw,1.5rem)] py-[clamp(0.5rem,1.2vw,0.7rem)]",
  };

  const sizePaddings = shape === "rounded" ? roundedPaddings : pillPaddings;

  const sizeTextSizes = {
    sm: "text-[clamp(0.75rem,0.8vw,0.8125rem)]",
    md: "text-[clamp(0.8125rem,1vw,0.95rem)]",
    lg: "text-[clamp(0.9375rem,1.2vw,1.3rem)]",
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
        "bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#0F1D07] border border-[#C8C8C8] shadow-xs font-medium";
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
        "bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#0F1D07] border border-[#F2F2F2] shadow-xs font-medium";
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
      <DiagonalArrow size={size} className={arrowClassName} />
    ) : (
      <RightArrow size={size} className={arrowClassName} />
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
