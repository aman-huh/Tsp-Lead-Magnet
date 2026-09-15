"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SocialLinks } from "@/components/shared/SocialIcons";
import { useLenis } from "@/components/providers/SmoothScroll";
import { NavbarSection, FooterLink, FooterContact } from "@/types";

interface NavbarProps {
  className?: string;
  data?: NavbarSection;
}

const DEFAULT_PAGE_LINKS: FooterLink[] = [
  { text: "Our Work", URL: "#our-work" },
  { text: "Solutions", URL: "#solutions" },
  { text: "Case Studies", URL: "#case-studies" },
  { text: "Process", URL: "#process" },
];

const DEFAULT_CONTACTS: FooterContact[] = [
  {
    location: "Mumbai, India",
    phone: "+91 99670 06777",
    email: "hey@thumbstack.co",
  },
  {
    location: "Amsterdam, Netherlands",
    phone: "+31 6 4237 3471",
    email: "eu@thumbstack.co",
  },
  {
    location: "Brisbane, Australia",
    phone: "+61 475 467 221",
    email: "au@thumbstack.co",
  },
];

function resolveLink(url?: string | null, text?: string | null) {
  const raw = (url || "").trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return { href: raw, isExternal: true };
  }
  if (raw.startsWith("#") || raw.startsWith("/")) {
    return { href: raw, isExternal: false };
  }
  if (!raw && text) {
    const slug = text.toLowerCase().replace(/\s+/g, "-");
    return { href: `#${slug}`, isExternal: false };
  }
  return { href: raw ? `/${raw.replace(/^\/+/, "")}` : "#", isExternal: false };
}

