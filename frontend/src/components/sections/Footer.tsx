import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterSection, FooterLink, FooterContact } from "@/types";

interface FooterProps {
  data?: FooterSection;
}

const socialSvgMap: Record<string, React.ReactNode> = {
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="2" y="4.5" width="20" height="15" rx="4.5" fill="currentColor" />
      <polygon points="10,9.2 15.5,12 10,14.8" fill="#3145DD" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <circle cx="12" cy="12" r="9.75" fill="currentColor" />
      <path
        d="M15 11.5h-2v7h-3v-7H8.5v-2.5H10v-1.8c0-1.8 1-2.7 2.8-2.7H15v2.5h-1.3c-.8 0-1 .4-1 1v1H15l-.3 2.5z"
        fill="#3145DD"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="4.5" fill="currentColor" />
      <path
        d="M6.2 9.5h2.5v7h-2.5v-7zm1.25-3.5c-.8 0-1.45.65-1.45 1.45s.65 1.45 1.45 1.45 1.45-.65 1.45-1.45-.65-1.45-1.45-1.45zM11 9.5h2.4v1c.4-.7 1.2-1.2 2.3-1.2 1.8 0 2.8 1.1 2.8 3v4.2H16v-3.8c0-.8-.3-1.3-1.1-1.3-.7 0-1.1.5-1.1 1.3v3.8H11v-7z"
        fill="#3145DD"
      />
    </svg>
  ),
};

function getSocialIcon(platform?: string | null) {
  const p = platform?.toLowerCase().trim() || "";
  return socialSvgMap[p] ?? null;
}

