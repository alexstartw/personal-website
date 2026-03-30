"use client";

import { useLanguage } from "@/context/LanguageContext";

type Category = "portrait" | "coser";

export function GalleryPageHeader({ category }: { category: Category }) {
  const { t } = useLanguage();
  const label = category === "portrait" ? t.photo.portrait : t.photo.coser;

  return (
    <div className="mb-10">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] mb-2">
        {t.photo.gallery_label}
      </p>
      <h1 className="text-4xl font-light text-[var(--foreground)]">{label}</h1>
    </div>
  );
}
