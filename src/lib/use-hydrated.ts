import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** クライアントでハイドレート済みか（SSR では常に false） */
export function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
