import HeroSliderWrapper from "@/components/HeroSliderWrapper";
import CategoryGrid from "@/components/CategoryGrid";
import SpecialOffersSlider from "@/components/SpecialOffersSlider";
import NewProductsSection from "@/components/NewProductsSection";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";

export const metadata = {
  title: "پوشاک ایرونی | فروشگاه اینترنتی لباس مردانه",
  description: "فروشگاه تخصصی پوشاک مردانه - خرید اینترنتی لباس مردانه باکیفیت شامل تیشرت، شلوار، هودی، پیراهن و استایل‌های روز",
};

export default function Home() {
  return (
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
  );
}