export default function Navbar({ className = "", data }: NavbarProps) {
  const pageLinks =
    data?.pageLinks && data.pageLinks.length > 0
      ? data.pageLinks
      : DEFAULT_PAGE_LINKS;

  const contacts =
    data?.contacts && data.contacts.length > 0
      ? data.contacts
      : DEFAULT_CONTACTS;

  const getSocialUrl = (platform: string, fallback: string) => {
    const match = data?.socialLinks?.find(
      (s) => (s.platform || s.text || "").toLowerCase() === platform.toLowerCase()
    );
    return match?.URL || fallback;
  };

  const socialLinks = [
    { platform: "instagram", url: getSocialUrl("instagram", "https://www.instagram.com/thumbstack_tech/") },
    { platform: "youtube", url: getSocialUrl("youtube", "https://www.youtube.com/@TheHumanAIPodcast") },
    { platform: "facebook", url: getSocialUrl("facebook", "https://www.facebook.com/ThumbstackTechnologies/") },
    { platform: "linkedin", url: getSocialUrl("linkedin", "https://in.linkedin.com/company/thumbstacktechnologies") },
  ];

  const ctaText = data?.cta?.text || "Talk to us";
  const ctaUrl = data?.cta?.url || "/#footer";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [logoIsDark, setLogoIsDark] = useState(true);
  const [buttonIsDark, setButtonIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (isMenuOpen) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
    return () => {
      if (lenis) lenis.start();
    };
  }, [isMenuOpen, lenis]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const isModalElement = (el: Element | null): boolean => {
      if (!el) return false;
      return !!el.closest(
        '[data-modal], [role="dialog"], [aria-modal="true"], #quote-modal, #callback-modal, [class*="modal"]'
      );
    };

    const checkColorAtElement = (el: HTMLElement | null): boolean => {
      const scrollY =
        typeof window !== "undefined"
          ? window.scrollY || document.documentElement.scrollTop || 0
          : 0;
      const isAtTop = scrollY < 50;

      if (isAtTop) {
        return true;
      }

      if (!el || typeof window === "undefined" || typeof document === "undefined") {
        return isAtTop;
      }
      try {
        const rect = el.getBoundingClientRect();
        const coords = [
          {
            x: Math.min(Math.max(rect.left + rect.width / 2, 0), window.innerWidth - 1),
            y: Math.min(Math.max(rect.top + rect.height / 2, 0), window.innerHeight - 1),
          },
          {
            x: Math.round(window.innerWidth / 2),
            y: Math.min(Math.max(rect.top + rect.height / 2, 0), window.innerHeight - 1),
          },
        ];

        for (const coord of coords) {
          const elements = document.elementsFromPoint(coord.x, coord.y);
          for (const item of elements) {
            if (headerRef.current && headerRef.current.contains(item)) {
              continue;
            }
            if (isModalElement(item)) {
              continue;
            }
            let curr: Element | null = item;
            while (curr) {
              if (isModalElement(curr)) {
                break;
              }
              const style = window.getComputedStyle(curr);
              const bg = style.backgroundColor;
              if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (match) {
                  const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
                  if (alpha > 0.1) {
                    const r = parseInt(match[1], 10);
                    const g = parseInt(match[2], 10);
                    const b = parseInt(match[3], 10);
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    return luminance < 0.55;
                  }
                }
              }
              curr = curr.parentElement;
            }
          }
        }
      } catch {
        return isAtTop;
      }
      return isAtTop;
    };

    let rafId: number | null = null;

    const checkColors = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 20);

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (isMenuOpen) {
          setLogoIsDark(true);
          setButtonIsDark(true);
          return;
        }
        if (
          document.querySelector(
            '[data-modal], #quote-modal, #callback-modal, [role="dialog"][aria-modal="true"]'
          )
        ) {
          return;
        }
        const logoDark = checkColorAtElement(logoRef.current);
        const btnDark = checkColorAtElement(buttonRef.current);
        setLogoIsDark(logoDark);
        setButtonIsDark(btnDark);
      });
    };

    checkColors();

    if (lenis) {
      lenis.on("scroll", checkColors);
    }
    window.addEventListener("scroll", checkColors, { passive: true });
    window.addEventListener("resize", checkColors, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.off("scroll", checkColors);
      }
      window.removeEventListener("scroll", checkColors);
      window.removeEventListener("resize", checkColors);
    };
  }, [lenis, isMenuOpen]);

  const effectiveLogoDark = isMenuOpen || logoIsDark;
  const effectiveButtonDark = isMenuOpen || buttonIsDark;
  const showButtonBg = !isMenuOpen && isScrolled;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full h-[clamp(4.25rem,5vw,5.5rem)] flex items-center justify-between px-[clamp(1.25rem,4.2vw,2rem)] lg:px-[clamp(3.5rem,5.2vw,6.25rem)] transition-all duration-500 z-10001 ${className}`}
        style={{ background: "transparent", backdropFilter: "none" }}
      >
        <div ref={logoRef} className="flex items-center">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <span
              role="img"
              aria-label="Thumbstack Logo"
              className="font-medium text-[24px] sm:text-[32px] tracking-tight flex items-center transition-colors duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                fontFamily: "var(--font-heading)",
                color: effectiveLogoDark ? "#FFFFFF" : "#3145DD",
              }}
            >
              <svg
                viewBox="0 0 194 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin meet"
                className="h-[clamp(1.25rem,4.2vw,1.625rem)] w-auto max-w-none inline-block overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] aspect-194/32"
              >
                <path
                  d="M19.36 5.832H11.92V25H7.712V5.832H0.272V2.12H19.36V5.832Z"
                  fill="currentColor"
                />
                <path
                  d="M24.153 25H20.137V1.32H24.153V12.552C24.3557 11.6507 24.6463 10.848 25.025 10.144C25.4037 9.44 25.8623 8.848 26.401 8.368C26.945 7.88267 27.5637 7.51467 28.257 7.264C28.9503 7.008 29.7077 6.88 30.529 6.88C31.505 6.88 32.3717 7.06133 33.129 7.424C33.8917 7.78133 34.5343 8.304 35.057 8.992C35.585 9.68 35.985 10.5253 36.257 11.528C36.529 12.5253 36.665 13.664 36.665 14.944V25H32.649V15.344C32.649 12.064 31.3237 10.424 28.673 10.424C27.9637 10.424 27.329 10.5387 26.769 10.768C26.209 10.9973 25.7343 11.3333 25.345 11.776C24.9557 12.2133 24.6597 12.7547 24.457 13.4C24.2543 14.04 24.153 14.7733 24.153 15.6V25ZM50.679 7.36H54.695V25H50.679V19.808C50.4817 20.704 50.191 21.504 49.807 22.208C49.4283 22.912 48.967 23.5067 48.423 23.992C47.8843 24.4773 47.2683 24.8453 46.575 25.096C45.8817 25.352 45.1243 25.48 44.303 25.48C43.327 25.48 42.4577 25.3013 41.695 24.944C40.9377 24.5813 40.295 24.056 39.767 23.368C39.2443 22.68 38.847 21.8373 38.575 20.84C38.303 19.8373 38.167 18.696 38.167 17.416V7.36H42.183V17.016C42.183 20.2907 43.5083 21.928 46.159 21.928C46.8737 21.928 47.511 21.8133 48.071 21.584C48.631 21.3547 49.103 21.0213 49.487 20.584C49.8763 20.1413 50.1723 19.6 50.375 18.96C50.5777 18.3147 50.679 17.5813 50.679 16.76V7.36ZM60.373 25H56.357V7.36H60.373V12.416C60.565 11.536 60.8397 10.7547 61.197 10.072C61.5543 9.384 61.9837 8.80533 62.485 8.336C62.9917 7.86133 63.565 7.50133 64.205 7.256C64.8503 7.00533 65.5517 6.88 66.309 6.88C67.1037 6.88 67.8183 7.016 68.453 7.288C69.093 7.55467 69.6503 7.94933 70.125 8.472C70.5997 8.99467 70.989 9.63733 71.293 10.4C71.597 11.1573 71.8077 12.0293 71.925 13.016C72.0903 12.0453 72.349 11.1813 72.701 10.424C73.053 9.66133 73.485 9.01867 73.997 8.496C74.5143 7.968 75.109 7.568 75.781 7.296C76.453 7.01867 77.189 6.88 77.989 6.88C78.9063 6.88 79.7197 7.06133 80.429 7.424C81.1437 7.78133 81.7437 8.304 82.229 8.992C82.7197 9.68 83.093 10.5253 83.349 11.528C83.605 12.5253 83.733 13.664 83.733 14.944V25H79.717V15.344C79.717 12.064 78.5197 10.424 76.125 10.424C75.485 10.424 74.9117 10.5387 74.405 10.768C73.8983 10.9973 73.4717 11.3333 73.125 11.776C72.7783 12.2133 72.5117 12.7547 72.325 13.4C72.1437 14.04 72.053 14.7733 72.053 15.6V25H68.037V15.344C68.037 12.064 66.8397 10.424 64.445 10.424C63.805 10.424 63.2317 10.5387 62.725 10.768C62.2183 10.9973 61.7917 11.3333 61.445 11.776C61.0983 12.2133 60.8317 12.7547 60.645 13.4C60.4637 14.04 60.373 14.7733 60.373 15.6V25ZM89.3268 12.752C89.5401 11.8347 89.8388 11.0133 90.2228 10.288C90.6068 9.56267 91.0628 8.94933 91.5908 8.448C92.1241 7.94133 92.7241 7.55467 93.3908 7.288C94.0628 7.016 94.7908 6.88 95.5748 6.88C96.2841 6.88 96.9561 6.984 97.5908 7.192C98.2308 7.4 98.8201 7.696 99.3588 8.08C99.8974 8.464 100.383 8.93333 100.815 9.488C101.247 10.0373 101.615 10.656 101.919 11.344C102.223 12.032 102.455 12.784 102.615 13.6C102.78 14.4107 102.863 15.2693 102.863 16.176C102.863 17.0827 102.78 17.944 102.615 18.76C102.455 19.5707 102.223 20.32 101.919 21.008C101.615 21.696 101.247 22.3173 100.815 22.872C100.383 23.4213 99.8948 23.8907 99.3508 24.28C98.8121 24.664 98.2228 24.96 97.5828 25.168C96.9481 25.376 96.2761 25.48 95.5668 25.48C94.7881 25.48 94.0628 25.344 93.3908 25.072C92.7241 24.8053 92.1241 24.4187 91.5908 23.912C91.0628 23.4053 90.6068 22.7893 90.2228 22.064C89.8388 21.3387 89.5401 20.5173 89.3268 19.6V25H85.3108V1.32H89.3268V12.752ZM89.3268 16.176C89.3268 17.0933 89.4334 17.912 89.6468 18.632C89.8654 19.352 90.1801 19.9627 90.5908 20.464C91.0068 20.96 91.5108 21.3387 92.1028 21.6C92.7001 21.8613 93.3748 21.992 94.1268 21.992C94.8948 21.992 95.5694 21.8667 96.1508 21.616C96.7374 21.3653 97.2281 20.9947 97.6228 20.504C98.0228 20.0133 98.3241 19.408 98.5268 18.688C98.7294 17.9627 98.8308 17.1253 98.8308 16.176C98.8308 15.2267 98.7294 14.392 98.5268 13.672C98.3241 12.9467 98.0228 12.3413 97.6228 11.856C97.2281 11.3653 96.7374 10.9947 96.1508 10.744C95.5694 10.4933 94.8948 10.368 94.1268 10.368C93.3694 10.368 92.6921 10.4987 92.0948 10.76C91.5028 11.0213 91.0014 11.4 90.5908 11.896C90.1801 12.392 89.8654 13 89.6468 13.72C89.4334 14.44 89.3268 15.2587 89.3268 16.176ZM111.454 6.88C112.702 6.88 113.814 7.01867 114.79 7.296C115.766 7.57333 116.59 7.97067 117.262 8.488C117.934 9.00533 118.446 9.63467 118.798 10.376C119.15 11.112 119.326 11.9413 119.326 12.864H115.374C115.374 12.432 115.288 12.0427 115.118 11.696C114.952 11.344 114.707 11.0453 114.382 10.8C114.056 10.5547 113.651 10.3653 113.166 10.232C112.686 10.0987 112.134 10.032 111.51 10.032C110.95 10.032 110.438 10.0853 109.974 10.192C109.515 10.2933 109.118 10.44 108.782 10.632C108.451 10.824 108.195 11.0533 108.014 11.32C107.832 11.5867 107.742 11.8827 107.742 12.208C107.742 12.464 107.792 12.688 107.894 12.88C108 13.0667 108.144 13.232 108.326 13.376C108.512 13.52 108.731 13.6427 108.982 13.744C109.232 13.8453 109.504 13.936 109.798 14.016C110.091 14.0907 110.398 14.1573 110.718 14.216C111.038 14.2693 111.36 14.3227 111.686 14.376L112.862 14.568C113.224 14.6267 113.6 14.6907 113.99 14.76C114.384 14.8293 114.782 14.9147 115.182 15.016C115.582 15.112 115.976 15.2293 116.366 15.368C116.755 15.5013 117.123 15.664 117.47 15.856C117.822 16.048 118.147 16.272 118.446 16.528C118.744 16.7787 119.003 17.072 119.222 17.408C119.44 17.7387 119.611 18.1173 119.734 18.544C119.856 18.9653 119.918 19.44 119.918 19.968C119.918 20.848 119.739 21.6293 119.382 22.312C119.03 22.9947 118.51 23.5707 117.822 24.04C117.139 24.5093 116.294 24.8667 115.286 25.112C114.278 25.3573 113.118 25.48 111.806 25.48C110.435 25.48 109.23 25.344 108.19 25.072C107.15 24.8053 106.28 24.4133 105.582 23.896C104.883 23.3733 104.358 22.7333 104.006 21.976C103.654 21.2133 103.478 20.3413 103.478 19.36H107.422C107.422 20.3093 107.779 21.04 108.494 21.552C109.214 22.0587 110.312 22.312 111.79 22.312C112.446 22.312 113.032 22.2613 113.55 22.16C114.067 22.0587 114.504 21.912 114.862 21.72C115.224 21.528 115.499 21.2907 115.686 21.008C115.878 20.7253 115.974 20.4027 115.974 20.04C115.974 19.752 115.92 19.5013 115.814 19.288C115.707 19.0747 115.555 18.888 115.358 18.728C115.166 18.5627 114.936 18.424 114.67 18.312C114.403 18.1947 114.11 18.0933 113.79 18.008C113.47 17.9173 113.128 17.8373 112.766 17.768C112.408 17.6987 112.04 17.632 111.662 17.568L110.486 17.368C110.048 17.2933 109.576 17.208 109.07 17.112C108.568 17.0107 108.07 16.8827 107.574 16.728C107.083 16.568 106.608 16.3707 106.15 16.136C105.696 15.896 105.294 15.6027 104.942 15.256C104.595 14.904 104.318 14.4853 104.11 14C103.902 13.5147 103.798 12.944 103.798 12.288C103.798 11.456 103.971 10.7067 104.318 10.04C104.67 9.37333 105.176 8.808 105.838 8.344C106.499 7.87467 107.302 7.51467 108.246 7.264C109.195 7.008 110.264 6.88 111.454 6.88ZM132.198 24.864C130.774 25.2693 129.505 25.472 128.39 25.472C127.467 25.472 126.651 25.3333 125.942 25.056C125.238 24.7787 124.646 24.3653 124.166 23.816C123.691 23.2667 123.331 22.584 123.086 21.768C122.846 20.9467 122.726 19.9973 122.726 18.92V10.624H120.422V7.36H122.726V3.296H126.742V7.36H132.198V10.624H126.742V18.928C126.742 20.0213 126.945 20.824 127.35 21.336C127.755 21.848 128.398 22.104 129.278 22.104C129.63 22.104 130.043 22.064 130.518 21.984C130.993 21.904 131.553 21.7813 132.198 21.616V24.864ZM133.431 13.664C133.431 12.624 133.623 11.6853 134.007 10.848C134.391 10.0107 134.937 9.29867 135.647 8.712C136.361 8.12 137.228 7.66667 138.247 7.352C139.271 7.03733 140.417 6.88 141.687 6.88C143.015 6.88 144.201 7.05333 145.247 7.4C146.297 7.74667 147.185 8.248 147.911 8.904C148.641 9.56 149.199 10.3627 149.583 11.312C149.967 12.2613 150.159 13.336 150.159 14.536V25H146.143V20.376C145.935 21.1653 145.62 21.8773 145.199 22.512C144.783 23.1413 144.273 23.6773 143.671 24.12C143.068 24.5573 142.383 24.8933 141.615 25.128C140.852 25.3627 140.023 25.48 139.127 25.48C138.193 25.48 137.345 25.352 136.583 25.096C135.82 24.8453 135.167 24.4907 134.623 24.032C134.079 23.5733 133.657 23.0213 133.359 22.376C133.06 21.7253 132.911 21.0053 132.911 20.216C132.911 19.3947 133.073 18.6587 133.399 18.008C133.724 17.3573 134.191 16.8053 134.799 16.352C135.412 15.8987 136.159 15.552 137.039 15.312C137.919 15.0667 138.911 14.944 140.015 14.944H146.143V14.536C146.143 13.8693 146.039 13.272 145.831 12.744C145.623 12.2107 145.321 11.7573 144.927 11.384C144.537 11.0107 144.063 10.7253 143.503 10.528C142.943 10.3307 142.311 10.232 141.607 10.232C140.892 10.232 140.271 10.312 139.743 10.472C139.22 10.632 138.788 10.8613 138.447 11.16C138.105 11.4587 137.852 11.8213 137.687 12.248C137.521 12.6693 137.439 13.1413 137.439 13.664H133.431ZM140.239 17.76C139.145 17.76 138.316 17.944 137.751 18.312C137.191 18.68 136.911 19.224 136.911 19.944C136.911 20.7013 137.22 21.2827 137.839 21.688C138.457 22.088 139.345 22.288 140.503 22.288C141.324 22.288 142.079 22.1893 142.767 21.992C143.46 21.7893 144.055 21.5093 144.551 21.152C145.052 20.7947 145.441 20.3707 145.719 19.88C146.001 19.384 146.143 18.8453 146.143 18.264V17.76H140.239ZM155.399 16.176C155.399 17.0773 155.508 17.8853 155.727 18.6C155.945 19.3093 156.257 19.912 156.663 20.408C157.073 20.8987 157.572 21.2747 158.159 21.536C158.751 21.7973 159.417 21.928 160.159 21.928C160.799 21.928 161.361 21.8347 161.847 21.648C162.337 21.456 162.759 21.192 163.111 20.856C163.463 20.52 163.748 20.1253 163.967 19.672C164.191 19.2133 164.353 18.72 164.455 18.192H168.463C168.372 18.8907 168.212 19.5547 167.983 20.184C167.759 20.8133 167.471 21.4 167.119 21.944C166.767 22.4827 166.353 22.9707 165.879 23.408C165.404 23.84 164.873 24.2107 164.287 24.52C163.7 24.8293 163.06 25.0667 162.367 25.232C161.679 25.3973 160.94 25.48 160.151 25.48C159.281 25.48 158.46 25.3787 157.687 25.176C156.919 24.9787 156.209 24.6907 155.559 24.312C154.908 23.9333 154.321 23.472 153.799 22.928C153.281 22.384 152.841 21.768 152.479 21.08C152.121 20.3867 151.847 19.6293 151.655 18.808C151.463 17.9867 151.367 17.1093 151.367 16.176C151.367 14.7733 151.577 13.5013 151.999 12.36C152.425 11.2187 153.025 10.2427 153.799 9.432C154.572 8.616 155.497 7.98667 156.575 7.544C157.652 7.10133 158.844 6.88 160.151 6.88C161.335 6.88 162.407 7.064 163.367 7.432C164.332 7.8 165.169 8.30933 165.879 8.96C166.588 9.60533 167.161 10.3733 167.599 11.264C168.041 12.1547 168.329 13.1227 168.463 14.168H164.455C164.359 13.64 164.199 13.1493 163.975 12.696C163.756 12.2373 163.471 11.84 163.119 11.504C162.767 11.168 162.345 10.9067 161.855 10.72C161.364 10.528 160.799 10.432 160.159 10.432C159.417 10.432 158.751 10.5627 158.159 10.824C157.572 11.0853 157.073 11.464 156.663 11.96C156.257 12.4507 155.945 13.0507 155.727 13.76C155.508 14.4693 155.399 15.2747 155.399 16.176ZM177.104 16.32L186.888 25H181.512L173.752 17.952V25H169.736V1.32H173.752V15L181.216 7.36H186.128L177.104 16.32V16.32Z"
                  fill="currentColor"
                  opacity="1"
                />
                <path
                  d="M192.282 25H187.77V20.264H192.282V25Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="group relative flex items-center justify-center rounded-full transition-all duration-300 w-11 h-11 sm:w-12 sm:h-12 md:w-13.5 md:h-13.5 lg:w-14 lg:h-14 shrink-0 cursor-pointer"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          onPointerDown={() => setMenuMounted(true)}
          onMouseEnter={() => setMenuMounted(true)}
          onFocus={() => setMenuMounted(true)}
          onClick={() => {
            setMenuMounted(true);
            setIsMenuOpen((prev) => !prev);
          }}
          style={{
            backgroundColor: showButtonBg
              ? effectiveButtonDark
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(181, 253, 236, 0.75)"
              : "transparent",
            backdropFilter: showButtonBg ? "blur(12px)" : "none",
            WebkitBackdropFilter: showButtonBg ? "blur(12px)" : "none",
          }}
        >
          <svg
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 lg:w-7.5 lg:h-7.5 transition-colors duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              color: effectiveButtonDark ? "#FFFFFF" : "#3145DD",
            }}
          >
            <g clipPath="url(#clip0_9011_1876)">
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.6875 7.5 H25.3125"
                stroke="currentColor"
                style={{
                  transformBox: "view-box",
                  transformOrigin: "15px 15px",
                  transform: isMenuOpen
                    ? "rotate(45deg) translateY(7.5px)"
                    : undefined,
                }}
                className={`transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${isMenuOpen ? "" : "group-hover:translate-x-[2.5px]"
                  }`}
              />
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.6875 15 H20.625"
                stroke="currentColor"
                style={{
                  transformBox: "view-box",
                  transformOrigin: "15px 15px",
                  opacity: isMenuOpen ? 0 : 1,
                  transform: isMenuOpen ? "translateX(-6px)" : undefined,
                }}
                className={`transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${isMenuOpen ? "" : "group-hover:translate-x-[-2.5px]"
                  }`}
              />
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.6875 22.5 H25.3125"
                stroke="currentColor"
                style={{
                  transformBox: "view-box",
                  transformOrigin: "15px 15px",
                  transform: isMenuOpen
                    ? "rotate(-45deg) translateY(-7.5px)"
                    : undefined,
                }}
                className={`transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${isMenuOpen ? "" : "group-hover:translate-x-[2.5px]"
                  }`}
              />
            </g>
            <defs>
              <clipPath id="clip0_9011_1876">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </header>

      {menuMounted && (
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        className={`fixed top-0 right-0 w-full z-9999 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] h-dvh md:h-full md:grid md:grid-cols-[1.4fr_1fr] custom-menu-overlay overflow-hidden ${isMenuOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
          }`}
        style={{
          background: "rgba(15, 29, 7, 0.97)",
          borderBottom: "1px solid rgba(82, 80, 80, 0.32)",
          backdropFilter: "blur(50.55px)",
          WebkitBackdropFilter: "blur(50.55px)",
        }}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className="w-full h-full md:contents custom-menu-wrapper">
          <div className="bg-transparent h-full md:h-full w-full flex flex-col relative overflow-y-auto px-6 sm:px-16 pt-18 pb-6 md:pt-30 md:pb-25 custom-menu-left">
            <nav className="flex flex-col gap-5 sm:gap-7 md:gap-9 pl-4 sm:pl-6 md:pl-12 lg:pl-20 xl:pl-24 custom-menu-nav">
              {pageLinks.map((item, idx) => {
                const resolved = resolveLink(item.URL, item.text);
                const linkText = item.text || "Link";
                if (resolved.isExternal) {
                  return (
                    <a
                      key={item.id ?? idx}
                      className="block w-fit font-delight text-white hover:text-[#95E7D3] transition-colors duration-200 text-[clamp(24px,5.5vw,62px)] font-normal leading-[1.18]"
                      style={{ fontFamily: "var(--font-delight)" }}
                      href={resolved.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {linkText}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.id ?? idx}
                    className="block w-fit font-delight text-white hover:text-[#95E7D3] transition-colors duration-200 text-[clamp(24px,5.5vw,62px)] font-normal leading-[1.18]"
                    style={{ fontFamily: "var(--font-delight)" }}
                    href={resolved.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {linkText}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact Info */}
            <div
              className="md:hidden mt-8 pt-6 border-t border-white/10 flex flex-col gap-5 pl-4 sm:pl-6 pb-20 font-satoshi"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              <h3 className="text-white text-[16px] font-bold">Contact</h3>
              {contacts.map((c, idx) => (
                <div key={c.id ?? idx} className="flex flex-col gap-1">
                  {c.location && (
                    <p className="text-white text-[14px] font-medium">{c.location}</p>
                  )}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="text-white text-[14px] underline underline-offset-4 decoration-white/30 hover:text-[#95E7D3] transition-colors"
                    >
                      {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="text-white/80 text-[14px] underline underline-offset-4 decoration-white/30 hover:text-white transition-colors"
                    >
                      {c.email}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="absolute bottom-4 right-4 md:fixed md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:right-auto ml-0 md:ml-1 z-10000">
              <SocialLinks
                links={socialLinks}
                className="flex items-center gap-4 sm:gap-6"
                itemClassName="text-white/80 hover:text-white hover:opacity-100 transition-opacity flex items-center justify-center"
              />
            </div>
          </div>

          {/* Desktop Right Column */}
          <div className="bg-transparent pt-29.5 h-full w-full hidden md:flex flex-col items-start justify-start px-12 md:pl-24 lg:px-24 lg:pl-40 xl:pl-48 overflow-y-auto custom-menu-right">
            <div
              className="flex flex-col w-full lg:min-w-70 max-w-sm font-satoshi"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              <h3 className="text-white text-[18px] font-bold mb-5">Contact</h3>
              <div className="flex flex-col gap-6 xl:gap-7">
                {contacts.map((c, idx) => (
                  <div key={c.id ?? idx} className="flex flex-col gap-1.5">
                    <div>
                      {c.location && (
                        <p className="text-white text-[15px] font-medium tracking-wide">
                          {c.location}
                        </p>
                      )}
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="text-white text-[15px] font-normal underline underline-offset-[5px] decoration-white/40 hover:decoration-white hover:text-[#95E7D3] transition-colors block mt-1"
                        >
                          {c.phone}
                        </a>
                      )}
                    </div>
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-white/70 text-[14px] font-normal underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-colors block"
                      >
                        {c.email}
                      </a>
                    )}
                  </div>
                ))}

                <div className="relative group shrink-0 w-37.5 h-11.25 mt-2">
                  <div
                    className="absolute inset-0 bg-[#95E7D3] rounded-2xl opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
                    style={{ transform: "translate(3px, 3px)" }}
                  />
                  <a
                    className="absolute inset-0 bg-[#3145DD] text-white rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 border border-[#3145DD] transition-transform duration-300 translate-x-0 translate-y-0 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 font-satoshi cursor-pointer"
                    style={{ fontFamily: "var(--font-satoshi)" }}
                    href={ctaUrl}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{ctaText}</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}