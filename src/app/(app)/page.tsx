"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn, focusRingHeroGhost, focusRingHeroPrimary, focusRingLink } from "@/lib/utils";
import { getHomeStats } from "@/lib/progress";
import {
  SESSION_CHECKPOINT_MAX_AGE_MS,
  getSessionCheckpoint,
  type SessionCheckpoint,
} from "@/lib/session-checkpoint";
import { AppWordmark } from "@/components/app/wordmark";
import { GoalPill } from "@/components/app/goal-pill";
import { ArrowRight, Clock, Play, Sparkles } from "lucide-react";

const HomeHeroBackdrop = dynamic(
  () =>
    import("@/components/app/home-hero-backdrop").then(
      (m) => m.HomeHeroBackdrop
    ),
  { ssr: false, loading: () => null }
);

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
    <div className="space-y-6">
      <section
        className="relative min-h-[min(420px,52vh)] overflow-hidden rounded-3xl border border-border/70 bg-card/25 shadow-md ring-1 ring-black/[0.05] dark:border-border/80 dark:bg-card/20 dark:ring-white/[0.07]"
        aria-labelledby="home-primary-cta"
      >
        <div className="absolute inset-0 min-h-[220px]">
          <HomeHeroBackdrop
            touched={touched ?? 0}
            total={total ?? 0}
            statsReady={!statsLoading}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-8 px-5 pb-8 pt-10 sm:px-7 sm:pb-10 sm:pt-12">
          <header className="space-y-2.5">
            <AppWordmark size="hero" />
            <GoalPill />
          </header>

          {resume && resume.wordIds.length > 0 ? (
            <Link
              href={`${resume.pathname}${resume.search}`}
              className={cn(
                focusRingLink,
                "flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-background/70 px-4 py-3.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background/85 dark:border-primary/25 dark:bg-background/45 dark:hover:bg-background/55"
              )}
            >
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                続きから再開
                <span className="font-normal text-muted-foreground">
                  {resume.idx + 1} / {resume.wordIds.length}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </Link>
          ) : null}

          <div className="space-y-3">
            <p
              id="home-primary-cta"
              className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl"
            >
              {primaryIsReview
                ? `復習が ${due} 語あります`
                : "10語ずつ、始めましょう"}
            </p>

            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-background/60 p-4 shadow-sm backdrop-blur-md",
                "dark:border-white/[0.08] dark:bg-background/35"
              )}
            >
              <div className="flex flex-col gap-3">
                {primaryIsReview ? (
                  <Link
                    href={`/study/session?mode=review&n=${reviewN}`}
                    className={cn(
                      focusRingHeroPrimary,
                      "inline-flex min-h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-[filter,background-color]",
                      "bg-primary text-primary-foreground shadow-md ring-1 ring-black/15 hover:brightness-105 active:brightness-95 dark:ring-black/25"
                    )}
                  >
                    <Clock className="h-5 w-5 opacity-90" aria-hidden />
                    復習する
                    <ArrowRight className="h-5 w-5 opacity-80" aria-hidden />
                  </Link>
                ) : null}
                <Link
                  href="/study/session?mode=mix&n=10&offset=0"
                  className={cn(
                    primaryIsReview ? focusRingHeroGhost : focusRingHeroPrimary,
                    "inline-flex min-h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-colors",
                    primaryIsReview
                      ? "border border-border/90 bg-background/80 text-foreground shadow-sm hover:bg-background dark:border-white/15 dark:bg-background/50 dark:hover:bg-background/65"
                      : "bg-primary text-primary-foreground shadow-md ring-1 ring-black/15 hover:brightness-105 active:brightness-95 dark:ring-black/25"
                  )}
                >
                  {!primaryIsReview ? (
                    <Sparkles className="h-5 w-5 opacity-90" aria-hidden />
                  ) : null}
                  {primaryIsReview ? "新しい10語へ" : "10語を始める"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="grid grid-cols-3 gap-2"
        aria-busy={statsLoading}
        aria-label="学習状況"
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
            収録語数
          </p>
          <StatFigure loading={statsLoading} value={total} />
        </div>
      </div>
    </div>
  );
}
