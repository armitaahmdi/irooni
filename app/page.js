import HeroSliderWrapper from "@/components/HeroSliderWrapper";
import CategoryGrid from "@/components/CategoryGrid";
import SpecialOffersSlider from "@/components/SpecialOffersSlider";
import NewProductsSection from "@/components/NewProductsSection";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import StructuredData from "@/components/pages/StructuredData";

export const metadata = {
  title: "پوشاک ایرونی | فروشگاه اینترنتی لباس مردانه",
  description: "فروشگاه تخصصی پوشاک مردانه - خرید اینترنتی لباس مردانه باکیفیت شامل تیشرت، شلوار، هودی، پیراهن و استایل‌های روز",
  openGraph: {
    title: "پوشاک ایرونی | فروشگاه اینترنتی لباس مردانه",
    description: "فروشگاه تخصصی پوشاک مردانه - خرید اینترنتی لباس مردانه باکیفیت",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://irooni-men.com",
    siteName: "پوشاک ایرونی",
    images: [
      {
        url: "/logo/main-logo.png",
        width: 1200,
        height: 630,
        alt: "پوشاک ایرونی",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://irooni.com";

// Structured data for homepage
const homepageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "پوشاک ایرونی",
  "alternateName": "Irooni Clothing",
  "url": baseUrl,
  "description": "فروشگاه تخصصی پوشاک مردانه - خرید اینترنتی لباس مردانه باکیفیت",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/products?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "پوشاک ایرونی",
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo/main-logo.png`
    }
  }
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "پوشاک ایرونی",
  "url": baseUrl,
  "logo": `${baseUrl}/logo/main-logo.png`,
  "description": "فروشگاه تخصصی پوشاک مردانه با بیش از یک دهه تجربه",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "IR",
    "availableLanguage": ["Persian", "Farsi"]
  },
  "sameAs": []
};

export default function Home() {
  return (
    <>
      <StructuredData data={homepageStructuredData} />
      <StructuredData data={organizationStructuredData} />
      <main className="bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Slider */}
      <section className="pt-6 pb-8 md:pt-8 md:pb-12">
        <HeroSliderWrapper />
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <CategoryGrid />
      </section>

      {/* Special Offers */}
      <section className="py-16 md:py-20 lg:py-24">
        <SpecialOffersSlider />
      </section>

      {/* New Products */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <NewProductsSection />
      </section>

      {/* Recently Viewed Products */}
      <RecentlyViewedSection maxItems={8} />

      {/* Features */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <FeaturesSection />
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <FAQSection />
      </section>

      {/* Blog */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <BlogSection />
      </section>
    </main>
    </>
  );
}
