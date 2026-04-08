import type { ToeicWord } from "@/lib/vocab";
import { POS_LABEL } from "@/lib/part-of-speech-labels";
import { cn } from "@/lib/utils";

type Pos = NonNullable<ToeicWord["partOfSpeech"]>;

/** 角丸正方形内の1字（国語辞典・参考書の品詞略号に近い） */
const POS_CHAR: Record<Pos, string> = {
  n: "名",
  v: "動",
  adj: "形",
  adv: "副",
  prep: "前",
  conj: "接",
  phr: "句",
};

const boxClass =
  "inline-flex aspect-square shrink-0 items-center justify-center rounded-lg border border-border/90 bg-background font-semibold leading-none tracking-tight text-foreground shadow-sm ring-1 ring-foreground/5";

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
  const dim =
    size === "sm"
      ? "h-8 min-w-8 text-sm"
      : size === "lg"
        ? "h-12 min-w-12 text-lg"
        : "h-10 min-w-10 text-base";

  const label = POS_LABEL[partOfSpeech];
  const ch = POS_CHAR[partOfSpeech];

  return (
    <span
      className={cn(boxClass, dim, className)}
      title={label}
      aria-label={label}
    >
      {ch}
    </span>
  );
}
