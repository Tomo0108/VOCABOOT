import fs from "node:fs/promises";
import path from "node:path";

// CMU Pronouncing Dictionary: word -> ARPABET (space-separated phonemes)
import * as cmu from "cmu-pronouncing-dictionary";

const TARGET = path.resolve("src/data/toeic/words.enriched.generated.ts");
const OVERRIDES = path.resolve("src/data/sources/ipa/overrides.json");

const ARPA_TO_IPA = {
  // vowels
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  IH: "ɪ",
  IY: "i",
  OW: "oʊ",
  OY: "ɔɪ",
  UH: "ʊ",
  UW: "u",
  // consonants
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  F: "f",
  G: "ɡ",
  HH: "h",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  P: "p",
  R: "ɹ",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

function stripDiacritics(s) {
  return s.normalize("NFKD").replace(/\p{Diacritic}/gu, "");
}

function normalizeKey(term) {
  return term
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\u2013|\u2014/g, "-");
}

function arpaToIpa(arpa) {
  const parts = arpa.split(/\s+/).filter(Boolean);
  let out = "";
  for (const raw of parts) {
    const m = raw.match(/^(.*?)([012])$/);
    const base = m ? m[1] : raw;
    const stress = m ? m[2] : null;
    const ipa = ARPA_TO_IPA[base];
    if (!ipa) continue;
    if (stress === "1") out += "ˈ" + ipa;
    else if (stress === "2") out += "ˌ" + ipa;
    else out += ipa;
  }
  return out || null;
}

/** @returns {string|null} ipa (no surrounding slashes) */
function lookupIpa(term, overrides) {
  const key0 = normalizeKey(term);
  if (overrides[key0]) return overrides[key0];

  /** @type {Record<string, string>} */
  // Package exports `{ dictionary: Record<string,string> }` in ESM.
  const dict = (cmu?.dictionary ?? cmu?.default?.dictionary ?? cmu?.default ?? cmu);

  const tryKeys = [];
  tryKeys.push(key0);
  tryKeys.push(stripDiacritics(key0));
  tryKeys.push(key0.replace(/-/g, ""));
  tryKeys.push(stripDiacritics(key0).replace(/-/g, ""));

  for (const k of tryKeys) {
    const arpa = dict[k];
    if (arpa) return arpaToIpa(arpa);
  }

  // hyphen/space split fallback: require all parts found
  const parts = key0.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const ipas = parts.map((p) => {
      if (overrides[p]) return overrides[p];
      const arpa = dict[p] ?? dict[stripDiacritics(p)];
      return arpa ? arpaToIpa(arpa) : null;
    });
    if (ipas.every(Boolean)) return ipas.join(" ");
  }

  return null;
}

async function loadOverrides() {
  try {
    const raw = await fs.readFile(OVERRIDES, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

function escapeTsString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function main() {
  const src = await fs.readFile(TARGET, "utf8");
  const overrides = await loadOverrides();

  const lines = src.split(/\r?\n/);
  const out = [];

  /** @type {{term: string, id: string}[]} */
  const missing = [];

  for (const line of lines) {
    // Only touch word rows (one object per line in this file).
    if (!line.includes("{ id:") || !line.includes("term:")) {
      out.push(line);
      continue;
    }
    if (line.includes("ipa:")) {
      out.push(line);
      continue;
    }

    const id = line.match(/id:\s*"([^"]+)"/)?.[1] ?? "";
    const term = line.match(/term:\s*"([^"]+)"/)?.[1] ?? "";
    if (!term) {
      out.push(line);
      continue;
    }

    const ipa = lookupIpa(term, overrides);
    if (!ipa) {
      missing.push({ term, id });
      out.push(line);
      continue;
    }

    // Insert right after `term: "...",`
    const patched = line.replace(
      /(term:\s*"[^"]+",)/,
      `$1 ipa: "${escapeTsString(ipa)}",`
    );
    out.push(patched);
  }

  if (missing.length > 0) {
    console.error(
      `IPA missing: ${missing.length}\n` +
        missing
          .slice(0, 80)
          .map((m) => `- ${m.term} (${m.id})`)
          .join("\n") +
        (missing.length > 80 ? `\n... and ${missing.length - 80} more` : "")
    );
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(path.dirname(OVERRIDES), { recursive: true });
  await fs.writeFile(TARGET, out.join("\n"), "utf8");
  console.log("OK: filled ipa for all words.");
}

await main();

