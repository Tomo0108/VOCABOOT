import { cn } from "@/lib/utils";
import { VOCABOOT_TARGET_LABEL } from "@/lib/product";

/** 全画面で共通の「目標」表示（TOEIC 800点ウォーターフォール） */
export function GoalPill({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex w-fit max-w-full items-center rounded-full border border-primary/40 bg-primary/12 px-3 py-1.5 text-[11px] font-semibold leading-none tracking-wide text-primary sm:text-xs",
        className
      )}
    >
      <span className="text-primary/80">目標</span>
      <span className="mx-1.5 text-primary/50" aria-hidden>
        ·
      </span>
      <span>{VOCABOOT_TARGET_LABEL}</span>
    </p>
  );
}
