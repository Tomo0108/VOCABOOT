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
  /** 指定時は戻るを独自描画（離脱確認など） */
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
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card",
          "text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        )}
        aria-label="戻る"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
    ) : null);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {backControl}
              <div
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm"
                )}
                aria-hidden
              >
                {icon}
              </div>
              <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
            </div>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </header>
      {children}
    </div>
  );
}

