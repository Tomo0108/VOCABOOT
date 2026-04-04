import { readFileSync, writeFileSync } from "fs";

const FILE = "src/data/toeic/words.enriched.generated.ts";
let content = readFileSync(FILE, "utf8");

// Remove the stray closing bracket that was placed after line 226
// Pattern: '];\n  { id: "tsl_circulation"' → '  { id: "tsl_circulation"'
const marker = '];\n  { id: "tsl_circulation"';
const replacement = '  { id: "tsl_circulation"';

if (content.includes(marker)) {
  content = content.replace(marker, replacement);
  writeFileSync(FILE, content);
  console.log("Fixed: removed stray closing bracket");
} else {
  console.log("Marker not found — file may already be correct");
}

// Count entries
const count = (content.match(/^  \{ id:/gm) || []).length;
console.log("Total entries:", count);
