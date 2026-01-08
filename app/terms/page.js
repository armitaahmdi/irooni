import { FileText } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import HeroSection from "@/components/pages/HeroSection";
import ContentSection from "@/components/pages/ContentSection";
import CTASection from "@/components/pages/CTASection";
import StructuredData from "@/components/pages/StructuredData";
import { termsSections, termsStructuredData } from "@/data/termsData";

export const metadata = {
  title: "شرایط و قوانین | پوشاک ایرونی - قوانین خرید و استفاده",
  description: "شرایط و قوانین خرید از فروشگاه پوشاک ایرونی شامل قوانین خرید، ارسال، بازگشت کالا، پرداخت و ضمانت اصالت محصولات.",
  keywords: "شرایط و قوانین, قوانین خرید, قوانین فروشگاه, بازگشت کالا, ضمانت محصول, پوشاک ایرونی",
  openGraph: {
    title: "شرایط و قوانین | پوشاک ایرونی",
    description: "قوانین و مقررات خرید از فروشگاه اینترنتی پوشاک ایرونی",
    type: "website",
    url: "https://irooni.com/terms",
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
    canonical: "https://irooni.com/terms",
  },
};

// Enable Static Site Generation (SSG)
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function TermsPage() {
  return (
    <>
      <StructuredData data={termsStructuredData} />
      
      <main className="min-h-screen bg-white">
        <Breadcrumb items={[{ label: "شرایط و قوانین" }]} />

        <HeroSection
          icon={FileText}
          title="شرایط و قوانین"
          description="قوانین و مقررات خرید از فروشگاه اینترنتی پوشاک ایرونی"
          showLastUpdate={true}
        />

        <section className="py-10 md:py-12">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-10 md:space-y-12">
              {termsSections.map((section, index) => (
                <ContentSection key={index} section={section} index={index} />
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="سوالی دارید؟"
          description="در صورت هرگونه سوال یا ابهام در مورد قوانین و مقررات، با ما در تماس باشید"
          primaryButton={{
            href: "/contact",
            label: "تماس با ما"
          }}
          secondaryButton={{
            href: "/",
            label: "بازگشت به صفحه اصلی"
          }}
        />
      </main>
    </>
  );
}
