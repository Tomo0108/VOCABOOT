import type { ToeicWord } from "@/lib/vocab";

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 例文中の見出し語の範囲（語尾変化・句動詞の前置詞1語まで） */
export function findTermRange(
  example: string,
  term: string,
  pos?: ToeicWord["partOfSpeech"]
): { start: number; end: number } | null {
  const t = term.trim();
  if (!t || !example) return null;
  const lower = example.toLowerCase();
  const tl = t.toLowerCase();

  if (/\s/.test(t)) {
    const i = lower.indexOf(tl);
    if (i >= 0) return { start: i, end: i + t.length };
    return null;
  }

  const re = new RegExp(`\\b${escapeRe(t)}(?:'s|s|es|ed|ing)?\\b`, "i");
  const m = example.match(re);
  if (m == null || m.index === undefined) {
    const re2 = new RegExp(`\\b${escapeRe(t)}`, "i");
    const m2 = example.match(re2);
    if (m2 == null || m2.index === undefined) return null;
    return { start: m2.index, end: m2.index + m2[0].length };
  }
  let { index: start } = m;
  let end = start + m[0].length;

  if (pos === "v") {
    const rest = example.slice(end);
    const pm = rest.match(
      /^\s+(by|to|for|with|from|into|onto|up|out|off|on|in|over|away|across|along|through)\b/i
    );
    if (pm) end += pm[0].length;
  }

  return { start, end };
}

/** 英語例文を見出し語で分割（ハイライト用） */
export function splitExampleAroundTerm(
  example: string,
  term: string,
  pos?: ToeicWord["partOfSpeech"]
): { before: string; match: string; after: string; found: boolean } {
  const range = findTermRange(example, term, pos);
  if (!range) {
    return { before: example, match: "", after: "", found: false };
  }
  return {
    before: example.slice(0, range.start),
    match: example.slice(range.start, range.end),
    after: example.slice(range.end),
    found: true,
  };
}
