import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterSection, FooterLink, FooterContact } from "@/types";

interface FooterProps {
  data?: FooterSection;
  ref?: React.Ref<HTMLElement>;
}

const socialSvgMap: Record<string, React.ReactNode> = {
  instagram: (
    <svg
      width="20"
      height="20"
      viewBox="0 3.5 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g style={{ mixBlendMode: "luminosity" }}>
        <path
          d="M6.6672 13.5C6.6672 11.6591 8.15912 10.1664 10 10.1664C11.8409 10.1664 13.3336 11.6591 13.3336 13.5C13.3336 15.3409 11.8409 16.8336 10 16.8336C8.15912 16.8336 6.6672 15.3409 6.6672 13.5ZM4.86512 13.5C4.86512 16.336 7.164 18.6349 10 18.6349C12.836 18.6349 15.1349 16.336 15.1349 13.5C15.1349 10.664 12.836 8.36512 10 8.36512C7.164 8.36512 4.86512 10.664 4.86512 13.5ZM14.1382 8.16152C14.1381 8.39886 14.2084 8.63089 14.3401 8.82829C14.4719 9.02568 14.6593 9.17956 14.8785 9.27047C15.0977 9.36138 15.339 9.38524 15.5718 9.33904C15.8046 9.29283 16.0185 9.17862 16.1863 9.01087C16.3542 8.84311 16.4686 8.62934 16.515 8.39658C16.5614 8.16382 16.5377 7.92253 16.447 7.70322C16.3563 7.48392 16.2025 7.29644 16.0052 7.1645C15.808 7.03257 15.576 6.9621 15.3386 6.962H15.3382C15.02 6.96215 14.715 7.08856 14.49 7.31347C14.265 7.53837 14.1384 7.84339 14.1382 8.16152ZM5.96 21.6398C4.98504 21.5954 4.45512 21.433 4.10296 21.2958C3.63608 21.114 3.30296 20.8975 2.95272 20.5478C2.60248 20.198 2.38568 19.8652 2.20472 19.3983C2.06744 19.0463 1.90504 18.5162 1.86072 17.5413C1.81224 16.4872 1.80256 16.1706 1.80256 13.5001C1.80256 10.8296 1.81304 10.5138 1.86072 9.45888C1.90512 8.48392 2.06872 7.95488 2.20472 7.60184C2.38648 7.13496 2.60296 6.80184 2.95272 6.4516C3.30248 6.10136 3.63528 5.88456 4.10296 5.7036C4.45496 5.56632 4.98504 5.40392 5.96 5.3596C7.01408 5.31112 7.33072 5.30144 10 5.30144C12.6693 5.30144 12.9862 5.31192 14.0412 5.3596C15.0162 5.404 15.5452 5.5676 15.8982 5.7036C16.3651 5.88456 16.6982 6.10184 17.0485 6.4516C17.3987 6.80136 17.6147 7.13496 17.7965 7.60184C17.9338 7.95384 18.0962 8.48392 18.1405 9.45888C18.189 10.5138 18.1986 10.8296 18.1986 13.5001C18.1986 16.1706 18.189 16.4863 18.1405 17.5413C18.0961 18.5162 17.9329 19.0462 17.7965 19.3983C17.6147 19.8652 17.3982 20.1983 17.0485 20.5478C16.6987 20.8972 16.3651 21.114 15.8982 21.2958C15.5462 21.433 15.0162 21.5954 14.0412 21.6398C12.9871 21.6882 12.6705 21.6979 10 21.6979C7.32952 21.6979 7.01376 21.6882 5.96 21.6398ZM5.8772 3.56056C4.81264 3.60904 4.0852 3.77784 3.44992 4.02504C2.792 4.28032 2.23504 4.6228 1.67848 5.17848C1.12192 5.73416 0.78032 6.292 0.52504 6.94992C0.27784 7.5856 0.10904 8.31264 0.06056 9.3772C0.01128 10.4434 0 10.7843 0 13.5C0 16.2157 0.01128 16.5566 0.06056 17.6228C0.10904 18.6874 0.27784 19.4144 0.52504 20.0501C0.78032 20.7076 1.122 21.2661 1.67848 21.8215C2.23496 22.377 2.792 22.719 3.44992 22.975C4.0864 23.2222 4.81264 23.391 5.8772 23.4394C6.944 23.4879 7.28432 23.5 10 23.5C12.7157 23.5 13.0566 23.4887 14.1228 23.4394C15.1874 23.391 15.9144 23.2222 16.5501 22.975C17.2076 22.719 17.765 22.3772 18.3215 21.8215C18.8781 21.2658 19.219 20.7076 19.475 20.0501C19.7222 19.4144 19.8918 18.6874 19.9394 17.6228C19.9879 16.5558 19.9992 16.2157 19.9992 13.5C19.9992 10.7843 19.9879 10.4434 19.9394 9.3772C19.891 8.31256 19.7222 7.5852 19.475 6.94992C19.219 6.2924 18.8772 5.73504 18.3215 5.17848C17.7658 4.62192 17.2076 4.28032 16.5509 4.02504C15.9144 3.77784 15.1874 3.60824 14.1236 3.56056C13.0574 3.51208 12.7165 3.5 10.0008 3.5C7.28512 3.5 6.944 3.51128 5.8772 3.56056Z"
          fill="#FEF7FF"
        />
      </g>
    </svg>
  ),
  youtube: (
    <svg
      width="24"
      height="19"
      viewBox="38 3.5 26 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g style={{ mixBlendMode: "luminosity" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M63.4733 7.26915C63.1831 6.1808 62.3245 5.32233 61.2322 5.02808C59.2572 4.5 51.3327 4.5 51.3327 4.5C51.3327 4.5 43.4123 4.5 41.4332 5.02808C40.345 5.31827 39.4864 6.17684 39.1921 7.26915C38.6641 9.2442 38.6641 13.3676 38.6641 13.3676C38.6641 13.3676 38.6641 17.4911 39.1921 19.4662C39.4823 20.5545 40.3409 21.413 41.4332 21.7072C43.4123 22.2353 51.3327 22.2353 51.3327 22.2353C51.3327 22.2353 59.2572 22.2353 61.2322 21.7072C62.3206 21.4171 63.179 20.5585 63.4733 19.4662C64.0014 17.4911 64.0014 13.3677 64.0014 13.3677C64.0014 13.3677 64.0014 9.2442 63.4733 7.26915Z"
          fill="#FEF7FF"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.8047 17.1684L55.3869 13.3673L48.8047 9.56641V17.1684Z"
          fill="#3145DD"
        />
      </g>
    </svg>
  ),
  facebook: (
    <svg
      width="20"
      height="20"
      viewBox="82 3.5 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g style={{ mixBlendMode: "luminosity" }}>
        <path
          d="M92 23.5C97.5228 23.5 102 19.0228 102 13.5C102 7.97715 97.5228 3.5 92 3.5C86.4772 3.5 82 7.97715 82 13.5C82 19.0228 86.4772 23.5 92 23.5Z"
          fill="white"
        />
        <path
          d="M95.2511 6.57031H93.0359C91.7213 6.57031 90.2591 7.12322 90.2591 9.02878C90.2655 9.69276 90.2591 10.3286 90.2591 11.0443H88.7383V13.4644H90.3062V20.4313H93.1872V13.4184H95.0888L95.2609 11.0375H93.1376C93.1376 11.0375 93.1423 9.97839 93.1376 9.67082C93.1376 8.91778 93.9211 8.96091 93.9683 8.96091C94.3411 8.96091 95.0661 8.96199 95.2522 8.96091V6.57031H95.2511Z"
          fill="#3145DD"
        />
      </g>
    </svg>
  ),
  linkedin: (
    <svg
      width="20"
      height="20"
      viewBox="120 3.5 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <g style={{ mixBlendMode: "luminosity" }}>
        <path
          d="M120 4.9307C120 4.13992 120.662 3.49805 121.478 3.49805H138.522C139.338 3.49805 140 4.13992 140 4.9307V22.0656C140 22.8566 139.338 23.498 138.522 23.498H121.478C120.662 23.498 120 22.8567 120 22.0659V4.93047V4.9307Z"
          fill="white"
        />
        <path
          d="M126.075 20.2371V11.233H123.083V20.2371H126.076H126.075ZM124.58 10.0039C125.623 10.0039 126.273 9.3125 126.273 8.44844C126.253 7.56469 125.623 6.89258 124.6 6.89258C123.575 6.89258 122.906 7.56469 122.906 8.44836C122.906 9.31242 123.556 10.0038 124.56 10.0038H124.579L124.58 10.0039ZM127.732 20.2371H130.725V15.2094C130.725 14.9406 130.744 14.6712 130.823 14.4792C131.039 13.9413 131.532 13.3845 132.359 13.3845C133.441 13.3845 133.875 14.2102 133.875 15.4207V20.2371H136.867V15.0745C136.867 12.3089 135.391 11.022 133.422 11.022C131.808 11.022 131.099 11.9242 130.705 12.5387H130.725V11.2334H127.732C127.771 12.078 127.732 20.2374 127.732 20.2374L127.732 20.2371Z"
          fill="#3145DD"
        />
      </g>
    </svg>
  ),
};

