import { getAllPostMetas } from "@/lib/posts";
import { HomeClient } from "@/components/HomeClient";

export default function Home() {
  const allPosts = getAllPostMetas();
  const featuredPosts = allPosts.filter((p) => p.cover).slice(0, 5);
  return <HomeClient featuredPosts={featuredPosts} />;
}
