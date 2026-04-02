import { TOEIC_WORDS, type ToeicWord } from "@/data/toeic/words";

export type { ToeicWord };

export function getAllWords(): ToeicWord[] {
  return TOEIC_WORDS;
}

