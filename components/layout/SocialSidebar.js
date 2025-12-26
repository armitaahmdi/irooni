"use client";

import { useState } from "react";
import { Instagram, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export default function SocialSidebar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const socialLinks = [
    {
      id: "instagram",
      name: "اینستاگرام",
      icon: Instagram,
      href: "https://instagram.com",
      color: "from-pink-500 to-purple-600",
      hoverColor: "hover:from-pink-600 hover:to-purple-700",
    },
    {
      id: "whatsapp",
      name: "واتساپ",
      icon: MessageCircle,
      href: "https://wa.me",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      id: "telegram",
      name: "تلگرام",
      icon: Send,
      href: "https://t.me",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-3">
        {socialLinks.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group relative flex items-center overflow-hidden"
            >
              {/* بکگراند با آیکون و متن */}
              <div
                className={`h-10 rounded-l-2xl bg-gradient-to-br ${item.color} ${item.hoverColor} flex items-center text-white shadow-lg transition-all duration-300 ${
                  isHovered ? "w-32 pr-3" : "w-10"
                }`}
              >
                {/* آیکون */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>

                {/* متن */}
                <span
                  className={`whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                    isHovered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

