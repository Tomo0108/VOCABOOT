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

/**
 * 補足説明用。角枠の小さな「i」ボタンで Popover を開く。
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
              "max-h-[min(70vh,26rem)] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border/80",
              "bg-popover p-3.5 text-xs leading-relaxed text-popover-foreground shadow-md outline-none",
              "ring-1 ring-black/5 dark:ring-white/10"
            )}
          >
            <div className="space-y-2.5 [&_p]:text-popover-foreground/95">{children}</div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
