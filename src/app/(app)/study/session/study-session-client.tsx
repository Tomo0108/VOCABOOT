"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getAllWords, type ToeicWord } from "@/lib/vocab";
import { getDueWordIds, getProgress, rateWord } from "@/lib/progress";
import { getPreferences, type AppPreferences } from "@/lib/preferences";
import { Screen } from "@/components/app/screen";
import { Badge } from "@/components/ui/badge";
import type { Rating } from "@/lib/srs";
import { randomSeed, shuffleRandom, shuffleWithSeed } from "@/lib/shuffle";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Home,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  SESSION_CHECKPOINT_MAX_AGE_MS,
  checkpointMatchesWords,
  clearSessionCheckpoint,
  getSessionCheckpoint,
  saveSessionCheckpoint,
} from "@/lib/session-checkpoint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, focusRingLink } from "@/lib/utils";

type Mode = "new" | "mix" | "review";

async function loadSessionWords(
  mode: Mode,
  n: number,
  offset: number,
  mixSeed: string | null
): Promise<ToeicWord[]> {
  const all = getAllWords();
  if (mode === "review") {
    const ids = await getDueWordIds();
    const map = new Map(all.map((w) => [w.id, w]));
    const list = ids
      .slice(0, n)
      .map((id) => map.get(id))
      .filter((w): w is ToeicWord => Boolean(w));
    return shuffleRandom(list);
  }
  if (mode === "new") {
    const progress = await getProgress();
    const unseen = all.filter((w) => !progress[w.id]);
    return shuffleRandom(unseen).slice(0, n);
  }
  if (!mixSeed) return [];
  const order = shuffleWithSeed(all, mixSeed);
  return order.slice(offset, offset + n);
}

function speakEnglish(term: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(term);
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
}

