import Link from "next/link";

/**
 * ContactInfoCard Component
 * Reusable component for displaying contact information cards
 */
export default function ContactInfoCard({ icon, title, content, link, color }) {
  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#286378]/30 transform hover:-translate-y-1">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {link ? (
        <Link
          href={link}
          className="text-gray-600 hover:text-[#286378] transition-colors text-lg font-medium"
        >
          {content}
        </Link>
      ) : (
        <p className="text-gray-600 text-lg">{content}</p>
      )}
    </div>
  );
}

