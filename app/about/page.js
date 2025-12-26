import { ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EnhancedHeroSection from "@/components/pages/EnhancedHeroSection";
import StatisticsSection from "@/components/pages/StatisticsSection";
import TimelineSection from "@/components/pages/TimelineSection";
import ValuesSection from "@/components/pages/ValuesSection";
import FeaturesGrid from "@/components/pages/FeaturesGrid";
import CTASection from "@/components/pages/CTASection";
import StructuredData from "@/components/pages/StructuredData";
import {
  aboutStats,
  aboutValues,
  aboutFeatures,
  aboutTimeline,
  aboutStructuredData,
} from "@/data/aboutData";

export const metadata = {
  title: "درباره ما | پوشاک ایرونی - فروشگاه تخصصی پوشاک مردانه",
  description: "پوشاک ایرونی، فروشگاه اینترنتی تخصصی پوشاک مردانه با بیش از یک دهه تجربه. خرید لباس مردانه باکیفیت شامل تیشرت، شلوار، پیراهن، کفش و استایل‌های روز با ضمانت اصالت و ارسال سریع.",
  keywords: "درباره پوشاک ایرونی, فروشگاه پوشاک مردانه, خرید لباس مردانه, تیشرت مردانه, شلوار مردانه, پوشاک ایرانی",
  openGraph: {
    title: "درباره ما | پوشاک ایرونی",
    description: "فروشگاه تخصصی پوشاک مردانه با بیش از یک دهه تجربه در ارائه بهترین کیفیت",
    type: "website",
    url: "https://irooni.com/about",
    images: [
      {
        url: "/logo/main-logo.png",
        width: 1200,
        height: 630,
        alt: "لوگو پوشاک ایرونی",
      },
    ],
  },
  alternates: {
    canonical: "https://irooni.com/about",
  },
};

// Enable Static Site Generation (SSG)
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function AboutPage() {
  return (
    <>
      <StructuredData data={aboutStructuredData} />

      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
        <Breadcrumb items={[{ label: "درباره ما" }]} />

        <EnhancedHeroSection
          badge="بیش از یک دهه تجربه"
          title="درباره پوشاک ایرونی"
          description="فروشگاه تخصصی پوشاک مردانه با بیش از یک دهه تجربه در زمینه ارائه بهترین کیفیت و استایل‌های روز. ما متعهد به رضایت شما هستیم."
          primaryButton={{
            href: "/products",
            label: "مشاهده محصولات"
          }}
          secondaryButton={{
            href: "/contact",
            label: "تماس با ما"
          }}
          imageSrc="/logo/main-logo.png"
          imageAlt="لوگو پوشاک ایرونی - فروشگاه تخصصی پوشاک مردانه"
        />

        <StatisticsSection stats={aboutStats} />

        {/* Story Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">داستان ما</h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                سفر ما از یک ایده ساده تا تبدیل شدن به یکی از معتبرترین فروشگاه‌های پوشاک مردانه
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                <strong className="text-[#286378]">پوشاک ایرونی</strong> در سال <strong>۱۳۹۰</strong> با هدف ارائه بهترین کیفیت پوشاک مردانه به مشتریان ایرانی تأسیس شد. ما از همان ابتدا بر روی کیفیت، اصالت و رضایت مشتری تمرکز کردیم و این اصول همچنان راهنمای ماست.
              </p>
              <p>
                امروز، پس از سال‌ها تجربه و اعتماد مشتریان، پوشاک ایرونی به یکی از معتبرترین فروشگاه‌های اینترنتی پوشاک مردانه در ایران تبدیل شده است. ما با ارائه طیف گسترده‌ای از محصولات شامل <strong>تیشرت</strong>، <strong>شلوار</strong>، <strong>پیراهن</strong>، <strong>کفش</strong>، <strong>هودی</strong> و استایل‌های روز، سعی داریم نیازهای مختلف مشتریان را برآورده کنیم.
              </p>
              <p>
                تیم ما متشکل از افرادی است که عاشق مد و پوشاک هستند و همیشه در تلاشند تا جدیدترین ترندها و بهترین کیفیت‌ها را به شما ارائه دهند. ما به کیفیت محصولاتمان افتخار می‌کنیم و تضمین می‌کنیم که تمام محصولات با بالاترین استانداردهای کیفیت عرضه می‌شوند.
              </p>
            </div>
          </div>
        </section>

        <TimelineSection
          title="مسیر ما"
          timeline={aboutTimeline}
        />

        <ValuesSection
          title="ارزش‌ها و اهداف ما"
          description="اصولی که راهنمای ما در ارائه بهترین خدمات به مشتریان است"
          values={aboutValues}
        />

        <FeaturesGrid
          title="چرا پوشاک ایرونی؟"
          description="مزایایی که ما را از دیگران متمایز می‌کند"
          features={aboutFeatures}
        />

        <CTASection
          title="آماده خرید هستید؟"
          description="از مجموعه گسترده محصولات ما دیدن کنید و استایل مورد علاقه خود را پیدا کنید. ما تضمین می‌کنیم که تجربه خرید رضایت‌بخشی خواهید داشت."
          primaryButton={{
            href: "/products",
            label: "مشاهده محصولات"
          }}
          secondaryButton={{
            href: "/contact",
            label: "تماس با ما"
          }}
        />
      </main>
    </>
  );
}
