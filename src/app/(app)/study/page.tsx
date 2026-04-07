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
  const [selected, setSelected] = useState<{ dt: Date; v: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week");

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

  const grids = useMemo(() => {
    type Range = { label: string; value: string };
    const ranges: Range[] = [
      { value: "week", label: "週間" },
      { value: "month", label: "月間" },
      { value: "year", label: "年間" },
    ];
    const now = new Date(); // local clock

    function keyFor(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = String(d.getHours()).padStart(2, "0");
      return `${y}-${m}-${day}T${h}`;
    }

    function startOfDay(d: Date): Date {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    }

    function startOfWeekMonday(d: Date): Date {
      const x = startOfDay(d);
      // JS: Sun=0..Sat=6. Want Monday=0..Sunday=6.
      const dow = (x.getDay() + 6) % 7;
      x.setDate(x.getDate() - dow);
      return x;
    }

    function sumBuckets(day: Date, fromHour: number, spanHours: number): number {
      let sum = 0;
      for (let h = 0; h < spanHours; h++) {
        const dt = new Date(day);
        dt.setHours(fromHour + h, 0, 0, 0);
        sum += buckets[keyFor(dt)] ?? 0;
      }
      return sum;
    }

    function build(kind: "week" | "month" | "year") {
      const cell = kind === "week" ? 20 : kind === "month" ? 14 : 14;
      const gapX = kind === "week" ? 10 : 3;
      const gapY = kind === "week" ? 6 : 3;
      const hourSpan = kind === "week" ? 3 : 3; // larger blocks (3 hours) for readability
      const rows = Math.ceil(24 / hourSpan);
      const monthName = kind === "month" ? monthLabelEn(now.getMonth()) : null;

      let colDates: Date[] = [];
      if (kind === "week") {
        const start = startOfWeekMonday(now);
        colDates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d;
        });
      } else if (kind === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        colDates = Array.from({ length: daysInMonth }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d;
        });
      } else {
        const start = new Date(now.getFullYear(), 0, 1);
        const isLeap =
          new Date(now.getFullYear(), 1, 29).getMonth() === 1;
        const daysInYear = isLeap ? 366 : 365;
        colDates = Array.from({ length: daysInYear }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d;
        });
      }

      const cols = colDates.length;
      const cells: { v: number; dt: Date; spanHours: number }[] = [];
      for (const base of colDates) {
        for (let r = 0; r < rows; r++) {
          const fromHour = 24 - hourSpan * (r + 1);
          const startHour = Math.max(0, fromHour);
          const span = Math.min(hourSpan, 24 - startHour);
          const v = sumBuckets(base, startHour, span);
          const dt = new Date(base);
          dt.setHours(startHour, 0, 0, 0);
          cells.push({ v, dt, spanHours: span });
        }
      }

      return { cols, rows, cells, colDates, cell, gapX, gapY, hourSpan, monthName };
    }

    const out: Record<string, ReturnType<typeof build>> = {
      week: build("week"),
      month: build("month"),
      year: build("year"),
    };
    return out;
  }, [buckets]);

  function levelFixed(v: number): 0 | 1 | 2 | 3 | 4 {
    if (v <= 0) return 0;
    if (v <= 2) return 1;
    if (v <= 5) return 2;
    if (v <= 9) return 3;
    return 4;
  }

  function formatCellTitle(dt: Date, v: number, spanHours = 1): string {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    const h = String(dt.getHours()).padStart(2, "0");
    if (spanHours <= 1) return `${y}-${m}-${d} ${h}時: ${v}件`;
    const h2 = String(Math.min(23, dt.getHours() + spanHours - 1)).padStart(2, "0");
    return `${y}-${m}-${d} ${h}–${h2}時: ${v}件`;
  }

  function weekdayLabelJa(d: Date): string {
    return ["日", "月", "火", "水", "木", "金", "土"][d.getDay()] ?? "";
  }

  function monthLabelEn(m0: number): string {
    return (
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m0] ??
      String(m0 + 1)
    );
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
          <CardTitle className="text-base font-semibold">学習記録</CardTitle>
          <p className="text-xs text-muted-foreground">
            ローカルに保存され、時間（1時間単位）ごとの解いた問題数が濃淡で表示されます。
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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
                    {k === "month" ? (
                      <div className="mb-2 text-sm font-semibold text-foreground">
                        {g.monthName}
                      </div>
                    ) : (
                      /* Top labels (weekdays / months) */
                      <div
                        className="mb-2 grid"
                        style={{
                          gridTemplateColumns: `repeat(${g.cols}, ${g.cell}px)`,
                          columnGap: `${g.gapX}px`,
                        }}
                        aria-hidden
                      >
                        {g.colDates.map((d, i) => {
                          let label = "";
                          if (k === "week") {
                            label = weekdayLabelJa(d);
                          } else {
                            // year: show English month at boundaries
                            const prev = g.colDates[i - 1];
                            const isMonthStart = d.getDate() === 1;
                            const monthChanged = prev ? prev.getMonth() !== d.getMonth() : true;
                            label = isMonthStart || monthChanged ? monthLabelEn(d.getMonth()) : "";
                          }
                          return (
                            <div
                              key={`${d.toISOString()}-${i}`}
                              className={cn(
                                "text-center text-muted-foreground",
                                k === "week"
                                  ? "h-7 text-base leading-7"
                                  : "h-5 text-xs leading-5"
                              )}
                              title={
                                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                                  d.getDate()
                                ).padStart(2, "0")}`
                              }
                            >
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${g.cols}, ${g.cell}px)`,
                        gridTemplateRows: `repeat(${g.rows}, ${g.cell}px)`,
                        columnGap: `${g.gapX}px`,
                        rowGap: `${g.gapY}px`,
                      }}
                      aria-label={`${k} の学習記録ヒートマップ`}
                    >
                      {g.cells.map(({ v, dt, spanHours }, i) => {
                        const lv = levelFixed(v);
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
                          <button
                            key={i}
                            type="button"
                            className={cn(
                              "rounded-[3px] ring-1 ring-border/20",
                              cls
                            )}
                            title={formatCellTitle(dt, v, spanHours)}
                            aria-label={formatCellTitle(dt, v, spanHours)}
                            onClick={() => setSelected({ dt, v })}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Less</span>
                      <div className="flex items-center gap-1" aria-hidden>
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
                              className={cn("h-3.5 w-3.5 rounded-[3px] ring-1 ring-border/20", cls)}
                            />
                          );
                        })}
                      </div>
                      <span>More</span>
                    </div>
                  </div>

                  {selected ? (
                    <div className="mt-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">選択中</span>{" "}
                      <span className="text-muted-foreground">
                        {formatCellTitle(
                          selected.dt,
                          selected.v,
                          activeTab === "week" ? 3 : 3
                        )}
                      </span>
                    </div>
                  ) : null}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </Screen>
  );
}
