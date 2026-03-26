"use client";

import { useRouter } from "next/navigation";
import {
  House,
  BookOpen,
  Briefcase,
  FolderOpen,
  Camera,
  ArrowUp,
} from "lucide-react";
import { RadialMenu, type MenuItem } from "@/components/ui/radial-menu";

const MENU_ITEMS: MenuItem[] = [
  { id: 1, label: "Home",       icon: House,      color: "var(--muted)"  },
  { id: 2, label: "Blog",       icon: BookOpen,   color: "#fb923c"       },
  { id: 3, label: "Experience", icon: Briefcase,  color: "var(--accent)" },
  { id: 4, label: "Projects",   icon: FolderOpen, color: "#60a5fa"       },
  { id: 5, label: "Photo",      icon: Camera,     color: "#e879f9"       },
  { id: 6, label: "Top",        icon: ArrowUp,    color: "#4ade80"       },
];

export function SiteContextMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSelect = (item: MenuItem) => {
    switch (item.id) {
      case 1: router.push("/");           break;
      case 2: router.push("/blog");       break;
      case 3: router.push("/experience"); break;
      case 4: router.push("/projects");   break;
      case 5: router.push("/photo");      break;
      case 6: window.scrollTo({ top: 0, behavior: "smooth" }); break;
    }
  };

  return (
    <RadialMenu
      menuItems={MENU_ITEMS}
      size={210}
      iconSize={17}
      bandWidth={50}
      innerGap={6}
      outerGap={6}
      outerRingWidth={10}
      onSelect={handleSelect}
    >
      {children}
    </RadialMenu>
  );
}
