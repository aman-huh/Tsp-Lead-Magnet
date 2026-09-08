import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 2xl:gap-2.5 3xl:gap-3 px-2.5 py-0.5 sm:px-3 sm:py-1 2xl:px-4 2xl:py-1.5 3xl:px-5 3xl:py-2 rounded-[10px] sm:rounded-xl 2xl:rounded-[14px] 3xl:rounded-2xl border-2 border-[#95E7D3] bg-[#95E7D3]/40 text-[#0F1D07] text-[13px] sm:text-[15px] 2xl:text-[17px] 3xl:text-[18px] font-satoshi font-semibold tracking-normal select-none ${className}`}
    >
      {children}
    </div>
  );
}
