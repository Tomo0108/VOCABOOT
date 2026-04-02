"use client";

import type { ReactNode } from "react";
import { cn, focusRingLink } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function Screen({
  title,
  subtitle,
  icon,
  right,
  backHref,
  renderBack,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  backHref?: string;
  renderBack?: ReactNode;
  children: ReactNode;
}) {
  const backControl =
    renderBack ??
    (backHref ? (
      <Link
        href={backHref}
        className={cn(
          focusRingLink,
          "inline-flex h-10 w-10 items-center justify-center rounded-xl",
          "text-muted-foreground transition-colors hover:text-foreground active:bg-muted/60"
        )}
        aria-label="戻る"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
    ) : null);

  return (
    <div className="space-y-4">
      <header className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {backControl}
            <span className="text-primary" aria-hidden>
              {icon}
            </span>
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
