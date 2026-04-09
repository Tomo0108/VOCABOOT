"use client";

import type { ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { CircleHelp } from "lucide-react";
import { cn, focusRingLink } from "@/lib/utils";

type HelpHintProps = {
  /** アクセシビリティ用の短いラベル */
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * ヘルプアイコンをタップすると説明が開く（Base UI Popover）
 */
export function HelpHint({ label, children, className }: HelpHintProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        type="button"
        className={cn(
          focusRingLink,
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground",
          className
        )}
      >
        <CircleHelp className="size-4" aria-hidden />
        <span className="sr-only">{label}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} className="z-[120]">
          <Popover.Popup
            className={cn(
              "max-h-[min(70vh,24rem)] max-w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border",
              "bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg outline-none ring-1 ring-foreground/10"
            )}
          >
            <div className="space-y-2">{children}</div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
