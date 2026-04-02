import { getStored, setStored } from "@/lib/storage";

const KEY = "vocaboot.prefs.v1";

export type AppPreferences = {
  /** 復習間隔をやや詰める（SRS の日数に倍率を適用） */
  compactSchedule: boolean;
  /** 和訳展開時に例文ブロックを出す */
  showExample: boolean;
};

const DEFAULTS: AppPreferences = {
  compactSchedule: false,
  showExample: true,
};

export async function getPreferences(): Promise<AppPreferences> {
  const raw = await getStored<Partial<AppPreferences>>(KEY, {});
  return { ...DEFAULTS, ...raw };
}

export async function setPreferences(
  patch: Partial<AppPreferences>
): Promise<AppPreferences> {
  const cur = await getPreferences();
  const next = { ...cur, ...patch };
  await setStored(KEY, next);
  return next;
}
