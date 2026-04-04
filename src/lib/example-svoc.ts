import type { ToeicWord } from "@/lib/vocab";

export type SvocParts = {
  s: string;
  v: string;
  o?: string;
  c?: string;
};

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

const AUX_END =
  /\s+(will|would|shall|should|can|could|must|may|might|do|does|did|have|has|had|is|are|was|were|am|been|being)\s*$/i;

/** 動詞述語向け: 左側末尾の助動詞・be/have/do を剥がして S と V の前置部分に分ける */
function peelAuxiliaries(left: string): { subject: string; auxTail: string } {
  let subject = left.trimEnd();
  const auxParts: string[] = [];
  while (true) {
    const m = subject.match(AUX_END);
    if (!m || m.index === undefined) break;
    auxParts.unshift(m[1]!);
    subject = subject.slice(0, m.index).trimEnd();
  }
  return { subject, auxTail: auxParts.join(" ") };
}

/** 文末の句読点を除いた O 相当 */
function trimClauseRight(s: string) {
  return s.replace(/^[,\s;]+/, "").replace(/\.*$/, "").trim();
}

/**
 * 例文から SVOC を推定（データに無い場合のベストエフォート）
 */
export function inferSvoc(word: ToeicWord, exampleEn: string): SvocParts | null {
  const ex = exampleEn.trim();
  if (!ex) return null;

  const pos = word.partOfSpeech;
  const range = findTermRange(ex, word.term, pos);
  if (!range) {
    return {
      s: "—",
      v: ex,
      o: undefined,
      c: undefined,
    };
  }

  const head = ex.slice(range.start, range.end).trim();
  const left = ex.slice(0, range.start);
  const right = ex.slice(range.end);

  if (pos === "v") {
    const { subject, auxTail } = peelAuxiliaries(left);
    const v = [auxTail, head].filter(Boolean).join(" ").trim();
    const o = trimClauseRight(right) || undefined;
    return {
      s: subject || "—",
      v: v || head,
      o,
    };
  }

  if (pos === "adj") {
    const beforeHead = left;
    const copulaRe = /\b(is|are|was|were|'s|'re)\b/gi;
    let lastCop: RegExpExecArray | null = null;
    let m: RegExpExecArray | null;
    copulaRe.lastIndex = 0;
    while ((m = copulaRe.exec(beforeHead)) !== null) lastCop = m;
    if (lastCop) {
      const s = beforeHead.slice(0, lastCop.index).trim();
      const vMid = beforeHead.slice(lastCop.index).trim();
      const c = trimClauseRight((head + right).replace(/\.$/, "")) || head;
      return {
        s: s || "—",
        v: vMid || "—",
        c,
      };
    }
    const { subject, auxTail } = peelAuxiliaries(left);
    const c = trimClauseRight(head + right) || head;
    const v = [auxTail].filter(Boolean).join(" ").trim() || "（be動詞など）";
    return {
      s: subject || "—",
      v,
      c,
    };
  }

  if (pos === "adv") {
    const before = left.trimEnd();
    const after = trimClauseRight(right);
    const comma = before.lastIndexOf(",");
    const main = comma >= 0 ? before.slice(comma + 1).trim() : before;
    return {
      s: main || before || "—",
      v: "（述語部・文脈に応じて修飾）",
      c: `${head}${after ? ` … ${after}` : ""}`,
    };
  }

  if (pos === "n" || pos === "prep" || pos === "conj" || pos === "phr") {
    const { subject, auxTail } = peelAuxiliaries(left);
    const o = trimClauseRight(head + right) || head;
    return {
      s: subject || "—",
      v: auxTail || "（述語）",
      o,
    };
  }

  return {
    s: left.trim() || "—",
    v: head,
    o: trimClauseRight(right) || undefined,
  };
}
