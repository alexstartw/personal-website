import { getAllPostMetas } from "@/lib/posts";
import { HomeClient } from "@/components/HomeClient";

export default function Home() {
  const allPosts = getAllPostMetas();
  // Most recent 5 posts (getAllPostMetas already sorts newest-first)
  const featuredPosts = allPosts.slice(0, 5);
  return <HomeClient featuredPosts={featuredPosts} />;
}