const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { data },
  ref
) {
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
      URL: "https://in.linkedin.com/company/thumbstacktechnologies",
    },
  ];

  const defaultQuickLinks: FooterLink[] = [
    { id: 1, text: "Our Work", URL: "/our-work" },
    { id: 2, text: "Service", URL: "/service" },
    { id: 3, text: "Capabilities", URL: "/capabilities" },
    { id: 4, text: "News & Insights", URL: "/news-and-insights" },
  ];

  const defaultContacts: FooterContact[] = [
    {
      id: 1,
      location: "Mumbai, India",
      phone: "+91 99670 06777",
      email: "hey@thumbstack.co",
    },
    {
      id: 2,
      location: "Amsterdam, Netherlands",
      phone: "+31 6 4237 3471",
      email: "eu@thumbstack.co",
    },
    {
      id: 3,
      location: "Brisbane, Australia",
      phone: "+61 475 467 221",
      email: "au@thumbstack.co",
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
    <React.Fragment key={key}>
      <span className="font-satoshi font-medium tracking-tight text-white text-[48px] sm:text-[68px] 2xl:text-[92px] 3xl:text-[104px] leading-none whitespace-nowrap shrink-0">
        {marqueeText}
      </span>
      <div className="group relative overflow-hidden w-18 h-18 sm:w-24 sm:h-24 2xl:w-29.5 2xl:h-29.5 3xl:w-33 3xl:h-33 rounded-full bg-[#95E7D3] flex items-center justify-center shrink-0 cursor-pointer">
        <svg
          viewBox="0 0 225 225"
          fill="none"
          className="absolute inset-0 w-full h-full text-[#3145DD] transform transition-transform duration-500 ease-in-out group-hover:translate-x-[150%] group-hover:translate-y-[-150%]"
        >
          <path
            d="M158 73.5C158 69.9101 155.09 67 151.5 67L93 67C89.4102 67 86.5 69.9101 86.5 73.5C86.5 77.0898 89.4102 80 93 80H145V132C145 135.59 147.91 138.5 151.5 138.5C155.09 138.5 158 135.59 158 132L158 73.5ZM73.5 151.5L78.0962 156.096L156.096 78.0962L151.5 73.5L146.904 68.9038L68.9038 146.904L73.5 151.5Z"
            fill="currentColor"
          />
        </svg>
        <svg
          viewBox="0 0 225 225"
          fill="none"
          className="absolute inset-0 w-full h-full text-[#3145DD] transform translate-x-[-150%] translate-y-[150%] transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"
          aria-hidden="true"
        >
          <path
            d="M158 73.5C158 69.9101 155.09 67 151.5 67L93 67C89.4102 67 86.5 69.9101 86.5 73.5C86.5 77.0898 89.4102 80 93 80H145V132C145 135.59 147.91 138.5 151.5 138.5C155.09 138.5 158 135.59 158 132L158 73.5ZM73.5 151.5L78.0962 156.096L156.096 78.0962L151.5 73.5L146.904 68.9038L68.9038 146.904L73.5 151.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </React.Fragment>
  );

  return (
    <footer
      ref={ref}
      style={{
        transform: "translateY(100%)",
        visibility: "hidden",
        willChange: "transform",
      }}
      className="fixed bottom-0 left-0 w-full h-140 sm:h-150 2xl:h-165 3xl:h-180 bg-[#3145DD] text-white z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.25)] select-none flex flex-col justify-between overflow-hidden font-satoshi"
    >
      <div className="w-full px-8 sm:px-14 2xl:px-24 3xl:px-28 pt-10 sm:pt-14 2xl:pt-18 3xl:pt-20 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
            <h2 className="font-satoshi text-[38px] sm:text-[50px] 2xl:text-[62px] 3xl:text-[70px] font-medium leading-none tracking-tight text-white flex items-center flex-wrap gap-3 sm:gap-4">
              {hasLogoPlaceholder ? (
                <>
                  <span>{headingParts[0]?.trim()}</span>
                  <Image
                    src="/footercircle.avif"
                    alt="Logo"
                    width={60}
                    height={60}
                    className="w-9 h-9 sm:w-12 sm:h-12 2xl:w-15 2xl:h-15 object-contain shrink-0"
                  />
                  {headingParts[1]?.trim() && (
                    <span>{headingParts[1].trim()}</span>
                  )}
                </>
              ) : (
                <>
                  <span>{headingRaw}</span>
                  <Image
                    src="/footercircle.avif"
                    alt="Logo"
                    width={60}
                    height={60}
                    className="w-9 h-9 sm:w-12 sm:h-12 2xl:w-15 2xl:h-15 object-contain shrink-0"
                  />
                </>
              )}
            </h2>

            <p className="font-satoshi text-[14px] sm:text-[15px] 2xl:text-[16px] text-white font-medium mt-3.5 sm:mt-4 leading-snug">
              {description}
            </p>

            <p className="font-satoshi text-[13px] sm:text-[13.5px] 2xl:text-[14.5px] text-white/70 mt-1.5 sm:mt-2 max-w-md leading-relaxed">
              {subDescription}
            </p>

            <div className="flex items-center gap-4 sm:gap-5 mt-4 sm:mt-5">
              {socialLinks.map((item, idx) => {
                const icon = getSocialIcon(item.platform);
                if (!icon) return null;
                return (
                  <a
                    key={item.id ?? idx}
                    href={item.URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform || "Social Link"}
                    className="w-6 h-6 flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-6 sm:gap-8 mt-auto pt-8 sm:pt-10 font-satoshi text-[12px] sm:text-[13px] 2xl:text-[14px] text-white/80">
              <Link
                href="/privacy-policies"
                className="hover:text-white transition-colors"
              >
                Privacy Policies
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 xl:col-span-3">
            <h3 className="font-satoshi text-[14px] sm:text-[15px] 2xl:text-[16px] font-semibold text-white tracking-wide">
              Contact
            </h3>
            <div className="space-y-5 sm:space-y-6 mt-8 sm:mt-10">
              {contacts.map((contact, idx) => (
                <div key={contact.id ?? idx} className="space-y-0.5">
                  {contact.location && (
                    <p className="font-satoshi text-[13px] sm:text-[14px] font-medium text-white">
                      {contact.location}
                    </p>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-satoshi text-[12px] sm:text-[13px] text-white/80 hover:text-white block transition-colors w-fit"
                    >
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-satoshi text-[12px] sm:text-[13px] text-white/90 hover:text-white underline underline-offset-3 decoration-white/40 hover:decoration-white block transition-colors w-fit"
                    >
                      {contact.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 xl:col-span-2">
            <h3 className="font-satoshi text-[14px] sm:text-[15px] 2xl:text-[16px] font-semibold text-white tracking-wide">
              Quick Links
            </h3>
            <div className="flex flex-col gap-6 sm:gap-7 mt-8 sm:mt-10 font-satoshi text-[13px] sm:text-[14px] 2xl:text-[15px] text-white/90">
              {quickLinks.map((item, idx) => {
                const isRoute = item.URL?.startsWith("/");
                if (isRoute) {
                  return (
                    <Link
                      key={item.id ?? idx}
                      href={item.URL || "/"}
                      className="hover:text-[#95E7D3] transition-colors inline-block w-fit"
                    >
                      {item.text}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.id ?? idx}
                    href={item.URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#95E7D3] transition-colors inline-block w-fit"
                  >
                    {item.text}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden select-none pb-6 sm:pb-8 2xl:pb-10">
        <div className="flex animate-marquee-continuous w-max">
          <div className="flex items-center gap-8 sm:gap-10 2xl:gap-12 shrink-0 pr-8 sm:pr-10 2xl:pr-12">
            {[0, 1, 2].map((i) => renderMarqueeUnit(i))}
          </div>
          <div
            className="flex items-center gap-8 sm:gap-10 2xl:gap-12 shrink-0 pr-8 sm:pr-10 2xl:pr-12"
            aria-hidden="true"
          >
            {[3, 4, 5].map((i) => renderMarqueeUnit(i))}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;