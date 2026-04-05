import { getProgress, type WordProgress } from "@/lib/progress";
import { getPreferences, setPreferences, type AppPreferences } from "@/lib/preferences";
import { getStored, setStored } from "@/lib/storage";

type BackupPayload = {
  version: 1;
  exportedAt: string;
  progress: WordProgress;
  preferences: AppPreferences;
};

/** progress.ts と同一（バックアップ検証用）。接頭辞は IndexedDB 互換のため維持 */
const PROGRESS_KEY = "vocaboot.progress.v1";

export async function exportBackup(): Promise<string> {
  const progress = await getProgress();
  const preferences = await getPreferences();
  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress,
    preferences,
  };
  return JSON.stringify(payload, null, 2);
}

export async function importBackup(json: string): Promise<{ wordCount: number }> {
  const data = JSON.parse(json) as BackupPayload;
  if (data.version !== 1 || typeof data.progress !== "object") {
    throw new Error("対応していない形式です");
  }
  await setStored(PROGRESS_KEY, data.progress);
  if (data.preferences) {
    await setPreferences(data.preferences);
  }
  return { wordCount: Object.keys(data.progress).length };
}
