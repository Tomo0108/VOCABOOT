"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/** `globals.css` の :root / .dark に近いブラウザUI用（viewport のメディアクエリと併用） */
const META_LIGHT = "#ffffff";
const META_DARK = "#0a0a0a";

export function ThemeColorMetaSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const content = resolvedTheme === "dark" ? META_DARK : META_LIGHT;
    let el = document.querySelector(
      'meta[name="theme-color"][data-vocaboost-sync]'
    ) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "theme-color");
      el.setAttribute("data-vocaboost-sync", "1");
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }, [resolvedTheme]);

  return null;
}
