/**
 * StructuredData Component
 * Reusable component for adding JSON-LD structured data to pages
 */
export default function StructuredData({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

