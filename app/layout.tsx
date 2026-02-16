import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import { Domine, Martel, Playfair_Display } from "next/font/google";
import "@/index.css";

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-domine",
  display: "swap",
});

const martel = Martel({
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-martel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ektha.info"),
  title: {
    default: "एकता (Ektha) - Digital Museum of Ancient Indian Scriptures",
    template: "%s | एकता (Ektha)",
  },
  description:
    "Discover ancient Indian texts through a modern digital library designed to make reading, exploration, and understanding more approachable and interconnected",
  keywords: [
    "Vedas",
    "Rigveda",
    "Mahabharata",
    "Ramayana",
    "Bhagavad Gita",
    "Srimad Bhagavatam",
    "Devi Mahatmyam",
    "Manu Smriti",
    "Yoga Vasishtha",
    "Sanskrit",
    "Hindi",
    "Ancient Indian Texts",
    "Hindu Scriptures",
    "Indian Philosophy",
    "Dharma",
    "Sanatan Dharma",
    "एकता",
    "वेद",
    "ऋग्वेद",
    "महाभारत",
    "रामायण",
    "भगवद्गीता",
  ],
  authors: [{ name: "Vikas Acharya", url: "https://x.com/VikasAcharyaa" }],
  creator: "Vikas Acharya",
  publisher: "Ektha",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "hi_IN",
    url: "https://ektha.info",
    siteName: "एकता (Ektha)",
    title: "एकता (Ektha) - Digital Museum of Ancient Indian Scriptures",
    description:
      "Discover ancient Indian texts through a modern digital library designed to make reading, exploration, and understanding more approachable and interconnected",
    images: [
      {
        url: "/og_home.png",
        width: 1200,
        height: 630,
        alt: "एकता (Ektha) - Ancient Indian Scriptures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VikasAcharyaa",
    creator: "@VikasAcharyaa",
    title: "एकता (Ektha) - Digital Museum of Ancient Indian Scriptures",
    description:
      "Discover ancient Indian texts through a modern digital library designed to make reading, exploration, and understanding more approachable and interconnected.",
    images: ["/og_home.png"],
  },
  alternates: {
    canonical: "https://ektha.info",
    languages: {
      "en-IN": "https://ektha.info",
      "hi-IN": "https://ektha.info",
      "sa-IN": "https://ektha.info",
    },
  },
  category: "Education",
  classification: "Religious & Spiritual",
  icons: {
    icon: [
      { url: "/favicon.png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${domine.variable} ${martel.variable} ${playfair.variable}`}
    >
      <head>
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "एकता (Ektha)",
              alternateName: ["Ektha", "Ektha Digital Library"],
              url: "https://ektha.info",
              description:
                "Digital museum of ancient Indian scriptures including Vedas, Upanishads, Puranas, and Epics.",
              inLanguage: ["en", "hi", "sa"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://ektha.info/contents?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ektha",
              alternateName: "एकता",
              url: "https://ektha.info",
              logo: "https://ektha.info/logo.png",
              sameAs: [
                "https://x.com/VikasAcharyaa",
                "https://github.com/JDhruv14/tatva",
                "https://www.linkedin.com/in/vikasacharyaa/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://ektha.info/preface",
              },
            }),
          }}
        />
        {/* Structured Data for DigitalDocument Collection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Ancient Indian Scripture Collection",
              description: "A comprehensive digital collection of ancient Indian scriptures including Rigveda, Ramayana, Mahabharata, Bhagavad Gita, and more.",
              url: "https://tatva.info/contents",
              isPartOf: {
                "@type": "WebSite",
                name: "Ektha",
                url: "https://ektha.info",
              },
              about: {
                "@type": "Thing",
                name: "Hindu Scriptures",
                description: "Sacred texts of Hinduism and Sanatan Dharma",
              },
              keywords: "Vedas, Rigveda, Mahabharata, Ramayana, Bhagavad Gita, Sanskrit, Hindu Scriptures, Sanatan Dharma",
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}







