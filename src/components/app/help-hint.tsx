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
  /** 注意書き（小さめ・控えめ） */
  note?: ReactNode;
  className?: string;
};

/**
 * ヘルプ本文を論点ごとに区切る。見出し＋本文（＋任意の注記）。
 */
export function HelpSection({ title, children, note, className }: HelpSectionProps) {
  return (
    <section
      className={cn(
        "space-y-2 border-t border-border/50 pt-3.5 first:border-t-0 first:pt-0",
        className
      )}
    >
      <h3 className="text-sm font-semibold leading-snug tracking-tight text-popover-foreground">
        {title}
      </h3>
      <div className="space-y-2 text-[0.8125rem] leading-[1.6] text-popover-foreground/88 [&_p]:m-0">
        {children}
      </div>
      {note != null ? (
        <div className="mt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">{note}</div>
      ) : null}
    </section>
  );
}

/**
 * 補足説明用。角枠の小さな「i」ボタンで Popover を開く。
 * 本文は {@link HelpSection} で区切ると読みやすい。
 */
export function HelpHint({ label, children, className }: HelpHintProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        type="button"
        className={cn(
          focusRingLink,
          "inline-flex size-6 shrink-0 items-center justify-center rounded-md",
          "border border-border/70 bg-muted/40 text-muted-foreground",
          "transition-[color,background-color,border-color,box-shadow] hover:border-border hover:bg-muted/70 hover:text-foreground",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
          className
        )}
      >
        <Info className="size-3.5 opacity-90" strokeWidth={2} aria-hidden />
        <span className="sr-only">{label}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} className="z-[120]">
          <Popover.Popup
            className={cn(
              "max-h-[min(75vh,28rem)] max-w-[min(24rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-xl border border-border/80",
              "bg-popover px-4 py-4 text-popover-foreground shadow-md outline-none",
              "ring-1 ring-black/5 dark:ring-white/10"
            )}
          >
            <div className="flex flex-col gap-0">{children}</div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
