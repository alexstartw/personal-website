import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Alex Lin — Photography",
    template: "%s | Alex Lin Photography",
  },
  description:
    "Portrait and cosplay photography by Alex Lin. Based in Taipei, Taiwan.",
};

export default function PhotoLayout({ children }: { children: ReactNode }) {
  return <div className="photo-mode">{children}</div>;
}
