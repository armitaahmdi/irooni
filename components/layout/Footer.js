import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Store,
  Info,
  Mail,
  BookOpen,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-32 bg-gradient-to-b from-transparent to-gray-50">
      
      {/* Glass Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#286378]/20 via-[#3A7A85]/15 to-[#43909A]/20 border border-[#286378]/30 rounded-3xl px-6 sm:px-10 py-14 shadow-lg">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* About */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logo/main-logo.png"
                  width={48}
                  height={48}
                  alt="پوشاک ایرونی"
                  className="rounded-xl"
                  unoptimized
                />
                <h3 className="text-lg font-semibold">پوشاک ایرونی</h3>
              </div>

              <p className="text-sm leading-7 text-gray-700">
                فروشگاه تخصصی پوشاک مردانه با تمرکز بر طراحی نرم،
                کیفیت بالا و تجربه خرید آرام و مطمئن.
              </p>
            </section>

            {/* Store */}
            <nav>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                فروشگاه
              </h4>
              <ul className="space-y-3">
                {["تیشرت", "شلوار", "پیراهن", "کفش"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-700 hover:text-[#286378] transition hover:translate-x-0.5 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Blog */}
            <nav>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                مجله ایرونی
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="hover:text-[#286378] transition-colors cursor-pointer">راهنمای استایل</li>
                <li className="hover:text-[#286378] transition-colors cursor-pointer">ترندهای مردانه</li>
                <li className="hover:text-[#286378] transition-colors cursor-pointer">نکات خرید</li>
              </ul>
            </nav>

            {/* Contact */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                تماس با ما
              </h4>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-[#286378] mt-0.5 flex-shrink-0" />
                  <span>قزوین، خیام شمالی</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone size={16} className="text-[#286378] flex-shrink-0" />
                  <span>02833335244</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail size={16} className="text-[#286378] flex-shrink-0" />
                  <span>info@irooni.com</span>
                </div>
              </div>
            </section>

          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-[#286378]/20 flex flex-col sm:flex-row gap-4 justify-between text-xs text-gray-600">
            <span>© {new Date().getFullYear()} پوشاک ایرونی. تمامی حقوق محفوظ است.</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
