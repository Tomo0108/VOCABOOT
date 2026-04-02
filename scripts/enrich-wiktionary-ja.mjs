import fs from "node:fs/promises";
import path from "node:path";

const BASE = path.resolve("src/data/toeic/words.tsl.generated.ts");
const CACHE_DIR = path.resolve("src/data/sources/wiktionary");
const CACHE_PATH = path.resolve("src/data/sources/wiktionary/en-ja.cache.json");
const SOURCES_MD = path.resolve("src/data/sources/wiktionary/SOURCES.md");
const OUT = path.resolve("src/data/toeic/words.enriched.generated.ts");

function uniq(arr) {
  return [...new Set(arr)];
}

function normalizeTerm(s) {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\u2019/g, "'")
    .replace(/\u2013|\u2014/g, "-");
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

async function loadBaseTerms() {
  const src = await fs.readFile(BASE, "utf8");
  const terms = [];
  const re = /term:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    terms.push(normalizeTerm(m[1] ?? ""));
  }
  return uniq(terms).filter(Boolean);
}

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

function extractJapaneseTranslations(wikitext) {
  // Wiktionary wikitext commonly contains translation templates like:
  // {{t|ja|締め切り}} / {{t+|ja|締め切り}} / {{t|ja|締め切り|tr=...}}
  const found = [];
  const re = /\{\{t\+?\|ja\|([^|}]+)(?:\|[^}]*)?\}\}/g;
  let m;
  while ((m = re.exec(wikitext))) {
    const t = (m[1] ?? "").trim();
    if (!t) continue;
    // Skip romanization-only entries; keep kana/kanji
    found.push(t);
  }

  // Some entries use {{t-check|ja|...}}
  const re2 = /\{\{t-check\|ja\|([^|}]+)(?:\|[^}]*)?\}\}/g;
  while ((m = re2.exec(wikitext))) {
    const t = (m[1] ?? "").trim();
    if (!t) continue;
    found.push(t);
  }

  return uniq(
    found
      .map((s) => s.replace(/\[\[|\]\]/g, "").trim())
      .filter((s) => s.length > 0)
  );
}

async function fetchWiktionaryWikitext(title) {
  const url =
    "https://en.wiktionary.org/w/api.php?" +
    new URLSearchParams({
      action: "parse",
      page: title,
      prop: "wikitext",
      format: "json",
      origin: "*",
    }).toString();

  const res = await fetch(url, {
    headers: { "user-agent": "toeic-vocaboot/0.1 (dataset builder)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const wikitext = json?.parse?.wikitext?.["*"] ?? "";
  const revid = json?.parse?.revid ?? null;
  return { wikitext, revid };
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const terms = await loadBaseTerms();
  const cache = await loadCache();

  const missing = terms.filter((t) => !cache[t]?.translations);
  console.log(`Terms: ${terms.length}`);
  console.log(`Missing: ${missing.length}`);

  const concurrency = 4;
  let i = 0;

  async function worker() {
    while (true) {
      const idx = i++;
      const term = missing[idx];
      if (!term) return;

      // Rate limit: small jitter helps avoid bursts
      await sleep(120 + Math.floor(Math.random() * 80));

      try {
        const { wikitext, revid } = await fetchWiktionaryWikitext(term);
        const translations = extractJapaneseTranslations(wikitext).slice(0, 8);
        cache[term] = {
          source: "en.wiktionary.org",
          revid,
          fetchedAt: new Date().toISOString(),
          translations,
        };
      } catch (e) {
        cache[term] = {
          source: "en.wiktionary.org",
          revid: null,
          fetchedAt: new Date().toISOString(),
          translations: [],
          error: String(e?.message ?? e),
        };
      }

      if (idx % 50 === 0) {
        await saveCache(cache);
        console.log(`Progress: ${idx}/${missing.length}`);
      }
    }
  }

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  await saveCache(cache);

  // Generate merged dataset file
  const lines = [];
  lines.push(`// GENERATED FILE. DO NOT EDIT.
// Base words: TSL 1.1 (see src/data/toeic/words.tsl.generated.ts)
// Enrichment: English Wiktionary Japanese translations (CC BY-SA 4.0)
// Generated at: ${new Date().toISOString()}
//
// Attribution:
// - Wiktionary contributors (https://en.wiktionary.org/) CC BY-SA 4.0
// - We store per-term revision ids in src/data/sources/wiktionary/en-ja.cache.json
`);

  lines.push(`export type ToeicWord = {
  id: string;
  term: string;
  reading?: string;
  meaningJa?: string;
  partOfSpeech?: "n" | "v" | "adj" | "adv" | "prep" | "conj" | "phr";
  exampleEn?: string;
  exampleJa?: string;
  tags?: string[];
};\n`);

  lines.push("export const TOEIC_WORDS: ToeicWord[] = [");
  for (const term of terms) {
    const id = toId(term);
    const translations = cache[term]?.translations ?? [];
    const meaningJa =
      translations.length > 0 ? translations.join("、") : undefined;
    lines.push(
      `  { id: ${JSON.stringify(id)}, term: ${JSON.stringify(term)}${
        meaningJa ? `, meaningJa: ${JSON.stringify(meaningJa)}` : ""
      } },`
    );
  }
  lines.push("];\n");

  await fs.writeFile(OUT, lines.join("\n"), "utf8");

  // Write sources doc (idempotent overwrite)
  const sourcesMd = `## Wiktionary (English) → Japanese translations

- **Site**: \`https://en.wiktionary.org/\`
- **API**: \`action=parse\` (wikitext)
- **License**: CC BY-SA 4.0 (\`https://creativecommons.org/licenses/by-sa/4.0/\`)
- **Cache**: \`en-ja.cache.json\` (stores per-term \`revid\`, fetched time, translations)

### How it is used in this app

- We enrich the TSL headword list with Japanese translations extracted from Wiktionary templates.
- To preserve accuracy and traceability, we keep each entry's \`revid\` so you can audit the exact Wiktionary revision used.
`;
  await fs.writeFile(SOURCES_MD, sourcesMd, "utf8");

  console.log(`Wrote: ${OUT}`);
}

await main();

