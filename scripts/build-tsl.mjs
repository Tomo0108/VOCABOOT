import fs from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(
  "src/data/sources/tsl/tsl_11_alphabetized_description.txt"
);
const OUT = path.resolve("src/data/toeic/words.tsl.generated.ts");

function normalizeTerm(s) {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\u2019/g, "'"); // curly apostrophe -> '
}

function toId(term) {
  return (
    "tsl_" +
    term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );
}

const raw = await fs.readFile(SRC, "utf8");
const lines = raw.split(/\r?\n/);

/** @type {string[]} */
const terms = [];
for (const line of lines) {
  // e.g. "316.  deadline"
  const m = line.match(/^\s*\d+\.\s+(.*)\s*$/);
  if (!m) continue;
  const term = normalizeTerm(m[1] ?? "");
  if (!term) continue;
  terms.push(term);
}

// Deduplicate while preserving order
const seen = new Set();
const uniq = [];
for (const t of terms) {
  const k = t.toLowerCase();
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(t);
}

const now = new Date().toISOString();

const header = `// GENERATED FILE. DO NOT EDIT.
// Source: TOEIC Service List (TSL) 1.1 (Browne, C. & Culligan, B., 2016)
// Downloaded from: https://www.newgeneralservicelist.org/toeic-list
// Source file: src/data/sources/tsl/tsl_11_alphabetized_description.txt
// Generated at: ${now}
//
// License: CC BY-SA 4.0 (see https://creativecommons.org/licenses/by-sa/4.0/)
//
// Notes:
// - This file intentionally stores only the headword list (no copyrighted test items).
// - Japanese meanings/examples can be layered on later from compatible licensed sources.

export type ToeicWord = {
  id: string;
  term: string;
  reading?: string;
  meaningJa?: string;
  partOfSpeech?: "n" | "v" | "adj" | "adv" | "prep" | "conj" | "phr";
  exampleEn?: string;
  exampleJa?: string;
  tags?: string[];
};

export const TOEIC_WORDS: ToeicWord[] = [
`;

const body = uniq
  .map((term) => {
    const id = toId(term);
    return `  { id: ${JSON.stringify(id)}, term: ${JSON.stringify(
      term
    )} },`;
  })
  .join("\n");

const footer = "\n];\n";

await fs.writeFile(OUT, header + body + footer, "utf8");

console.log(`TSL words: ${uniq.length}`);
console.log(`Wrote: ${OUT}`);

