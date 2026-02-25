import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Alignment AI | AI by the Slice",
  description:
    "Flat-fee AI services for Cleveland and Akron small businesses with 48-hour delivery.",
  metadataBase: new URL("https://alignment-ai.io"),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Alignment AI",
  founder: "Upton Rand",
  areaServed: ["Cleveland, OH", "Akron, OH"],
  telephone: "+1-216-200-7861",
  url: "https://alignment-ai.io/",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lakewood",
    addressRegion: "OH",
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