export function StudySessionClient() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const mode = (sp.get("mode") as Mode | null) ?? "mix";
  const n = Math.max(1, Math.min(50, Number(sp.get("n") ?? "10") || 10));
  const offset = Math.max(0, Number(sp.get("offset") ?? "0") || 0);

  const [words, setWords] = useState<ToeicWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [moreNew, setMoreNew] = useState(false);
  const [moreReview, setMoreReview] = useState(false);
  const [mixSeedState, setMixSeedState] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const goNextRef = useRef<(r: Rating) => void>(() => {});
  const restoredRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setIdx(0);
      setMeaningOpen(false);

      void (async () => {
        let mixSeed: string | null = null;
        if (mode === "mix") {
          const params = new URLSearchParams(
            typeof window !== "undefined" ? window.location.search : ""
          );
          mixSeed = params.get("seed");
          if (!mixSeed && typeof window !== "undefined") {
            mixSeed = randomSeed();
            params.set("seed", mixSeed);
            const qs = params.toString();
            window.history.replaceState(
              null,
              "",
              qs ? `${pathname}?${qs}` : pathname
            );
          }
          if (!cancelled) setMixSeedState(mixSeed);
        } else {
          if (!cancelled) setMixSeedState(null);
        }

        const w = await loadSessionWords(mode, n, offset, mixSeed);
        if (!cancelled) {
          setWords(w);
          setLoading(false);
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [mode, n, offset, pathname]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await getPreferences();
      if (!cancelled) setPrefs(p);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = words[idx];
  const done = !loading && words.length > 0 && idx >= words.length;
  const inQuiz = !loading && words.length > 0 && idx < words.length;
  const totalWords = getAllWords().length;
  const percent = Math.round(
    (Math.min(idx, words.length) / Math.max(words.length, 1)) * 100
  );

  useEffect(() => {
    if (!done || mode !== "new") return;
    let cancelled = false;
    void (async () => {
      const progress = await getProgress();
      if (cancelled) return;
      const unseen = getAllWords().filter((w) => !progress[w.id]);
      setMoreNew(unseen.length > 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [done, mode]);

  useEffect(() => {
    if (!done || mode !== "review") return;
    let cancelled = false;
    void (async () => {
      const ids = await getDueWordIds();
      if (!cancelled) setMoreReview(ids.length > 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [done, mode]);

  useEffect(() => {
    if (done) void clearSessionCheckpoint();
  }, [done]);

  useEffect(() => {
    if (!loading && words.length === 0) void clearSessionCheckpoint();
  }, [loading, words.length]);

  useEffect(() => {
    if (loading) {
      restoredRef.current = false;
      return;
    }
    if (words.length === 0) return;
    if (restoredRef.current) return;
    let cancelled = false;
    void (async () => {
      const cp = await getSessionCheckpoint();
      if (cancelled) return;
      if (!cp || Date.now() - cp.updatedAt > SESSION_CHECKPOINT_MAX_AGE_MS) {
        restoredRef.current = true;
        return;
      }
      const search = typeof window !== "undefined" ? window.location.search : "";
      if (!checkpointMatchesWords(cp, pathname, search, words)) {
        restoredRef.current = true;
        return;
      }
      restoredRef.current = true;
      queueMicrotask(() => {
        if (!cancelled) {
          setIdx(Math.min(cp.idx, Math.max(0, words.length - 1)));
        }
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, words, pathname]);

  useEffect(() => {
    if (loading || words.length === 0 || idx >= words.length) return;
    const search = typeof window !== "undefined" ? window.location.search : "";
    void saveSessionCheckpoint({
      pathname,
      search,
      idx,
      wordIds: words.map((w) => w.id),
    });
  }, [loading, words, idx, pathname]);

  useEffect(() => {
    if (!inQuiz) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [inQuiz]);

  const goNext = useCallback(
    async (rating: Rating) => {
      if (!current || ratingBusy) return;
      setRatingBusy(true);
      try {
        await rateWord(current.id, rating, {
          compactSchedule: prefs?.compactSchedule ?? false,
        });
        setMeaningOpen(false);
        setIdx((v) => v + 1);
      } catch {
        toast.error("記録を保存できませんでした。もう一度お試しください。");
      } finally {
        setRatingBusy(false);
      }
    },
    [current, prefs?.compactSchedule, ratingBusy]
  );

  goNextRef.current = (r) => {
    void goNext(r);
  };

  useEffect(() => {
    if (loading) return;
    const inQuiz = words.length > 0 && idx < words.length;
    if (!inQuiz) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable=true]")) return;
      const map: Record<string, Rating> = {
        "1": "again",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      const rating = map[e.key];
      if (!rating) return;
      e.preventDefault();
      goNextRef.current(rating);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, words.length, idx]);

  const requestLeaveStudy = useCallback(() => {
    if (inQuiz) setLeaveOpen(true);
    else router.push("/study");
  }, [inQuiz, router]);

  const confirmLeaveStudy = useCallback(() => {
    setLeaveOpen(false);
    router.push("/study");
  }, [router]);

  const modeLabel =
    mode === "review" ? "復習" : mode === "new" ? "新規" : "ミックス";
  const modeIcon =
    mode === "review" ? (
      <RotateCcw className="h-5 w-5" />
    ) : mode === "new" ? (
      <Sparkles className="h-5 w-5" />
    ) : (
      <Gauge className="h-5 w-5" />
    );

  const mixHasNext = mode === "mix" && offset + words.length < totalWords;
  const seedQ =
    mixSeedState != null && mixSeedState !== ""
      ? `&seed=${encodeURIComponent(mixSeedState)}`
      : "";
  const mixNextHref = `/study/session?mode=mix&n=${n}&offset=${offset + words.length}${seedQ}`;

  if (loading) {
    return (
      <Screen
        title="セッション"
        subtitle="語リストを準備しています。"
        icon={modeIcon}
        backHref="/study"
        right={<Badge variant="secondary">{modeLabel}</Badge>}
      >
        <Card className="rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5">
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            読み込み中…
          </CardContent>
        </Card>
      </Screen>
    );
  }

  if (!loading && words.length === 0) {
    const emptyMsg =
      mode === "review"
        ? "いま期限どおりの語はありません。"
        : mode === "new"
          ? "未学習の語が残っていません。"
          : offset >= totalWords
            ? "指定位置が語リストの終端を超えています。"
            : "この条件では語が選べませんでした。";

    return (
      <Screen
        title="セッション"
        subtitle={emptyMsg}
        icon={modeIcon}
        backHref="/study"
        right={<Badge variant="secondary">{modeLabel}</Badge>}
      >
        <Card className="rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">{emptyMsg}</p>
            <Link
              href="/study/session?mode=mix&n=10&offset=0"
              className={cn(
                focusRingLink,
                "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-4 font-medium text-primary-foreground",
                "shadow-sm transition-opacity hover:opacity-95"
              )}
            >
              ミックス10語から始める
            </Link>
            <Link
              href="/study"
              className={cn(
                focusRingLink,
                "inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border/60 bg-background text-sm font-medium"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4 opacity-70" aria-hidden />
              学習メニュー
            </Link>
          </CardContent>
        </Card>
      </Screen>
    );
  }

  if (!current && done) {
    return (
      <Screen
        title="完了"
        subtitle="お疲れさまでした。"
        icon={<Check className="h-5 w-5" />}
        backHref="/study"
      >
        <Card className="rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">次へ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
              <span className="text-muted-foreground">語数</span>
              <span className="font-medium tabular-nums">{words.length}</span>
            </div>

            {mixHasNext ? (
              <Link
                href={mixNextHref}
                className={cn(
                  focusRingLink,
                  "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-medium text-primary-foreground",
                  "shadow-sm transition-opacity hover:opacity-95"
                )}
              >
                次の{n}語を続ける
                <ChevronRight className="ml-1 h-4 w-4 opacity-90" aria-hidden />
              </Link>
            ) : null}

            {mode === "new" && moreNew ? (
              <Link
                href={`/study/session?mode=new&n=${n}`}
                className={cn(
                  focusRingLink,
                  "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-medium text-primary-foreground",
                  "shadow-sm transition-opacity hover:opacity-95"
                )}
              >
                次の{n}語を続ける
                <ChevronRight className="ml-1 h-4 w-4 opacity-90" aria-hidden />
              </Link>
            ) : null}

            {mode === "review" && moreReview ? (
              <Link
                href={`/study/session?mode=review&n=${n}`}
                className={cn(
                  focusRingLink,
                  "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-medium text-primary-foreground",
                  "shadow-sm transition-opacity hover:opacity-95"
                )}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                復習を続ける
              </Link>
            ) : null}

            <Link
              href="/review"
              className={cn(
                focusRingLink,
                "inline-flex h-12 w-full items-center justify-center rounded-2xl border border-border/60 bg-background font-medium",
                "transition-colors hover:bg-muted/80 active:bg-muted"
              )}
            >
              <RotateCcw className="mr-2 h-4 w-4 opacity-70" aria-hidden />
              復習ページへ
            </Link>
            <Link
              href="/"
              className={cn(
                focusRingLink,
                "inline-flex h-11 w-full items-center justify-center rounded-2xl border border-border/60 bg-background text-sm font-medium",
                "transition-colors hover:bg-muted/80"
              )}
            >
              <Home className="mr-2 h-4 w-4 opacity-70" aria-hidden />
              ホームへ
            </Link>
          </CardContent>
        </Card>
      </Screen>
    );
  }

  const hasMeaning = Boolean(current.meaningJa?.trim());
  const posLabel: Record<NonNullable<ToeicWord["partOfSpeech"]>, string> = {
    n: "名",
    v: "動",
    adj: "形",
    adv: "副",
    prep: "前",
    conj: "接",
    phr: "句",
  };

  return (
    <>
      <Screen
        title="セッション"
        subtitle="タップで和訳を確認。覚え具合を選んで進みます。"
        icon={modeIcon}
        renderBack={
          <button
            type="button"
            onClick={requestLeaveStudy}
            className={cn(
              focusRingLink,
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card",
              "text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            )}
            aria-label="戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        }
        right={<Badge variant="secondary">{modeLabel}</Badge>}
      >
        <Card className="rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium text-muted-foreground">
              進捗
            </CardTitle>
            <div className="text-sm tabular-nums text-muted-foreground">
              {Math.min(idx + 1, words.length)}/{words.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress
            value={percent}
            getAriaValueText={(_formatted, v) => {
              const pct = v ?? percent;
              const cur = Math.min(idx + 1, words.length);
              return `${cur}語目、全${words.length}語、進捗${Math.round(pct)}パーセント`;
            }}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">残り</span>
            <span className="font-medium tabular-nums text-foreground">
              {Math.max(0, words.length - (idx + 1))}語
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {idx + 1}語目、単語 {current.term}
              </p>
              <CardTitle className="break-words text-3xl font-semibold tracking-tight text-foreground">
                {current.term}
              </CardTitle>
              {current.partOfSpeech ? (
                <p className="text-xs text-muted-foreground">
                  {posLabel[current.partOfSpeech] ?? current.partOfSpeech}
                </p>
              ) : null}
              {current.tags && current.tags.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {current.tags.join(" · ")}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 rounded-xl"
              aria-label="英語を読み上げ"
              onClick={() => speakEnglish(current.term)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            onClick={() => setMeaningOpen((v) => !v)}
            className={cn(
              focusRingLink,
              "w-full rounded-2xl border text-left transition-colors",
              meaningOpen
                ? "cursor-pointer border-border/60 bg-background/80 p-4 hover:bg-muted/30 active:bg-muted/50"
                : "border-dashed border-border/70 bg-muted/30 px-4 py-8 active:bg-muted/50",
              !meaningOpen &&
                "cursor-pointer hover:border-primary/40 hover:bg-muted/40"
            )}
            aria-expanded={meaningOpen}
            aria-label={meaningOpen ? "和訳を隠す" : "和訳を表示"}
          >
            {!meaningOpen ? (
              <p className="text-center text-sm text-muted-foreground">
                タップで和訳
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-base leading-relaxed text-foreground">
                  {hasMeaning ? current.meaningJa : "—"}
                </p>
                {prefs?.showExample !== false && current.exampleEn ? (
                  <div className="mt-4 border-t border-border/50 pt-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      例文
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                      {current.exampleEn}
                    </p>
                    {current.exampleJa ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {current.exampleJa}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  タップで閉じる
                </p>
              </div>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
              disabled={ratingBusy}
              onClick={() => void goNext("again")}
            >
              忘れた
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              disabled={ratingBusy}
              onClick={() => void goNext("hard")}
            >
              難しい
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl bg-primary font-medium text-primary-foreground"
              disabled={ratingBusy}
              onClick={() => void goNext("good")}
            >
              できた
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl"
              disabled={ratingBusy}
              onClick={() => void goNext("easy")}
            >
              簡単
            </Button>
          </div>
          <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
            キーボード: 1 忘れた · 2 難しい · 3 できた · 4 簡単
          </p>
        </CardContent>
      </Card>
      </Screen>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>学習を中断しますか？</DialogTitle>
            <DialogDescription>
              未評価の語が残っています。このまま戻ると、ホームの「続きから」で同じ位置から再開できます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setLeaveOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" onClick={confirmLeaveStudy}>
              学習メニューへ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
