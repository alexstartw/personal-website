import type { Metadata } from "next";
import { Instrument_Serif, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteModeProvider } from "@/context/SiteModeContext";
import { FontSizeProvider } from "@/context/FontSizeContext";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ModeTransitionOverlay } from "@/components/ui/ModeTransitionOverlay";
import { SettingsBubble } from "@/components/ui/SettingsBubble";
import { SiteContextMenu } from "@/components/ui/SiteContextMenu";
import { HtmlLangSetter } from "@/components/ui/HtmlLangSetter";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["600", "700"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-stat",
  display: "swap",
});

const BASE = "https://alexstartw.github.io/personal-website";

export const metadata: Metadata = {
  metadataBase: new URL("https://alexstartw.github.io"),
  title: {
    default: "Li-Yu Alex Lin — Senior Data Engineer",
    template: "%s | Alex Lin",
  },
  description:
    "Senior Data Engineer with 5+ years specializing in cloud-native data platforms, event-driven architectures, and GenAI applications. Based in Taipei, Taiwan.",
  keywords: [
    "Senior Data Engineer",
    "Data Engineer",
    "GenAI",
    "RAG",
    "Cloud Native",
    "Apache Airflow",
    "dbt",
    "Microsoft Fabric",
    "Python",
    "Taipei",
    "Taiwan",
  ],
  authors: [{ name: "Li-Yu Alex Lin", url: BASE }],
  creator: "Li-Yu Alex Lin",
  alternates: { canonical: BASE },
  verification: { google: "x1YedV3TQvFG1cVoPLag-3WuTluEVuKeiufahzBYgRY" },
  openGraph: {
    title: "Li-Yu Alex Lin — Senior Data Engineer",
    description:
      "Senior Data Engineer specializing in cloud-native data platforms, GenAI applications, and scalable data infrastructure.",
    url: BASE,
    siteName: "Alex Lin",
    type: "website",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title: "Li-Yu Alex Lin — Senior Data Engineer",
    description:
      "Senior Data Engineer specializing in cloud-native data platforms, GenAI applications, and scalable data infrastructure.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Li-Yu Alex Lin",
  alternateName: ["Alex Lin", "林力宇"],
  url: BASE,
  jobTitle: "Senior Data Engineer",
  worksFor: { "@type": "Organization", name: "Datarget" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Taipei",
    addressCountry: "TW",
  },
  sameAs: [
    "https://github.com/alexstartw",
    "https://www.instagram.com/yu_._photographer/",
  ],
  knowsAbout: [
    "Data Engineering",
    "Python",
    "Apache Airflow",
    "dbt",
    "Microsoft Fabric",
    "GenAI",
    "RAG",
    "Cloud Native",
    "Event-driven Architecture",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-TW"
      className={`${instrumentSerif.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <LanguageProvider>
            <FontSizeProvider>
              <SiteModeProvider>
                <HtmlLangSetter />
                <ModeTransitionOverlay />
                <Navbar />
                <SiteContextMenu>
                  <main>{children}</main>
                </SiteContextMenu>
                <ConditionalFooter />
                <SettingsBubble />
              </SiteModeProvider>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
