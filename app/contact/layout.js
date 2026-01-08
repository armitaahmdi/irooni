export const metadata = {
  title: "تماس با ما | پوشاک ایرونی - پشتیبانی ۲۴ ساعته",
  description: "تماس با پوشاک ایرونی - فروشگاه تخصصی پوشاک مردانه. تلفن: 02833335244. ایمیل: info@irooni.com. پاسخ سریع در کمتر از ۲۴ ساعت.",
  keywords: "تماس با پوشاک ایرونی, آدرس پوشاک ایرونی, تلفن پوشاک ایرونی, پشتیبانی پوشاک ایرونی, ارتباط با فروشگاه پوشاک",
  openGraph: {
    title: "تماس با ما | پوشاک ایرونی",
    description: "ما همیشه آماده پاسخگویی به سوالات و دریافت نظرات شما هستیم",
    type: "website",
    url: "https://irooni.com/contact",
    images: [
      {
        url: "/logo/main-logo.png",
        width: 1200,
        height: 630,
        alt: "تماس با پوشاک ایرونی",
      },
    ],
  },
  alternates: {
    canonical: "https://irooni.com/contact",
  },
};

export default function ContactLayout({ children }) {
  return children;
}

