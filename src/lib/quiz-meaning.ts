const KANJI = /[\u3400-\u9FFF\uF900-\uFAFF]/;
const KATAKANA = /[\u30A0-\u30FF]/;

/**
 * 4択クイズ用の表示文言。
 * 和訳に漢字とカタカナが併記されている場合（例: 「付属品、アクセサリー」）は、
 * カタカナを含まないブロック（主に漢字＋必要なひらがな）だけを返す。
 */
export function quizChoiceMeaningJa(raw: string): string {
  const s = raw.trim();
  if (!s) return s;
  const hasKanji = KANJI.test(s);
  const hasKatakana = KATAKANA.test(s);
  if (!hasKanji || !hasKatakana) return s;

  const parts = s
    .split(/[、，､]/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const p of parts) {
    if (KANJI.test(p) && !KATAKANA.test(p)) {
      return p;
    }
  }

  const noKatakana = s
    .replace(/[ァ-ヶー]+/g, "")
    .replace(/[、，､]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (KANJI.test(noKatakana)) return noKatakana;

  return s;
}
