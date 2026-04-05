import { getStored, setStored } from "@/lib/storage";
import { applyRating, initialSrsState, type Rating, type SrsState } from "@/lib/srs";
import { getAllWords } from "@/lib/vocab";

export type WordProgress = Record<string, SrsState>;

/** 表示名は Vocaboost だが、既存ユーザーの IndexedDB 互換のため接頭辞は維持 */
const KEY = "vocaboot.progress.v1";

export async function getProgress(): Promise<WordProgress> {
  return await getStored<WordProgress>(KEY, {});
}

/** ホームなど用の集計（クライアント側ストレージ前提） */
export async function getHomeStats(now = Date.now()) {
  const progress = await getProgress();
  const dueIds = await getDueWordIds(now);
  const listLength = getAllWords().length;
  return {
    dueCount: dueIds.length,
    touchedCount: Object.keys(progress).length,
    listWordCount: listLength,
  };
}

export async function rateWord(
  wordId: string,
  rating: Rating,
  opts?: { compactSchedule?: boolean }
): Promise<SrsState> {
  const now = Date.now();
  const progress = await getProgress();
  const prev = progress[wordId] ?? initialSrsState();
  let next = applyRating(prev, rating, now);
  if (opts?.compactSchedule && rating !== "again" && next.intervalDays > 0) {
    const scaled = Math.max(0.25, next.intervalDays * 0.68);
    next = {
      ...next,
      intervalDays: scaled,
      dueAt: now + scaled * 24 * 60 * 60 * 1000,
    };
  }
  progress[wordId] = next;
  await setStored(KEY, progress);
  return next;
}

export async function getDueWordIds(now = Date.now()): Promise<string[]> {
  const progress = await getProgress();
  return Object.entries(progress)
    .filter(([, s]) => (s?.dueAt ?? 0) <= now)
    .sort((a, b) => (a[1].dueAt ?? 0) - (b[1].dueAt ?? 0))
    .map(([id]) => id);
}

