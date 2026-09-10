import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import AuditBar from "@/components/shared/AuditBar";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { getAllPages, getPageBySlug } from "@/services/page";
import { getBrands } from "@/services/brand";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter((page) => Boolean(page.slug) && page.slug !== "home")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | Thumbstack",
    };
  }

  return {
    title: `${page.title} | Thumbstack`,
    description: page.title,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const [page, brands] = await Promise.all([
    getPageBySlug(slug),
    getBrands().catch(() => []),
  ]);

  if (!page) {
    notFound();
  }

  const sections = page.sections || [];
  const hasFooter = sections.some(
    (section) => section.__component === "sections.footer"
  );

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen overflow-x-hidden bg-white">
        <SectionRenderer sections={sections} brands={brands} />
        {!hasFooter && <Footer />}
      </main>
      <AuditBar />
    </>
  );
}
