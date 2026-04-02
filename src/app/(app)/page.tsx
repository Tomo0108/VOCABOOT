"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, focusRingHeroGhost, focusRingHeroPrimary, focusRingLink } from "@/lib/utils";
import { getHomeStats } from "@/lib/progress";
import {
  SESSION_CHECKPOINT_MAX_AGE_MS,
  getSessionCheckpoint,
  type SessionCheckpoint,
} from "@/lib/session-checkpoint";
import { AppWordmark } from "@/components/app/wordmark";
import { ArrowRight, BookOpen, Clock, Play, Sparkles, Zap } from "lucide-react";

function StatFigure({
  loading,
  value,
}: {
  loading: boolean;
  value: number | null;
}) {
  if (loading) {
    return (
      <div
        className="mx-auto mt-1 h-7 w-10 max-w-full animate-pulse rounded-md bg-muted"
        aria-hidden
      />
    );
  }
  return (
    <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
      {value ?? "—"}
    </p>
  );
}

export default function Home() {
  const [due, setDue] = useState<number | null>(null);
  const [touched, setTouched] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [resume, setResume] = useState<SessionCheckpoint | null>(null);

  useEffect(() => {
    function refreshResume() {
      void getSessionCheckpoint().then((cp) => {
        if (!cp || Date.now() - cp.updatedAt > SESSION_CHECKPOINT_MAX_AGE_MS) {
          setResume(null);
          return;
        }
        setResume(cp);
      });
    }
    refreshResume();
    window.addEventListener("focus", refreshResume);
    return () => window.removeEventListener("focus", refreshResume);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await getHomeStats();
      if (!cancelled) {
        setDue(s.dueCount);
        setTouched(s.touchedCount);
        setTotal(s.listWordCount);
        setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reviewN = due != null ? Math.min(Math.max(due, 1), 30) : 20;
  const primaryIsReview = !statsLoading && due != null && due > 0;

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <AppWordmark />
          <p className="text-xs leading-relaxed text-muted-foreground">
            復習のタイミングが来た語があれば先に表示されます。まだなければ、リストを10語ずつ進めていけます。
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 rounded-full border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm"
        >
          通勤向け
        </Badge>
      </header>

      {resume && resume.wordIds.length > 0 ? (
        <Link
          href={`${resume.pathname}${resume.search}`}
          className={cn(
            focusRingLink,
            "flex items-center justify-between gap-3 rounded-2xl border border-primary/35 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground shadow-sm"
          )}
        >
          <span className="flex items-center gap-2">
            <Play className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            続きから
            <span className="font-normal text-muted-foreground">
              {resume.idx + 1} / {resume.wordIds.length} 語目
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      ) : null}

      <section
        className="relative overflow-hidden rounded-3xl bg-neutral-950 px-5 py-6 text-white shadow-lg ring-1 ring-black/20"
        aria-labelledby="home-primary-cta"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"
          aria-hidden
        />
        <div className="relative">
          <p
            id="home-primary-cta"
            className="text-sm font-medium text-white/85"
          >
            {primaryIsReview ? "先に復習しましょう" : "いま始めるなら"}
          </p>
          <p className="mt-2 text-lg font-semibold leading-snug tracking-tight">
            {primaryIsReview
              ? `期限どおりの語が ${due} 語あります`
              : "リストの続きから、10語ずつ始められます"}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {primaryIsReview ? (
              <Link
                href={`/study/session?mode=review&n=${reviewN}`}
                className={cn(
                  focusRingHeroPrimary,
                  "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-[filter,background-color] sm:w-auto",
                  "bg-primary text-primary-foreground shadow-md ring-1 ring-black/20 hover:brightness-105 active:brightness-95"
                )}
              >
                <Clock className="h-4 w-4 opacity-90" aria-hidden />
                復習を続ける
                <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
              </Link>
            ) : null}
            <Link
              href="/study/session?mode=mix&n=10&offset=0"
              className={cn(
                primaryIsReview ? focusRingHeroGhost : focusRingHeroPrimary,
                "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-colors sm:w-auto",
                primaryIsReview
                  ? "border border-white/25 bg-white/10 text-white hover:bg-white/[0.16] active:bg-white/[0.12]"
                  : "bg-primary text-primary-foreground shadow-md ring-1 ring-black/25 hover:brightness-105 active:brightness-95"
              )}
            >
              {!primaryIsReview ? (
                <Sparkles className="h-4 w-4 opacity-90" aria-hidden />
              ) : null}
              {primaryIsReview ? "あわせて10語" : "10語を始める"}
            </Link>
          </div>
        </div>
      </section>

      <div
        className="grid grid-cols-3 gap-2"
        aria-busy={statsLoading}
        aria-label="学習の概要"
      >
        <div className="rounded-2xl border border-border/90 bg-card px-3 py-3 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            復習待ち
          </p>
          <StatFigure loading={statsLoading} value={due} />
        </div>
        <div className="rounded-2xl border border-border/90 bg-card px-3 py-3 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            学習済み
          </p>
          <StatFigure loading={statsLoading} value={touched} />
        </div>
        <div className="rounded-2xl border border-border/90 bg-card px-3 py-3 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            収録
          </p>
          <StatFigure loading={statsLoading} value={total} />
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/90 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="h-4 w-4 text-primary" aria-hidden />
            ほかの入り口
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Link
            href="/study"
            className={cn(
              focusRingLink,
              "flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors",
              "hover:bg-muted/50"
            )}
          >
            <span className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-primary" />
              学習メニュー
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Separator />
          <Link
            href="/review"
            className={cn(
              focusRingLink,
              "flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors",
              "hover:bg-muted/50"
            )}
          >
            <span className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              復習
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
