import type { Metadata } from "next";
import { Instrument_Serif, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteModeProvider } from "@/context/SiteModeContext";
import { FontSizeProvider } from "@/context/FontSizeContext";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ModeTransitionOverlay } from "@/components/ui/ModeTransitionOverlay";
import { RadialMenu } from "@/components/ui/RadialMenu";
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

export const metadata: Metadata = {
  title: {
    default: "Li-Yu Alex Lin — Senior Data Engineer",
    template: "%s | Alex Lin",
  },
  description:
    "Senior Data Engineer specializing in cloud-native data platforms, GenAI applications, and scalable data infrastructure. Based in Taipei, Taiwan.",
  openGraph: {
    title: "Li-Yu Alex Lin — Senior Data Engineer",
    description:
      "Senior Data Engineer specializing in cloud-native data platforms, GenAI applications, and scalable data infrastructure.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <LanguageProvider>
            <FontSizeProvider>
              <SiteModeProvider>
                <ModeTransitionOverlay />
                <Navbar />
                <main>{children}</main>
                <ConditionalFooter />
                <RadialMenu />
              </SiteModeProvider>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
