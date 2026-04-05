import type { ToeicWord } from "@/lib/vocab";

export const POS_LABEL: Record<NonNullable<ToeicWord["partOfSpeech"]>, string> = {
  n: "名詞",
  v: "動詞",
  adj: "形容詞",
  adv: "副詞",
  prep: "前置詞",
  conj: "接続詞",
  phr: "フレーズ",
};
