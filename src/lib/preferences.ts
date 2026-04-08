import { getStored, setStored } from "@/lib/storage";
import {
  DEFAULT_COLOR_PRESET_ID,
  type ColorPresetId,
  isColorPresetId,
} from "@/lib/color-presets";

const KEY = "vocaboost.prefs.v1";

export type AppPreferences = {
  /** UI アクセントカラーのプリセット */
  colorPreset: ColorPresetId;
  /** 復習間隔をやや詰める（SRS の日数に倍率を適用） */
  compactSchedule: boolean;
  /** 和訳展開時に例文ブロックを出す */
  showExample: boolean;
  /** 学習セッションで問題（4択）表示時に英語を自動読み上げ（既定はオフ） */
  autoSpeakEnglish: boolean;
  /** 学習セッションの問題文で品詞を表示する */
  showPartOfSpeechInQuestion: boolean;
};

const DEFAULTS: AppPreferences = {
  colorPreset: DEFAULT_COLOR_PRESET_ID,
  compactSchedule: false,
  showExample: true,
  autoSpeakEnglish: false,
  showPartOfSpeechInQuestion: true,
};

function normalizePreferences(raw: Partial<AppPreferences>): AppPreferences {
  const colorPreset =
    raw.colorPreset != null && isColorPresetId(raw.colorPreset)
      ? raw.colorPreset
      : DEFAULT_COLOR_PRESET_ID;
  return { ...DEFAULTS, ...raw, colorPreset };
}

export async function getPreferences(): Promise<AppPreferences> {
  const raw = await getStored<Partial<AppPreferences>>(KEY, {});
  return normalizePreferences(raw);
}

export async function setPreferences(
  patch: Partial<AppPreferences>
): Promise<AppPreferences> {
  const cur = await getPreferences();
  const next = normalizePreferences({ ...cur, ...patch });
  await setStored(KEY, next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("vocaboost:prefs-updated"));
  }
  return next;
}
