/**
 * UI アクセントのプリセット ID（`globals.css` の `html[data-color-preset]` と対応）
 */
export const COLOR_PRESET_IDS = [
  "default",
  "indigo",
  "forest",
  "ocean",
  "plum",
  "terracotta",
  "slate",
] as const;

export type ColorPresetId = (typeof COLOR_PRESET_IDS)[number];

export const DEFAULT_COLOR_PRESET_ID: ColorPresetId = "default";

export type ColorPresetMeta = {
  id: ColorPresetId;
  /** 設定画面の見出し */
  label: string;
  /** トーンの説明（コーディネート意図） */
  description: string;
  /** プレビュー用（ライト時の primary / accent 相当の sRGB 近似） */
  swatches: { primary: string; accent: string };
};

/**
 * 各プリセットのコピーとプレビュー色。
 * 実際の適用値は globals.css の oklch で定義（プロ品質のトーン＆コントラスト用）。
 */
export const COLOR_PRESETS: ColorPresetMeta[] = [
  {
    id: "default",
    label: "ゴールド",
    description: "落ち着いた金アクセント。紙とインクに近いニュートラルとの定番の組み合わせです。",
    swatches: { primary: "#e8c547", accent: "#faf6e8" },
  },
  {
    id: "indigo",
    label: "インク",
    description: "深い藍味。辞書・学参のような知的で視線が落ち着くトーンです。",
    swatches: { primary: "#4f5fcc", accent: "#eef0fb" },
  },
  {
    id: "forest",
    label: "フォレスト",
    description: "抑制した緑。長時間の学習でも目が疲れにくいナチュラルな彩度です。",
    swatches: { primary: "#3d7a5c", accent: "#edf5f0" },
  },
  {
    id: "ocean",
    label: "オーシャン",
    description: "澄んだ青緑。清潔感と集中のバランスを意識したクールトーンです。",
    swatches: { primary: "#2d8faf", accent: "#e8f4f8" },
  },
  {
    id: "plum",
    label: "プラム",
    description: "赤紫を抑えめに。個性を出しつつ派手になりすぎない上品さを狙っています。",
    swatches: { primary: "#7a5195", accent: "#f3eef7" },
  },
  {
    id: "terracotta",
    label: "テラコッタ",
    description: "黄土・焼き物のような温かみ。ゴールドより赤みが強いアースカラーです。",
    swatches: { primary: "#c45c3e", accent: "#faf0ec" },
  },
  {
    id: "slate",
    label: "スレート",
    description: "彩度を抑えた青灰。情報を主役にするミニマルでモダンな印象です。",
    swatches: { primary: "#5a6b7d", accent: "#eef1f4" },
  },
];

export function isColorPresetId(v: string): v is ColorPresetId {
  return (COLOR_PRESET_IDS as readonly string[]).includes(v);
}
