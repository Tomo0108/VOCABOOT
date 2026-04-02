export type Rating = "again" | "hard" | "good" | "easy";

export type SrsState = {
  dueAt: number; // epoch ms
  intervalDays: number;
  ease: number; // 1.3..2.7
  reps: number;
  lapses: number;
  lastReviewedAt?: number;
};

export function initialSrsState(now = Date.now()): SrsState {
  return { dueAt: now, intervalDays: 0, ease: 2.2, reps: 0, lapses: 0 };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function applyRating(
  state: SrsState,
  rating: Rating,
  now = Date.now()
): SrsState {
  // シンプル版SM-2風（通勤学習の「短時間反復」に寄せて過剰に複雑化しない）
  const easeDelta =
    rating === "again" ? -0.2 : rating === "hard" ? -0.1 : rating === "easy" ? 0.1 : 0;
  const nextEase = clamp(state.ease + easeDelta, 1.3, 2.7);

  const next: SrsState = {
    ...state,
    ease: nextEase,
    lastReviewedAt: now,
  };

  if (rating === "again") {
    next.lapses = state.lapses + 1;
    next.reps = 0;
    next.intervalDays = 0;
    next.dueAt = now + 5 * 60 * 1000; // 5分後に再登場
    return next;
  }

  const reps = state.reps + 1;
  next.reps = reps;

  let intervalDays: number;
  if (reps === 1) intervalDays = rating === "hard" ? 0.5 : 1;
  else if (reps === 2) intervalDays = rating === "hard" ? 2 : 3;
  else intervalDays = Math.max(1, Math.round(state.intervalDays * nextEase));

  if (rating === "hard") intervalDays = Math.max(1, Math.floor(intervalDays * 0.8));
  if (rating === "easy") intervalDays = Math.max(intervalDays + 1, Math.round(intervalDays * 1.2));

  next.intervalDays = intervalDays;
  next.dueAt = now + intervalDays * 24 * 60 * 60 * 1000;
  return next;
}

