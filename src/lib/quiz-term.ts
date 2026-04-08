import type { ToeicWord } from "@/lib/vocab";
import { shuffleRandom } from "@/lib/shuffle";

export type QuizDirection = "en-ja" | "ja-en";

/** 英単語4択：正解1＋他語3（表記の重複は除く） */
export function buildTermQuizOptions(current: ToeicWord, all: ToeicWord[]): string[] {
  const correct = current.term.trim();
  const correctKey = correct.toLowerCase();
  const pool = shuffleRandom(
    all.filter((w) => w.id !== current.id).map((w) => w.term.trim())
  );
  const seen = new Set<string>([correctKey]);
  const wrong: string[] = [];
  for (const t of pool) {
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    wrong.push(t);
    if (wrong.length >= 3) break;
  }
  while (wrong.length < 3) {
    wrong.push(`(word${wrong.length + 1})`);
  }
  return shuffleRandom([correct, ...wrong.slice(0, 3)]);
}

export function termsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
