"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, focusRingLink } from "@/lib/utils";
import { Screen } from "@/components/app/screen";
import { BookOpen, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivityBuckets, type ActivityBuckets } from "@/lib/activity";

export default function StudyPage() {
  const [buckets, setBuckets] = useState<ActivityBuckets>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const b = await getActivityBuckets();
      if (!cancelled) setBuckets(b);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const now = useMemo(() => new Date(), []);

  const grids = useMemo(() => {
    type Range = { days: number; label: string; value: string };
    const ranges: Range[] = [
      { value: "week", label: "週間", days: 7 },
      { value: "month", label: "月間", days: 30 },
      { value: "year", label: "年間", days: 365 },
    ];

    function keyFor(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = String(d.getHours()).padStart(2, "0");
      return `${y}-${m}-${day}T${h}`;
    }

    function build(days: number) {
      // columns: days (oldest -> newest), rows: hour 0..23 (top=23 like GH? keep 23 at top)
      const cols = days;
      const rows = 24;
      const cells: number[] = [];
      let max = 0;
      for (let c = 0; c < cols; c++) {
        const dayOffset = cols - 1 - c;
        const base = new Date(now);
        base.setHours(0, 0, 0, 0);
        base.setDate(base.getDate() - dayOffset);
        for (let r = 0; r < rows; r++) {
          const hour = 23 - r;
          const dt = new Date(base);
          dt.setHours(hour, 0, 0, 0);
          const v = buckets[keyFor(dt)] ?? 0;
          cells.push(v);
          if (v > max) max = v;
        }
      }
      return { cols, rows, cells, max };
    }

    const out: Record<string, ReturnType<typeof build>> = {};
    for (const r of ranges) out[r.value] = build(r.days);
    return out;
  }, [buckets, now]);

  function level(v: number, max: number): 0 | 1 | 2 | 3 | 4 {
    if (v <= 0 || max <= 0) return 0;
    const t = v / max;
    if (t <= 0.25) return 1;
    if (t <= 0.5) return 2;
    if (t <= 0.75) return 3;
    return 4;
  }

  return (
    <Screen
      title="学習"
      subtitle="10語ずつ、短いセットで進めます。"
      icon={<BookOpen className="h-5 w-5" />}
    >
      <Card className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
            クイックスタート
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Link
            href="/study/session?mode=new&n=10"
            className={cn(
              buttonVariants({ size: "lg" }),
              focusRingLink,
              "h-14 rounded-2xl shadow-sm transition-colors"
            )}
          >
            新規 10語
          </Link>
          <Link
            href="/study/session?mode=mix&n=10&offset=0"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              focusRingLink,
              "h-14 rounded-2xl shadow-sm transition-colors"
            )}
          >
            ミックス 10語
          </Link>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">解答数ヒートマップ</CardTitle>
          <p className="text-xs text-muted-foreground">
            ローカルに保存され、時間（1時間単位）ごとの解答数が濃淡で表示されます。
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week">
            <TabsList>
              <TabsTrigger value="week">週間</TabsTrigger>
              <TabsTrigger value="month">月間</TabsTrigger>
              <TabsTrigger value="year">年間</TabsTrigger>
            </TabsList>
            {(["week", "month", "year"] as const).map((k) => {
              const g = grids[k];
              return (
                <TabsContent key={k} value={k} className="pt-3">
                  <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/50 p-3">
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${g.cols}, 10px)`,
                        gridTemplateRows: `repeat(${g.rows}, 10px)`,
                      }}
                      aria-label={`${k} の解答数ヒートマップ`}
                    >
                      {g.cells.map((v, i) => {
                        const lv = level(v, g.max);
                        const cls =
                          lv === 0
                            ? "bg-muted/40"
                            : lv === 1
                              ? "bg-primary/20"
                              : lv === 2
                                ? "bg-primary/35"
                                : lv === 3
                                  ? "bg-primary/55"
                                  : "bg-primary/75";
                        return (
                          <div
                            key={i}
                            className={cn(
                              "h-[10px] w-[10px] rounded-[2px] ring-1 ring-border/20",
                              cls
                            )}
                            title={v > 0 ? `${v}件` : "0件"}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>少</span>
                    <div className="flex items-center gap-1">
                      {([0, 1, 2, 3, 4] as const).map((lv) => {
                        const cls =
                          lv === 0
                            ? "bg-muted/40"
                            : lv === 1
                              ? "bg-primary/20"
                              : lv === 2
                                ? "bg-primary/35"
                                : lv === 3
                                  ? "bg-primary/55"
                                  : "bg-primary/75";
                        return (
                          <div
                            key={lv}
                            className={cn("h-2.5 w-2.5 rounded-[2px] ring-1 ring-border/20", cls)}
                          />
                        );
                      })}
                    </div>
                    <span>多</span>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </Screen>
  );
}
