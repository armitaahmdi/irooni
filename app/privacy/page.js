import { Shield } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import HeroSection from "@/components/pages/HeroSection";
import ContentSection from "@/components/pages/ContentSection";
import CTASection from "@/components/pages/CTASection";
import StructuredData from "@/components/pages/StructuredData";
import { privacySections, privacyStructuredData } from "@/data/privacyData";

export const metadata = {
  title: "حریم خصوصی | پوشاک ایرونی - حفظ حریم خصوصی کاربران",
  description: "سیاست حریم خصوصی پوشاک ایرونی - نحوه جمع‌آوری، استفاده و محافظت از اطلاعات شخصی کاربران در فروشگاه اینترنتی پوشاک ایرونی.",
  keywords: "حریم خصوصی, حفظ اطلاعات, امنیت اطلاعات, سیاست حریم خصوصی, محافظت از داده, پوشاک ایرونی",
  openGraph: {
    title: "حریم خصوصی | پوشاک ایرونی",
    description: "سیاست حریم خصوصی و نحوه محافظت از اطلاعات کاربران",
    type: "website",
    url: "https://irooni.com/privacy",
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
    canonical: "https://irooni.com/privacy",
  },
};

// Enable Static Site Generation (SSG)
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function PrivacyPage() {
  return (
    <>
      <StructuredData data={privacyStructuredData} />
      
      <main className="min-h-screen bg-white">
        <Breadcrumb items={[{ label: "حریم خصوصی" }]} />

        <HeroSection
          icon={Shield}
          title="حریم خصوصی"
          description="تعهد ما به حفظ و محافظت از اطلاعات شخصی شما"
          showLastUpdate={true}
        />

        <section className="py-10 md:py-12">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-10 md:space-y-12">
              {privacySections.map((section, index) => (
                <ContentSection key={index} section={section} index={index} />
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="سوالی در مورد حریم خصوصی دارید؟"
          description="در صورت هرگونه سوال یا نگرانی در مورد حریم خصوصی و اطلاعات شخصی، با ما در تماس باشید"
          primaryButton={{
            href: "/contact",
            label: "تماس با ما"
          }}
          secondaryButton={{
            href: "/terms",
            label: "شرایط و قوانین"
          }}
        />
      </main>
    </>
  );
}
