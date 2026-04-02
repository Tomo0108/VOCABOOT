import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 通常背景の `Link`（ボトムナビと揃えたフォーカスリング） */
export const focusRingLink =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** ヒーロー（`bg-neutral-950`）上のゴールドCTA */
export const focusRingHeroPrimary =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

/** ヒーロー上の半透明・白枠CTA */
export const focusRingHeroGhost =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
