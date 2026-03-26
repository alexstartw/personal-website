import type { Metadata } from "next";
import { getAllPostMetas } from "@/lib/posts";
import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: {
    absolute: "Li-Yu Alex Lin — Senior Data Engineer",
  },
  description:
    "Senior Data Engineer with 5+ years specializing in cloud-native data platforms, event-driven architectures, and GenAI applications. Based in Taipei, Taiwan.",
  keywords: [
    "Data Engineer",
    "Senior Data Engineer",
    "GenAI",
    "Cloud Native",
    "Apache Airflow",
    "dbt",
    "Microsoft Fabric",
    "Python",
    "Taipei",
  ],
  openGraph: {
    title: "Li-Yu Alex Lin — Senior Data Engineer",
    description:
      "Senior Data Engineer specializing in cloud-native data platforms, GenAI applications, and scalable data infrastructure.",
    type: "website",
    locale: "zh_TW",
  },
};

export default function Home() {
  const allPosts = getAllPostMetas();
  // Most recent 5 posts (getAllPostMetas already sorts newest-first)
  const featuredPosts = allPosts.slice(0, 5);
  return <HomeClient featuredPosts={featuredPosts} />;
}
