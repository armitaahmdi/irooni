import { MapPin, Phone, Mail, Clock, CheckCircle, MessageSquare } from "lucide-react";

export const contactInfo = [
  {
    icon: <MapPin className="w-7 h-7" />,
    title: "آدرس",
    content: "مشاهده روی نقشه",
    link: "https://maps.app.goo.gl/kxrYtYYEBtZWPtbi7",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Phone className="w-7 h-7" />,
    title: "تلفن",
    content: "02833335244",
    link: "tel:+982833335244",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <Mail className="w-7 h-7" />,
    title: "ایمیل",
    content: "info@irooni.com",
    link: "mailto:info@irooni.com",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "ساعات کاری",
    content: "شنبه تا پنجشنبه: ۹ صبح تا ۹ شب",
    link: null,
    color: "from-orange-500 to-red-600",
  },
];

export const contactFeatures = [
  {
    icon: <CheckCircle className="w-5 h-5" />,
    text: "پاسخ سریع در کمتر از ۲۴ ساعت",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    text: "پشتیبانی ۲۴ ساعته",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    text: "ضمانت رضایت شما",
  },
];

export const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "پوشاک ایرونی",
    "url": "https://irooni.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+982833335244",
      "contactType": "customer service",
      "email": "info@irooni.com",
      "areaServed": "IR",
      "availableLanguage": ["Persian", "Farsi"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "21:00",
      },
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "مشاهده روی نقشه",
      "addressLocality": "قزوین",
      "addressRegion": "قزوین",
      "addressCountry": "IR",
    },
  },
};

