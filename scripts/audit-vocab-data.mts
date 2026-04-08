/**
 * 単語データの一括監査（実行: npx tsx scripts/audit-vocab-data.mts）
 */
import { TOEIC_WORDS } from "../src/data/toeic/words.enriched.generated";
import { getWordDifficulty } from "../src/lib/word-meta";

const POS = new Set(["n", "v", "adj", "adv", "prep", "conj", "phr"]);

function expectedId(term: string): string {
  return (
    "tsl_" +
    term
      .toLowerCase()
      .replace(/['.-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
  );
}

const dupId = new Map<string, number>();
const dupTerm = new Map<string, number>();
for (const w of TOEIC_WORDS) {
  dupId.set(w.id, (dupId.get(w.id) ?? 0) + 1);
  dupTerm.set(w.term.toLowerCase(), (dupTerm.get(w.term.toLowerCase()) ?? 0) + 1);
}

const idDups = [...dupId.entries()].filter(([, c]) => c > 1);
const termDups = [...dupTerm.entries()].filter(([, c]) => c > 1);

const emptyJa = TOEIC_WORDS.filter((w) => !w.meaningJa?.trim());
const missingPos = TOEIC_WORDS.filter((w) => !w.partOfSpeech);
const badPos = TOEIC_WORDS.filter(
  (w) => w.partOfSpeech && !POS.has(w.partOfSpeech)
);

/** 和訳に CJK・仮名・全角記号が一切ない */
const onlyLatinJa = TOEIC_WORDS.filter((w) => {
  const s = w.meaningJa?.trim() ?? "";
  return (
    s.length > 0 &&
    !/[\u3000-\u303f\u3040-\u30ff\u3400-\u9fff\uff00-\uffef]/.test(s)
  );
});

const jaTooShort = TOEIC_WORDS.filter((w) => (w.meaningJa?.trim().length ?? 0) < 2);

const exEnNoJa = TOEIC_WORDS.filter(
  (w) => w.exampleEn?.trim() && !w.exampleJa?.trim()
);
const exJaNoEn = TOEIC_WORDS.filter(
  (w) => w.exampleJa?.trim() && !w.exampleEn?.trim()
);

const idBad = TOEIC_WORDS.filter((w) => w.id !== expectedId(w.term));

const diffExplicit = TOEIC_WORDS.filter((w) => w.difficulty != null);
const diffDist: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
for (const w of TOEIC_WORDS) {
  diffDist[getWordDifficulty(w)]++;
}

const meaningEqualsTerm = TOEIC_WORDS.filter(
  (w) => w.meaningJa.trim().toLowerCase() === w.term.toLowerCase()
);

/** カタカナのみ（漢字・ひらがななし）— 方針次第で見直し候補 */
const katakanaOnly = TOEIC_WORDS.filter((w) => {
  const ja = w.meaningJa ?? "";
  const hasKanji = /[\u3400-\u9FFF]/.test(ja);
  const hasHira = /[\u3040-\u309F]/.test(ja);
  const hasKata = /[\u30A0-\u30FF]/.test(ja);
  return hasKata && !hasKanji && !hasHira;
});

/** 例文に見出し語が含まれない（大文字小文字無視） */
const exampleMissingTerm = TOEIC_WORDS.filter((w) => {
  const ex = w.exampleEn?.trim();
  if (!ex) return false;
  const t = w.term.toLowerCase();
  if (ex.toLowerCase().includes(t)) return false;
  const base = t.replace(/[-']/g, "");
  return !ex.toLowerCase().includes(base);
});

/** 品詞と語形の単純チェック */
const posHeuristicWarn: { term: string; pos: string; reason: string }[] = [];
for (const w of TOEIC_WORDS) {
  const t = w.term.toLowerCase();
  const p = w.partOfSpeech;
  if (p === "adj" && (t.endsWith("ly") || t.endsWith("tion") || t.endsWith("ness"))) {
    posHeuristicWarn.push({ term: w.term, pos: p, reason: "形容詞だが語尾が副詞・名詞的" });
  }
  if (p === "adv" && (t.endsWith("tion") || t.endsWith("ment"))) {
    posHeuristicWarn.push({ term: w.term, pos: p, reason: "副詞だが名詞的語尾" });
  }
}

console.log("=== VOCABOOST 単語データ監査 ===\n");
console.log(`総件数: ${TOEIC_WORDS.length}`);
console.log(`重複 id: ${idDups.length}`, idDups.length ? idDups : "");
console.log(`重複 term（表記ゆれ）: ${termDups.length} 組`);
if (termDups.length) console.log(termDups.slice(0, 20));
console.log(`meaningJa 空: ${emptyJa.length}`);
console.log(`品詞未設定: ${missingPos.length}`);
console.log(`不正な品詞値: ${badPos.length}`, badPos);
console.log(`和訳がラテン文字のみ: ${onlyLatinJa.length}`, onlyLatinJa.map((w) => w.term));
console.log(`和訳が1文字以下: ${jaTooShort.length}`, jaTooShort.map((w) => w.id));
console.log(`例文ENあり・JAなし: ${exEnNoJa.length}`);
console.log(`例文JAあり・ENなし: ${exJaNoEn.length}`);
console.log(`id が term からの期待値と不一致: ${idBad.length}`);
if (idBad.length) {
  console.log(
    idBad.slice(0, 30).map((w) => ({ id: w.id, term: w.term, expected: expectedId(w.term) }))
  );
}
console.log(`明示 difficulty あり: ${diffExplicit.length}（未設定は語長・品詞で推定）`);
console.log("推定難易度の分布:", diffDist);
console.log(`meaningJa === term（英単語のまま）: ${meaningEqualsTerm.length}`, meaningEqualsTerm.map((w) => w.term));
console.log(`meaningJa カタカナのみ: ${katakanaOnly.length} 件`);
if (katakanaOnly.length) {
  console.log(katakanaOnly.map((w) => `${w.term}\t${w.meaningJa}`).join("\n"));
}
console.log(`例文に見出し語が見つからない: ${exampleMissingTerm.length}`);
if (exampleMissingTerm.length) {
  console.log(exampleMissingTerm.slice(0, 40).map((w) => w.term));
}
console.log(`品詞ヒューリスティック警告: ${posHeuristicWarn.length}`);
if (posHeuristicWarn.length) {
  console.log(posHeuristicWarn.slice(0, 50));
}

/** 同一和訳を複数の見出し語が共有（学習上の区別が薄い可能性） */
const byJa = new Map<string, string[]>();
for (const w of TOEIC_WORDS) {
  const k = w.meaningJa.trim();
  if (!byJa.has(k)) byJa.set(k, []);
  byJa.get(k)!.push(w.term);
}
const jaDupGroups = [...byJa.entries()]
  .filter(([, terms]) => terms.length > 1)
  .sort((a, b) => b[1].length - a[1].length);
console.log(`\n同一 meaningJa を共有する見出し語のグループ数: ${jaDupGroups.length}`);
console.log(
  "（多い順・先頭15）:",
  jaDupGroups.slice(0, 15).map(([ja, terms]) => ({ ja, count: terms.length, terms }))
);
