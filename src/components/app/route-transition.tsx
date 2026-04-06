"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="motion-reduce:animate-none animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out"
    >
      {children}
    </div>
  );
}

