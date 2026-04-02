import { get, set } from "idb-keyval";

export async function getStored<T>(key: string, fallback: T): Promise<T> {
  const v = await get(key);
  return (v as T | undefined) ?? fallback;
}

export async function setStored<T>(key: string, value: T): Promise<void> {
  await set(key, value);
}

