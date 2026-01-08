"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import SizeGuideHero from "@/components/size-guide/SizeGuideHero";
import SizeGuideCategories from "@/components/size-guide/SizeGuideCategories";
import SizeGuideTable from "@/components/size-guide/SizeGuideTable";
import SizeGuideTips from "@/components/size-guide/SizeGuideTips";
import SizeGuideMeasurementSteps from "@/components/size-guide/SizeGuideMeasurementSteps";
import SizeGuideCTA from "@/components/size-guide/SizeGuideCTA";
import { sizeGuides } from "@/data/sizeGuideData";

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "راهنمای سایز پوشاک ایرونی",
  description: "راهنمای کامل سایز و اندازه لباس مردانه",
  url: "https://irooni.com/size-guide",
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "چگونه سایز مناسب را انتخاب کنم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "برای انتخاب سایز مناسب، ابتدا قسمت‌های مختلف بدن خود را با متر اندازه‌گیری کنید و سپس با جدول سایز مقایسه کنید.",
        },
      },
      {
        "@type": "Question",
        name: "اگر سایز من بین دو سایز بود چه کنم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "در صورت قرار گرفتن بین دو سایز، توصیه می‌شود سایز بزرگ‌تر را انتخاب کنید تا راحتی بیشتری داشته باشید.",
        },
      },
    ],
  },
};

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState("tshirt");
  const currentGuide = sizeGuides[activeCategory];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Breadcrumb items={[{ label: "راهنمای سایز" }]} />

        <SizeGuideHero />

        <SizeGuideCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <SizeGuideTable guide={currentGuide} />

        <SizeGuideTips />

        <SizeGuideMeasurementSteps />

        <SizeGuideCTA />
      </main>
    </>
  );
}
