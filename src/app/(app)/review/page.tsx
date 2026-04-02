"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn, focusRingLink } from "@/lib/utils";
import { Screen } from "@/components/app/screen";
import { getHomeStats } from "@/lib/progress";
import { Clock, RotateCcw, Sparkles } from "lucide-react";

export default function ReviewPage() {
  const [due, setDue] = useState<number | null>(null);
  const [dueLoading, setDueLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await getHomeStats();
      if (!cancelled) {
        setDue(s.dueCount);
        setDueLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reviewN = due != null ? Math.min(Math.max(due, 1), 30) : 20;
  const hasDue = !dueLoading && due != null && due > 0;

  return (
    <Screen
      title="復習"
      subtitle="期限が来た語を優先して出します。"
      icon={<Clock className="h-5 w-5" />}
    >
      <Card className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">復習予定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">復習待ちの語</span>
            <span
              className="font-semibold tabular-nums text-foreground"
              aria-busy={dueLoading}
            >
              {dueLoading ? (
                <span className="inline-block h-4 w-12 animate-pulse rounded bg-muted" />
              ) : due == null ? (
                "—"
              ) : (
                `${due} 語`
              )}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {hasDue
              ? "まとめて最大30語まで復習できます。"
              : "復習待ちの語はありません。学習タブから新しい語を進めましょう。"}
          </p>
          {hasDue ? (
            <Link
              href={`/study/session?mode=review&n=${reviewN}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                focusRingLink,
                "h-14 w-full rounded-2xl shadow-sm transition-colors"
              )}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
              復習を始める（{Math.min(reviewN, due ?? reviewN)} 語）
            </Link>
          ) : (
            <Link
              href="/study/session?mode=mix&n=10&offset=0"
              className={cn(
                buttonVariants({ size: "lg" }),
                focusRingLink,
                "h-14 w-full rounded-2xl shadow-sm transition-colors"
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" aria-hidden />
              10語を進める
            </Link>
          )}
        </CardContent>
      </Card>
    </Screen>
  );
}
