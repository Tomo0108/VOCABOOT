/**
 * meaningJa のカタカナ英語的表記を調査し、UTF-8 の Markdown を docs に出力する。
 * 実行: node scripts/scan-katakana-in-meanings.mjs
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const srcPath = join(root, "../src/data/toeic/words.enriched.generated.ts");
const outPath = join(root, "../docs/meaningJa-katakana-audit.md");
const text = fs.readFileSync(srcPath, "utf8");

const entryRe =
  /\{\s*id:\s*"[^"]+",\s*term:\s*"([^"]+)",\s*meaningJa:\s*"((?:\\.|[^"\\])*)"/g;

function unescapeMeaning(s) {
  return s
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\\\/g, "\\");
}

const katakanaRuns = [];
const seen = new Set();

for (const m of text.matchAll(entryRe)) {
  const term = m[1];
  const ja = unescapeMeaning(m[2]);
  const runs = ja.match(/[ァ-ヶー]{3,}/g);
  if (!runs) continue;
  const key = `${term}\t${ja}`;
  if (seen.has(key)) continue;
  seen.add(key);
  katakanaRuns.push({ term, ja, runs: [...new Set(runs)] });
}
katakanaRuns.sort((a, b) => a.term.localeCompare(b.term));

const katakanaOnly = [];
for (const m of text.matchAll(entryRe)) {
  const term = m[1];
  const ja = unescapeMeaning(m[2]);
  const hasKanji = /[\u3400-\u9FFF\uF900-\uFAFF]/.test(ja);
  const hasHiragana = /[\u3040-\u309F]/.test(ja);
  const hasKatakana = /[\u30A0-\u30FF]/.test(ja);
  if (hasKatakana && !hasKanji && !hasHiragana) {
    katakanaOnly.push({ term, ja });
  }
}
katakanaOnly.sort((a, b) => a.term.localeCompare(b.term));

const lines = [
  "# meaningJa におけるカタカナ表記の調査",
  "",
  "データ: `src/data/toeic/words.enriched.generated.ts`（自動抽出）",
  "",
  "## 調査の見方",
  "",
  "- **カタカナのみ**: 和訳に**漢字もひらがなも含まれない**行。英語をカタカナにしただけの「訳」に見えやすい（学習用には和語・漢語の併記が望ましいケースが多い）。",
  "- **3文字以上のカタカナ連続を含む**: 業界用語として定着している語（エレベーター、コンプライアンス等）も多く、**すべてが不適切という意味ではない**。",
  "",
  `## 1. カタカナのみの meaningJa（${katakanaOnly.length} 件）`,
  "",
  "| term | meaningJa |",
  "|------|-----------|",
];

for (const r of katakanaOnly) {
  const safe = r.ja.replace(/\|/g, "\\|");
  lines.push(`| ${r.term} | ${safe} |`);
}

lines.push(
  "",
  `## 2. 3文字以上のカタカナ列を含む meaningJa（${katakanaRuns.length} 件・重複除く）`,
  "",
  "和語・漢字と併記されているものが大半。必要に応じて個別に表現を見直す。",
  "",
  "| term | 検出カタカナ | meaningJa |",
  "|------|-------------|-------------|"
);

for (const r of katakanaRuns) {
  const safeJa = r.ja.replace(/\|/g, "\\|");
  const safeRuns = r.runs.join(", ").replace(/\|/g, "\\|");
  lines.push(`| ${r.term} | ${safeRuns} | ${safeJa} |`);
}

lines.push(
  "",
  "---",
  "",
  "再生成: `node scripts/scan-katakana-in-meanings.mjs`",
  ""
);

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);
console.log(`katakana-only: ${katakanaOnly.length}, with 3+ katakana run: ${katakanaRuns.length}`);
