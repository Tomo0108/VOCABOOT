"use client";

import type { ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { Info } from "lucide-react";
import { cn, focusRingLink } from "@/lib/utils";

type HelpHintProps = {
  /** アクセシビリティ用の短いラベル */
  label: string;
  children: ReactNode;
  className?: string;
};

export type HelpSectionProps = {
  /** 論点の見出し */
  title: string;
  children: ReactNode;
  /** 注意書き（囲みで弱めのトーン） */
  note?: ReactNode;
  className?: string;
};

const bodyTypography = cn(
  "text-[0.8125rem] leading-[1.72] text-popover-foreground/85",
  "[&_p]:m-0",
  "[&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:py-0",
  "[&_li]:relative [&_li]:pl-3.5 [&_li]:text-[0.8125rem] [&_li]:leading-[1.72] [&_li]:text-popover-foreground/85",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-primary/55 [&_li]:before:content-['']",
  "[&_strong]:font-semibold [&_strong]:text-popover-foreground/92"
);

/**
 * ヘルプ本文を論点ごとに区切る。見出し＋本文（＋任意の注記）。
 */
export function HelpSection({ title, children, note, className }: HelpSectionProps) {
  return (
    <section
      className={cn(
        "scroll-mt-1 border-t border-border/40 pt-4 first:border-t-0 first:pt-0",
        className
      )}
    >
      <h3 className="mb-2.5 flex items-start gap-2.5">
        <span
          className="mt-[0.35em] h-2 w-0.5 shrink-0 rounded-full bg-primary/70"
          aria-hidden
        />
        <span className="min-w-0 text-[0.8125rem] font-semibold leading-snug tracking-tight text-popover-foreground">
          {title}
        </span>
      </h3>
      <div className={cn("space-y-2 pl-3", bodyTypography)}>{children}</div>
      {note != null ? (
        <div
          className={cn(
            "mt-3 rounded-lg border border-border/55 bg-muted/40 px-3 py-2.5",
            "text-[0.6875rem] leading-[1.65] text-muted-foreground"
          )}
          role="note"
        >
          {note}
        </div>
      ) : null}
    </section>
  );
}

/**
 * 補足説明用。コンパクトな「i」ボタンで Popover を開く。
 * 本文は {@link HelpSection} で区切ると読みやすい。
 */
export function HelpHint({ label, children, className }: HelpHintProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        type="button"
        className={cn(
          focusRingLink,
          "inline-flex size-7 shrink-0 items-center justify-center rounded-lg",
          "border border-border/60 bg-muted/35 text-muted-foreground",
          "transition-[color,background-color,border-color,transform] duration-150",
          "hover:border-border hover:bg-muted/55 hover:text-foreground",
          "active:scale-[0.96]",
          className
        )}
      >
        <Info className="size-3.5 opacity-95" strokeWidth={2} aria-hidden />
        <span className="sr-only">{label}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} className="z-[120]">
          <Popover.Popup
            className={cn(
              "max-h-[min(78vh,30rem)] max-w-[min(22.5rem,calc(100vw-1.75rem))] overflow-hidden",
              "rounded-2xl border border-border/65 bg-popover text-popover-foreground",
              "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.22),0_4px_16px_-4px_rgba(0,0,0,0.1)]",
              "dark:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.55),0_4px_20px_-4px_rgba(0,0,0,0.35)]",
              "outline-none ring-1 ring-black/[0.04] dark:ring-white/[0.08]"
            )}
          >
            <div
              className={cn(
                "max-h-[min(78vh,30rem)] overflow-y-auto overscroll-contain px-5 py-4",
                "[scrollbar-gutter:stable]"
              )}
            >
              <div className="flex flex-col gap-0">{children}</div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