function getSocialIcon(platform?: string | null) {
  const p = platform?.toLowerCase().trim() || "";
  return socialSvgMap[p] ?? null;
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
      <div className="group relative flex h-[78px] w-[78px] sm:h-[114px] sm:w-[114px] lg:h-[122px] lg:w-[122px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#7DE7D0]">
        <div className="relative h-[32px] w-[32px] sm:h-[46px] sm:w-[46px] lg:h-[48px] lg:w-[48px]">
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
        <div className="flex flex-col lg:flex-row lg:justify-between gap-24 sm:gap-28 lg:gap-10 xl:gap-16">
          <div className="flex flex-col w-full lg:max-w-[480px] xl:max-w-[540px]">
            <h2 className="font-delight text-[clamp(44px,4.2vw,80px)] font-medium leading-none text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <span>{hasLogoPlaceholder ? headingParts[0]?.trim() : headingRaw}</span>
              <Image
                src="/footercircle.avif"
                alt="Logo"
                width={80}
                height={80}
                className="w-[1em] h-[1em] -translate-y-[13%] animate-spin-pause shrink-0 object-contain"
              />
              {hasLogoPlaceholder && headingParts[1]?.trim() && (
                <span>{headingParts[1].trim()}</span>
              )}
            </h2>

            <div className="mt-4 space-y-2 text-white font-satoshi text-[10.5px] sm:text-[12px] leading-[1.65] max-w-[550px]">
              {description && (
                <p className="font-medium text-white/95">{description}</p>
              )}
              {subDescription && (
                <p className="font-medium text-white/95">{subDescription}</p>
              )}
            </div>

            <div className="mt-8 sm:mt-8 flex items-center gap-3 sm:gap-4">
              {socialLinks.map((item, idx) => {
                const icon = getSocialIcon(item.platform);
                if (!icon) return null;
                return (
                  <a
                    key={item.id ?? idx}
                    href={item.URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:opacity-80 transition-opacity flex items-center justify-center"
                    aria-label={item.platform || "Social Link"}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>

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

          <div className="flex flex-col w-full lg:max-w-[620px] xl:max-w-[700px]">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-8">
              <div className="order-1 lg:order-2 lg:pl-6 xl:pl-10">
                <h2 className="font-satoshi text-[13px] sm:text-[14px] lg:text-[15px] font-normal text-white tracking-normal mb-3 sm:mb-4 lg:mb-5">
                  Quick Links
                </h2>
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
                          className="font-satoshi text-[11.5px] sm:text-[12.5px] lg:text-[13px] font-bold text-white/80 hover:text-[#95E7D3] transition-colors w-fit"
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
                          className="font-satoshi text-[11.5px] sm:text-[12.5px] lg:text-[13px] font-bold text-white/80 hover:text-[#95E7D3] transition-colors w-fit"
                        >
                          {item.text}
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.id ?? idx}
                        href={resolved.href}
                        className="font-satoshi text-[11.5px] sm:text-[12.5px] lg:text-[13px] font-bold text-white/80 hover:text-[#95E7D3] transition-colors w-fit"
                      >
                        {item.text}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="order-2 lg:order-1">
                <h2 className="font-satoshi text-[13px] sm:text-[14px] lg:text-[15px] font-normal text-white tracking-normal mb-3 sm:mb-4 lg:mb-5">
                  Contacts
                </h2>
                <div className="flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5">
                  {contacts.map((contact, idx) => {
                    const address =
                      contact.address ||
                      (contact.location?.toLowerCase().includes("mumbai")
                        ? "Building G and D-1, Zoo Media Pvt. Ltd, Worli, Mumbai, Maharashtra 400013"
                        : null);

                    return (
                      <div key={contact.id ?? idx}>
                        {contact.location && (
                          <p className="font-satoshi text-[11.5px] sm:text-[12.5px] lg:text-[13px] font-normal text-white">
                            {contact.location}
                          </p>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="block mt-0.5 font-satoshi text-[11.5px] sm:text-[12.5px] lg:text-[13px] font-normal text-[#95E7D3] underline underline-offset-4 hover:opacity-90 transition-opacity w-fit"
                          >
                            {contact.phone}
                          </a>
                        )}
                        {address && (
                          <p className="hidden lg:block mt-2.5 max-w-[280px] font-satoshi text-[11px] sm:text-[12px] lg:text-[12.5px] font-normal leading-[1.4] text-white/80">
                            {address}
                          </p>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="hidden lg:block mt-2 font-satoshi text-[11.5px] sm:text-[12px] lg:text-[12.5px] font-normal text-white/90 hover:underline w-fit"
                          >
                            {contact.email}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-14 sm:mt-12 w-full lg:hidden">
              <a
                href="#news"
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
              </a>
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