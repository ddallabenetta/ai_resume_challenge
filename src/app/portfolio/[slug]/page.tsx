import { storage } from "@/lib/storage";
import { PortfolioInterface } from "@/components/portfolio/portfolio-interface";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}
// params is a promise in Next.js 15, but usually direct object in 14 unless dynamic IO.
// However Next.js 14 App Router params are standard objects.
// Wait, in latest Next.js canary params might be promises. But user asked for Next.js 14.
// I'll assume standard params.

export default async function PortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await storage.getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <PortfolioInterface portfolio={portfolio} />
    </main>
  );
}
