import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import AuditBarModal from "@/components/shared/AuditBarModal";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { getHomePage } from "@/services/page";
import { getBrands } from "@/services/brand";
import { HeroSection } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: "Thumbstack",
    };
  }

  return {
    title: `${page.title} | Thumbstack`,
    description: page.title,
  };
}

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

  const heroSection = sections.find(
    (section): section is HeroSection => section.__component === "sections.hero"
  );

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen overflow-x-hidden bg-white">
        <SectionRenderer sections={sections} brands={brands} />
        {!hasFooter && <Footer />}
      </main>
      <AuditBarModal
        data={page.auditBar}
        fallbackForm={heroSection?.leadForm}
      />
    </>
  );
}