"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

// VS Code–style pages use h-screen overflow-hidden — footer is unreachable there
const HIDE_ON = ["/experience", "/blog", "/projects"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const hidden =
    pathname === "/" ||
    HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (hidden) return null;
  return <Footer />;
}
