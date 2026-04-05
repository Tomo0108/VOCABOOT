"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Screen } from "@/components/app/screen";
import { WordDetailPanel } from "@/components/app/word-detail-panel";
import type { ToeicWord } from "@/lib/vocab";
import { BookOpen } from "lucide-react";
import { cn, focusRingLink } from "@/lib/utils";

export default function WordDetailClient({ word }: { word: ToeicWord }) {
  return (
    <Screen
      title="単語"
      subtitle={word.term}
      icon={<BookOpen className="h-5 w-5" />}
      backHref="/words"
    >
      <Card className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <CardContent className="p-5 pt-6">
          <WordDetailPanel word={word} />
        </CardContent>
      </Card>
      <Link
        href="/words"
        className={cn(
          focusRingLink,
          "inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border/60 bg-background text-sm font-medium",
          "transition-colors hover:bg-muted/80"
        )}
      >
        一覧に戻る
      </Link>
    </Screen>
  );
}
