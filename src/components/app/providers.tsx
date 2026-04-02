"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ThemeColorMetaSync } from "@/components/app/theme-color-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColorMetaSync />
      {children}
    </ThemeProvider>
  );
}
