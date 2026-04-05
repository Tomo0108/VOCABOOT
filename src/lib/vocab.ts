import { TOEIC_WORDS, type ToeicWord } from "@/data/toeic/words";

export type { ToeicWord };

const WORD_BY_ID = new Map<string, ToeicWord>(TOEIC_WORDS.map((w) => [w.id, w]));

export function getAllWords(): ToeicWord[] {
  return TOEIC_WORDS;
}

export function getWordById(id: string): ToeicWord | undefined {
  return WORD_BY_ID.get(id);
}

