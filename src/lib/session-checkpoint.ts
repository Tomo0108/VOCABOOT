import { del } from "idb-keyval";
import { getStored, setStored } from "@/lib/storage";

export const SESSION_CHECKPOINT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const KEY = "vocaboost.session.checkpoint.v1";

export type SessionCheckpoint = {
  pathname: string;
  /** `window.location.search`（先頭 `?` 含む） */
  search: string;
  /** 現在語のインデックス（0 始まり） */
  idx: number;
  /** 並び一致確認用 */
  wordIds: string[];
  updatedAt: number;
};

export function normalizeSessionSearch(search: string): string {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const u = new URLSearchParams(raw);
  const keys = [...new Set([...u.keys()])].sort();
  const out = new URLSearchParams();
  for (const k of keys) {
    const vals = u.getAll(k).sort();
    for (const v of vals) out.append(k, v);
  }
  return out.toString();
}

export async function getSessionCheckpoint(): Promise<SessionCheckpoint | null> {
  const cp = await getStored<SessionCheckpoint | null>(KEY, null);
  if (!cp || !Array.isArray(cp.wordIds)) return null;
  return cp;
}

export async function saveSessionCheckpoint(
  cp: Omit<SessionCheckpoint, "updatedAt"> & { updatedAt?: number }
): Promise<void> {
  const next: SessionCheckpoint = {
    ...cp,
    updatedAt: cp.updatedAt ?? Date.now(),
  };
  await setStored(KEY, next);
}

export async function clearSessionCheckpoint(): Promise<void> {
  await del(KEY);
}

export function checkpointMatchesWords(
  cp: SessionCheckpoint,
  pathname: string,
  search: string,
  words: { id: string }[]
): boolean {
  if (cp.pathname !== pathname) return false;
  if (normalizeSessionSearch(cp.search) !== normalizeSessionSearch(search)) {
    return false;
  }
  if (cp.wordIds.length !== words.length) return false;
  return cp.wordIds.every((id, i) => words[i]?.id === id);
}
