import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import AuditBarModal from "@/components/shared/AuditBarModal";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { getHomePage } from "@/services/page";
import { getBrands } from "@/services/brand";
import { HeroSection, AuditBarData, SharedButtonSection, NavbarSection } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thumbstack - Lead Magnet",
  description: "Lead Magnet Platform",
};

export default async function Home() {
  const [page, brands] = await Promise.all([
    getHomePage(),
    getBrands().catch(() => []),
  ]);

  if (!page) {
    notFound();
  }

  const sections = page.sections || [];
  const hasFooter = sections.some(
    (section) => section.__component === "sections.footer"
  );

  const navbarSection = sections.find(
    (section): section is NavbarSection =>
      section.__component === "sections.navbar"
  );

  const heroSection = sections.find(
    (section): section is HeroSection => section.__component === "sections.hero"
  );

  const auditBarSection = sections.find(
    (section) => section.__component === "shared.audit-bar"
  ) as AuditBarData | undefined;

  const sharedButtonSection = sections.find(
    (section): section is SharedButtonSection =>
      section.__component === "shared.button"
  );

  return (
    <>
      <Navbar data={navbarSection} />
      <main className="w-full min-h-screen overflow-x-hidden bg-white">
        <SectionRenderer sections={sections} brands={brands} />
        {!hasFooter && <Footer />}
      </main>
      <AuditBarModal
        data={
          auditBarSection ||
          (sharedButtonSection
            ? {
                primaryButtonText: sharedButtonSection.text,
                secondaryButtonUrl: sharedButtonSection.url,
              }
            : page.auditBar)
        }
        fallbackForm={heroSection?.leadForm}
      />
    </>
  );
}