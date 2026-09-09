import type { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

const nohemi = localFont({
  src: [
    {
      path: "../../public/fonts/nohemi-font-family/Nohemi-Regular-BF6a4e01a26b011.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/nohemi-font-family/Nohemi-Medium-BF6a4e01a26b011.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-heading",
});

const delight = localFont({
  src: "../../public/fonts/delight-font-family/delight-vf.ttf",
  variable: "--font-delight",
});

const satoshi = localFont({
  src: "../../public/fonts/satoshi/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
});

export const metadata: Metadata = {
  title: "Thumbstack - Lead Magnet",
  description: "Lead Magnet Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nohemi.variable} ${delight.variable} ${satoshi.variable} h-full antialiased overflow-x-hidden max-w-full`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
