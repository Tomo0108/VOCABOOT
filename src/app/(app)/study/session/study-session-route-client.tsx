"use client";

import { useSearchParams } from "next/navigation";
import { StudySessionClient } from "./study-session-client";

/**
 * クエリ変更時にセッション UI を再マウントし、同一パス内ナビで状態が残る不具合を防ぐ。
 */
export function StudySessionRouteClient() {
  const sp = useSearchParams();
  return <StudySessionClient key={sp.toString()} />;
}
