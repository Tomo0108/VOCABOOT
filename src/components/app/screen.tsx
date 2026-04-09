"use client";

import type { ReactNode } from "react";
import { cn, focusRingLink } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function Screen({
  title,
  subtitle,
  titleHelp,
  icon,
  right,
  backHref,
  renderBack,
  children,
}: {
  title: string;
  subtitle?: string;
  /** タイトル横のヘルプ（? マークなど） */
  titleHelp?: ReactNode;
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

  const hasVisibleTitle = title.trim().length > 0;

  return (
    <div className="space-y-4">
      <header className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {backControl ? (
              <span className="inline-flex shrink-0">{backControl}</span>
            ) : null}
            {icon ? (
              <span
                className="inline-flex shrink-0 items-center justify-center text-primary"
                aria-hidden
              >
                {icon}
              </span>
            ) : null}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h1
                className={cn(
                  "min-w-0 flex-1 truncate text-xl font-semibold tracking-tight text-foreground",
                  !hasVisibleTitle && "sr-only"
                )}
              >
                {hasVisibleTitle ? title : "学習"}
              </h1>
              {titleHelp ? (
                <span className="inline-flex shrink-0 items-center self-center">{titleHelp}</span>
              ) : null}
            </div>
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
