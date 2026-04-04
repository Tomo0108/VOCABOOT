/**
 * public/icon-pop-source.png（正方形・外周透過のマスター）から PWA 用 PNG を書き出す。
 * 依存: sharp（devDependencies）
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const masterPath = join(publicDir, "icon-pop-source.png");

/** @param {number} size */
async function resizePngPreserveAlpha(size) {
  return sharp(readFileSync(masterPath))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

/**
 * 不透明キャンバスに中央合成（iOS / maskable 向け）
 * @param {number} canvas
 * @param {number} scale 0..1 マスター相当の一辺の比率
 */
async function compositeOnBlack(canvas, scale) {
  const inner = Math.round(canvas * scale);
  const innerBuf = await sharp(readFileSync(masterPath))
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const left = Math.round((canvas - inner) / 2);
  const top = Math.round((canvas - inner) / 2);
  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: innerBuf, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  const master192 = await resizePngPreserveAlpha(192);
  await sharp(master192).toFile(join(publicDir, "icon-192.png"));

  const master512 = await resizePngPreserveAlpha(512);
  await sharp(master512).toFile(join(publicDir, "icon-512.png"));

  const appleBuf = await compositeOnBlack(180, 0.88);
  await sharp(appleBuf).toFile(join(publicDir, "apple-touch-icon.png"));

  const maskBuf = await compositeOnBlack(512, 0.78);
  await sharp(maskBuf).toFile(join(publicDir, "icon-maskable-512.png"));

  console.log(
    "Wrote icon-192.png, icon-512.png, apple-touch-icon.png, icon-maskable-512.png from icon-pop-source.png"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
