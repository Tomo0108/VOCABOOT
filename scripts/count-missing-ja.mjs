import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("src/data/toeic/words.enriched.generated.ts");
const s = await fs.readFile(OUT, "utf8");
const wordLines = s.split("\n").filter((l) => /^\s+\{ id:/.test(l));
const noJa = wordLines.filter((l) => !l.includes("meaningJa"));
console.log("total words:", wordLines.length);
console.log("missing meaningJa:", noJa.length);
console.log(noJa.slice(0, 20));
