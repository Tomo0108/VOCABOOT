"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { splitExampleAroundTerm } from "@/lib/example-svoc";
import type { ToeicWord } from "@/lib/vocab";
import {
  difficultyLabel,
  getWordCategoryLabel,
  getWordDifficulty,
} from "@/lib/word-meta";
import { POS_LABEL } from "@/lib/part-of-speech-labels";
import { Volume2 } from "lucide-react";

function speakEnglish(term: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(term);
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
}

export function WordDetailPanel({
  word,
  className,
}: {
  word: ToeicWord;
  className?: string;
}) {
  const correctMeaning = word.meaningJa?.trim() || "—";
  const ex = splitExampleAroundTerm(
    word.exampleEn ?? "",
    word.term,
    word.partOfSpeech
  );
  const d = getWordDifficulty(word);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-normal">
          {getWordCategoryLabel(word)}
        </Badge>
        <Badge variant="outline" className="font-normal tabular-nums">
          難易度 {d}（{difficultyLabel(d)}）
        </Badge>
        {word.tags && word.tags.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            {word.tags.join(" · ")}
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="break-words text-3xl font-semibold tracking-tight text-foreground">
            {word.term}
          </h1>
          {word.partOfSpeech ? (
            <p className="text-sm text-muted-foreground">
              {POS_LABEL[word.partOfSpeech] ?? word.partOfSpeech}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-xl"
          aria-label="英語を読み上げ"
          onClick={() => speakEnglish(word.term)}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm">
        <p className="text-xs font-medium text-muted-foreground">和訳</p>
        <p className="font-medium text-foreground">{correctMeaning}</p>
      </div>

      {word.exampleEn ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">例文（英語）</p>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {ex.found ? (
              <>
                {ex.before}
                <mark
                  className={cn(
                    "rounded-md px-1 py-0.5 font-semibold",
                    "bg-amber-400/35 text-amber-950 dark:bg-amber-400/25 dark:text-amber-50"
                  )}
                >
                  {ex.match}
                </mark>
                {ex.after}
              </>
            ) : (
              word.exampleEn
            )}
          </p>
          {word.exampleJa ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{word.exampleJa}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">この語には例文が登録されていません。</p>
      )}
    </div>
  );
}
