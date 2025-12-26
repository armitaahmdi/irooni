import { MessageSquare } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import EnhancedHeroSection from "@/components/pages/EnhancedHeroSection";
import ContactInfoCard from "@/components/pages/ContactInfoCard";
import MapPlaceholder from "@/components/pages/MapPlaceholder";
import ContactForm from "@/components/pages/ContactForm";
import StructuredData from "@/components/pages/StructuredData";
import {
  contactInfo,
  contactFeatures,
  contactStructuredData,
} from "@/data/contactData";

export const metadata = {
  title: "تماس با ما | پوشاک ایرونی - ارتباط با پشتیبانی",
  description: "تماس با پشتیبانی پوشاک ایرونی - ما همیشه آماده پاسخگویی به سوالات، دریافت نظرات و پیشنهادات شما هستیم.",
  keywords: "تماس با ما, پشتیبانی, ارتباط با فروشگاه, پوشاک ایرونی",
  openGraph: {
    title: "تماس با ما | پوشاک ایرونی",
    description: "ما همیشه آماده پاسخگویی به سوالات شما هستیم",
    type: "website",
    url: "https://irooni.com/contact",
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
    canonical: "https://irooni.com/contact",
  },
};

// This page uses SSR because it has a form (client-side interaction)
// No need to set dynamic = 'force-static'

export default function ContactPage() {
  return (
    <>
      <StructuredData data={contactStructuredData} />

      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
        <Breadcrumb items={[{ label: "تماس با ما" }]} />

        <EnhancedHeroSection
          badge={
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 inline-block ml-2" />
              ما اینجا هستیم تا به شما کمک کنیم
            </span>
          }
          title="تماس با ما"
          description="ما همیشه آماده پاسخگویی به سوالات، دریافت نظرات و پیشنهادات شما هستیم. تیم پشتیبانی ما در خدمت شماست."
        />

        {/* Features Bar */}
        <section className="py-6 bg-white border-b border-gray-100 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {contactFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <div className="text-green-500">{feature.icon}</div>
                  <span className="text-sm md:text-base font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">اطلاعات تماس</h2>
                  <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] rounded-full mb-6"></div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    برای هرگونه سوال، پیشنهاد یا انتقاد، می‌توانید از طریق فرم تماس یا اطلاعات زیر با ما در ارتباط باشید. ما در اسرع وقت پاسخ شما را خواهیم داد.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <ContactInfoCard
                      key={index}
                      icon={info.icon}
                      title={info.title}
                      content={info.content}
                      link={info.link}
                      color={info.color}
                    />
                  ))}
                </div>

                <MapPlaceholder
                  mapLink="https://maps.app.goo.gl/kxrYtYYEBtZWPtbi7"
                  addressText="آدرس ما"
                />
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">سوالات متداول</h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] mx-auto rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">چقدر طول می‌کشد تا پاسخ دریافت کنم؟</h3>
                <p className="text-gray-600">ما معمولاً در کمتر از ۲۴ ساعت به پیام‌های شما پاسخ می‌دهیم.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">آیا می‌توانم به صورت تلفنی تماس بگیرم؟</h3>
                <p className="text-gray-600">بله، می‌توانید در ساعات کاری با شماره 02833335244 تماس بگیرید.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">آیا می‌توانم از فروشگاه شما بازدید کنم؟</h3>
                <p className="text-gray-600">
                  بله، می‌توانید{" "}
                  <Link
                    href="https://maps.app.goo.gl/kxrYtYYEBtZWPtbi7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#286378] hover:underline"
                  >
                    آدرس ما را روی نقشه مشاهده کنید
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
