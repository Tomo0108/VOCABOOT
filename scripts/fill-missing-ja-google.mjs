/**
 * Wiktionary だけでは埋まらない meaningJa を Google 翻訳（非公式 gtx）で補完します。
 * 既存の meaningJa 行は変更しません。
 *
 * Usage: node scripts/fill-missing-ja-google.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("src/data/toeic/words.enriched.generated.ts");
const DELAY_MS = 140;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateEnJa(term) {
  const u =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=" +
    encodeURIComponent(term);
  const res = await fetch(u, {
    headers: { "user-agent": "toeic-vocaboot/0.1 (dataset builder)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const ja = data?.[0]?.[0]?.[0];
  if (typeof ja !== "string" || !ja.trim()) throw new Error("empty translation");
  return ja.trim();
}

async function main() {
  let raw = await fs.readFile(OUT, "utf8");
  const lines = raw.split("\n");
  let filled = 0;
  let i = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!/^\s+\{ id:/.test(line) || line.includes("meaningJa")) continue;

    const m = line.match(/term:\s*("(?:\\.|[^"\\])*")/);
    if (!m) continue;
    const term = JSON.parse(m[1]);
    process.stdout.write(`\r${++i} ${term.slice(0, 24).padEnd(24)}`);

    let ja;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        ja = await translateEnJa(term);
        break;
      } catch {
        await sleep(500 * (attempt + 1));
      }
    }
    if (!ja) {
      console.error("\nfailed:", term);
      continue;
    }

    const escaped = JSON.stringify(ja);
    lines[li] = line.replace(/\s*\},?\s*$/, `, meaningJa: ${escaped} },`);
    filled++;
    await sleep(DELAY_MS);

    if (filled % 80 === 0) {
      await fs.writeFile(OUT, lines.join("\n"), "utf8");
    }
  }

  const gi = lines.findIndex((l) => l.startsWith("// Generated at:"));
  if (gi >= 0) {
    lines[gi] = `// Generated at: ${new Date().toISOString()} (+ meaningJa gap-fill: Google gtx; verify for instruction)`;
  }

  await fs.writeFile(OUT, lines.join("\n"), "utf8");
  console.log(`\ndone. filled ${filled} entries → ${OUT}`);
}

await main();
