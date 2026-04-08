import type { ToeicWord } from "@/lib/vocab";
import { POS_LABEL } from "@/lib/part-of-speech-labels";
import { cn } from "@/lib/utils";

type Pos = NonNullable<ToeicWord["partOfSpeech"]>;

/** 名詞は国語辞典風に「名」を四角枠で表示 */
const nounBoxClass =
  "inline-flex aspect-square shrink-0 items-center justify-center rounded-[2px] border border-border bg-background font-semibold leading-none text-foreground shadow-sm";

export function PartOfSpeechDisplay({
  partOfSpeech,
  className,
  size = "md",
}: {
  partOfSpeech: Pos;
  className?: string;
  /** sm=解説内、md=問題カード、lg=単語詳細 */
  size?: "sm" | "md" | "lg";
}) {
  const boxSize =
    size === "sm"
      ? "h-4 min-w-4 text-[9px]"
      : size === "lg"
        ? "h-6 min-w-6 text-[11px]"
        : "h-5 min-w-5 text-[10px]";

  if (partOfSpeech === "n") {
    return (
      <span
        className={cn(nounBoxClass, boxSize, className)}
        title="名詞"
        aria-label="名詞"
      >
        名
      </span>
    );
  }

  const label = POS_LABEL[partOfSpeech];
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <span className={cn("text-muted-foreground", textSize, className)} title={label}>
      {label}
    </span>
  );
}
