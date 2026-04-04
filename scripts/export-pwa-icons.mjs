/**
 * public/icon.svg / public/icon-maskable.svg から PWA 用 PNG を書き出す。
 * 依存: sharp（devDependencies）
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const fromSvg = (name) => readFileSync(join(publicDir, name));

async function main() {
  const master = fromSvg("icon.svg");
  const maskable = fromSvg("icon-maskable.svg");

  await sharp(master).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"));
  await sharp(master).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"));
  await sharp(master).resize(180, 180).png().toFile(join(publicDir, "apple-touch-icon.png"));

  await sharp(maskable).resize(512, 512).png().toFile(join(publicDir, "icon-maskable-512.png"));

  console.log("Wrote icon-192.png, icon-512.png, apple-touch-icon.png, icon-maskable-512.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
