import { Suspense } from "react";
import { WordsListClient } from "./words-list-client";

function WordsListFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-muted-foreground">
      読み込み中…
    </div>
  );
}

export default function WordsPage() {
  return (
    <Suspense fallback={<WordsListFallback />}>
      <WordsListClient />
    </Suspense>
  );
}
