import { notFound } from "next/navigation";
import { getWordById } from "@/lib/vocab";
import WordDetailClient from "./word-detail-client";

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ wordId: string }>;
}) {
  const { wordId } = await params;
  const word = getWordById(decodeURIComponent(wordId));
  if (!word) notFound();
  return <WordDetailClient word={word} />;
}
