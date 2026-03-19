import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <Navbar />
            <main>{children}</main>
            <ConditionalFooter />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
