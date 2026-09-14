"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/shared/SocialIcons";
import { FooterSection, FooterLink, FooterContact } from "@/types";

interface FooterProps {
  data?: FooterSection;
  ref?: React.Ref<HTMLElement>;
}


function resolveLink(
  url?: string | null,
  text?: string | null
): {
  href: string;
  isAnchor: boolean;
  isExternal: boolean;
} {
  const label = (text || "").toLowerCase().trim();
  const trimmed = (url || "").trim();

  if (trimmed.includes("#")) {
    const id = trimmed.split("#")[1].split("?")[0].replace(/\/$/, "");
    return { href: `#${id}`, isAnchor: true, isExternal: false };
  }

  const clean = trimmed.replace(/^\//, "").toLowerCase();

  if (clean === "our-work" || clean === "work" || label.includes("work")) {
    return { href: "#our-work", isAnchor: true, isExternal: false };
  }

  if (
    clean === "solutions" ||
    clean === "capabilities" ||
    clean === "service" ||
    clean === "services" ||
    label.includes("solution") ||
    label.includes("service") ||
    label.includes("capabilit")
  ) {
    return { href: "#solutions", isAnchor: true, isExternal: false };
  }

  if (
    clean === "case-studies" ||
    clean === "case-study" ||
    clean === "news-and-insights" ||
    clean === "news" ||
    clean === "insights" ||
    label.includes("case") ||
    label.includes("insight") ||
    label.includes("news")
  ) {
    return { href: "#case-studies", isAnchor: true, isExternal: false };
  }

  if (clean === "process" || clean === "our-process" || label.includes("process")) {
    return { href: "#process", isAnchor: true, isExternal: false };
  }

  if (clean === "faq" || label.includes("faq")) {
    return { href: "#faq", isAnchor: true, isExternal: false };
  }

  if (clean === "contact" || label.includes("contact")) {
    return { href: "#contact", isAnchor: true, isExternal: false };
  }

  if (trimmed.startsWith("/")) {
    return { href: trimmed, isAnchor: false, isExternal: false };
  }

  return { href: trimmed || "#", isAnchor: false, isExternal: trimmed.startsWith("http") };
}

export default function Footer({ data }: FooterProps) {
  const headingRaw = data?.intro?.heading || "Say hi! {{Logo}}";
  const hasLogoPlaceholder = headingRaw.includes("{{Logo}}");
  const headingParts = hasLogoPlaceholder ? headingRaw.split("{{Logo}}") : [];

  const description =
    data?.intro?.description || "Let's make something amazing together.";
  const subDescription =
    data?.intro?.subDescription ||
    "Come chat with us — we've got coffee (or tea) ready and are always up for a good conversation.";

  const defaultSocialLinks: FooterLink[] = [
    {
      id: 1,
      platform: "instagram",
      URL: "https://www.instagram.com/thumbstack_tech/",
    },
    {
      id: 2,
      platform: "youtube",
      URL: "https://www.youtube.com/@TheHumanAIPodcast",
    },
    {
      id: 3,
      platform: "facebook",
      URL: "https://www.facebook.com/ThumbstackTechnologies/",
    },
    {
      id: 4,
      platform: "linkedin",
      URL: "https://www.linkedin.com/company/thumbstackstudios/",
    },
  ];

  const defaultQuickLinks: FooterLink[] = [
    { id: 1, text: "Our Work", URL: "#our-work" },
    { id: 2, text: "Solutions", URL: "#solutions" },
    { id: 3, text: "Case Studies", URL: "#case-studies" },
    { id: 4, text: "Process", URL: "#process" },
  ];

  const defaultContacts: FooterContact[] = [
    {
      id: 1,
      location: "Mumbai (Worli)",
      phone: "+91 99670 06777",
      address: "Building G and D-1, Zoo Media Pvt. Ltd, Worli, Mumbai, Maharashtra 400013",
      email: "hey@thumbstack.co",
    },
    {
      id: 2,
      location: "Budapest",
      phone: "+91 8374938493",
      address: "Building G and D-1, Zoo Media Pvt. Ltd, Worli, Mumbai, Maharashtra 400013",
      email: "thumbstack@gmail.com",
    },
    {
      id: 3,
      location: "Dubai",
      phone: "+91 8374938493",
      address: "Building G and D-1, Zoo Media Pvt. Ltd, Worli, Mumbai, Maharashtra 400013",
      email: "thumbstack@gmail.com",
    },
  ];

  const socialLinks =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks
      : defaultSocialLinks;

  const quickLinks =
    data?.quickLinks && data.quickLinks.length > 0
      ? data.quickLinks
      : defaultQuickLinks;

  const contacts =
    data?.contacts && data.contacts.length > 0
      ? data.contacts
      : defaultContacts;

  const marqueeText = (data?.marquee || "We design what's next").trim();

  const renderMarqueeUnit = (key: number) => (
    <div
      key={key}
      className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12 py-2 sm:py-3"
    >
      <span className="font-delight text-[clamp(44px,4.2vw,100px)] font-medium leading-none text-white whitespace-nowrap">
        {marqueeText}
      </span>
      <div className="group relative flex h-19.5 w-19.5 sm:h-28.5 sm:w-28.5 lg:h-30.5 lg:w-30.5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#7DE7D0]">
        <div className="relative h-8 w-8 sm:h-11.5 sm:w-11.5 lg:h-12 lg:w-12">
          <svg
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-slide-out"
          >
            <path
              d="M1.17157 47.1716C-0.390524 48.7337 -0.390524 51.2663 1.17157 52.8284C2.73367 54.3905 5.26633 54.3905 6.82843 52.8284L4 50L1.17157 47.1716ZM54 4C54 1.79086 52.2091 -1.32315e-06 50 -2.33467e-06L14 8.6849e-07C11.7909 -4.80209e-07 10 1.79086 10 4C10 6.20914 11.7909 8 14 8L46 8L46 40C46 42.2091 47.7909 44 50 44C52.2091 44 54 42.2091 54 40L54 4ZM4 50L6.82843 52.8284L52.8284 6.82843L50 4L47.1716 1.17157L1.17157 47.1716L4 50Z"
              fill="#3145DD"
            />
          </svg>
          <svg
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-slide-in"
          >
            <path
              d="M1.17157 47.1716C-0.390524 48.7337 -0.390524 51.2663 1.17157 52.8284C2.73367 54.3905 5.26633 54.3905 6.82843 52.8284L4 50L1.17157 47.1716ZM54 4C54 1.79086 52.2091 -1.32315e-06 50 -2.33467e-06L14 8.6849e-07C11.7909 -4.80209e-07 10 1.79086 10 4C10 6.20914 11.7909 8 14 8L46 8L46 40C46 42.2091 47.7909 44 50 44C52.2091 44 54 42.2091 54 40L54 4ZM4 50L6.82843 52.8284L52.8284 6.82843L50 4L47.1716 1.17157L1.17157 47.1716L4 50Z"
              fill="#3145DD"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <footer
      id="contact"
      data-theme="dark"
      className="relative w-full min-h-screen pt-16 pb-10 sm:pt-20 sm:pb-12 md:pt-24 md:pb-14 bg-[#3145DD] overflow-hidden select-none flex flex-col justify-between"
    >
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] flex-1 flex flex-col justify-between">
        <div className="flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr_1fr] gap-24 sm:gap-28 lg:gap-12 xl:gap-16">
          <div className="flex flex-col w-full">
            <h2 className="font-delight text-[clamp(44px,4.2vw,80px)] font-medium leading-none text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <span>{hasLogoPlaceholder ? headingParts[0]?.trim() : headingRaw}</span>
              {hasLogoPlaceholder && (
                <Image
                  src="/footercircle.avif"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="w-[clamp(48px,3.8vw,72px)] h-[clamp(48px,3.8vw,72px)] translate-y-[-0.05em] animate-spin-pause shrink-0 object-contain"
                />
              )}
              {hasLogoPlaceholder && headingParts[1]?.trim() && (
                <span>{headingParts[1].trim()}</span>
              )}
            </h2>

            <div className="mt-4 space-y-2 text-white font-satoshi text-[10.5px] sm:text-[12px] leading-[1.65] max-w-137.5">
              {description && (
                <p className="font-medium text-white/95">{description}</p>
              )}
              {subDescription && (
                <p className="font-medium text-white/95">{subDescription}</p>
              )}
            </div>

            <SocialLinks links={socialLinks} className="mt-8 sm:mt-8 flex items-center gap-3 sm:gap-4" />

            <div className="hidden lg:flex items-center gap-8 mt-auto pt-14 text-[13px] font-satoshi text-white/90 font-bold">
              <Link
                href="/privacy-policies"
                className="hover:underline underline-offset-4 transition-all"
              >
                Privacy Policies
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:underline underline-offset-4 transition-all"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>

          <div className="flex flex-col w-full lg:contents">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-8 lg:contents">
              <div className="order-2 lg:order-0 flex flex-col">
                <p className="font-satoshi! text-[clamp(13px,0.95vw,15px)] font-bold text-white tracking-wide mb-3 sm:mb-4 lg:mb-5">
                  Contact
                </p>
                <div className="flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-8">
                  {contacts.map((contact, idx) => {
                    const address =
                      contact.address ||
                      (contact.location?.toLowerCase().includes("mumbai")
                        ? "Building G and D-1, Zoo Media Pvt. Ltd, Worli, Mumbai, Maharashtra 400013"
                        : null);

                    return (
                      <div key={contact.id ?? idx} className="flex flex-col gap-1.5 sm:gap-2.5">
                        {contact.location && (
                          <p className="font-satoshi! text-[clamp(11.5px,0.85vw,13px)] font-medium text-white">
                            {contact.location}
                          </p>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="block mt-0.5 font-satoshi! text-[clamp(11.5px,0.85vw,13px)] font-normal text-[#95E7D3] underline underline-offset-4 hover:opacity-90 transition-opacity w-fit"
                          >
                            {contact.phone}
                          </a>
                        )}
                        {address && (
                          <p className="hidden lg:block max-w-70 font-satoshi! text-[clamp(11px,0.8vw,12.5px)] font-normal leading-[1.6] text-white">
                            {address}
                          </p>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="hidden lg:block font-satoshi! text-[clamp(11.5px,0.8vw,12.5px)] font-normal text-white hover:underline w-fit"
                          >
                            {contact.email}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="order-1 lg:order-0 flex flex-col">
                <p className="font-satoshi! text-[clamp(13px,0.95vw,15px)] font-bold text-white tracking-wide mb-3 sm:mb-4 lg:mb-5">
                  Quick Links
                </p>
                <div className="flex flex-col space-y-2.5 sm:space-y-3 lg:space-y-3.5">
                  {quickLinks.map((item, idx) => {
                    const resolved = resolveLink(item.URL, item.text);

                    if (resolved.isExternal) {
                      return (
                        <a
                          key={item.id ?? idx}
                          href={resolved.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-satoshi! text-[clamp(11.5px,0.85vw,13px)] font-medium text-white hover:text-[#95E7D3] transition-colors w-fit"
                        >
                          {item.text}
                        </a>
                      );
                    }

                    if (resolved.isAnchor) {
                      return (
                        <a
                          key={item.id ?? idx}
                          href={resolved.href}
                          className="font-satoshi! text-[clamp(11.5px,0.85vw,13px)] font-medium text-white hover:text-[#95E7D3] transition-colors w-fit"
                        >
                          {item.text}
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.id ?? idx}
                        href={resolved.href}
                        className="font-satoshi! text-[clamp(11.5px,0.85vw,13px)] font-medium text-white hover:text-[#95E7D3] transition-colors w-fit"
                      >
                        {item.text}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-14 sm:mt-12 w-full lg:hidden">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-callback-modal"))
                }
                className="group flex w-full items-center justify-between rounded-full bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-[#1A1A1A] shadow-md transition-all hover:bg-white/95 active:scale-[0.99]"
              >
                <span className="font-satoshi text-[13.5px] sm:text-[14.5px] font-medium text-[#1A1A1A] tracking-tight">
                  Sign up to our newsletter
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3145DD] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M2 13L13 2M13 2H4M13 2V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-6 mt-6 text-[12px] font-satoshi text-white/90">
              <Link
                href="/privacy-policies"
                className="hover:underline underline-offset-4 transition-all"
              >
                Privacy Policies
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:underline underline-offset-4 transition-all"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-14 overflow-hidden py-2 sm:py-3">
        <div className="flex w-max animate-marquee items-center">
          {[0, 1, 2, 3].map((i) => renderMarqueeUnit(i))}
          {[4, 5, 6, 7].map((i) => renderMarqueeUnit(i))}
        </div>
      </div>
    </footer>
  );
}