"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function HtmlLangSetter() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-TW" : "en";
  }, [lang]);
  return null;
}
