import { getStored, setStored } from "@/lib/storage";

const KEY = "vocaboost.activity.v1";

export type ActivityBuckets = Record<string, number>;

type StoredActivity = {
  buckets: ActivityBuckets;
};

const DEFAULTS: StoredActivity = { buckets: {} };

function hourKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}`;
}

function parseHourKey(key: string): number | null {
  const m = key.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const h = Number(m[4]);
  const dt = new Date(y, mo, d, h, 0, 0, 0);
  const t = dt.getTime();
  return Number.isFinite(t) ? t : null;
}

export async function getActivityBuckets(): Promise<ActivityBuckets> {
  const raw = await getStored<StoredActivity>(KEY, DEFAULTS);
  return raw?.buckets ?? {};
}

export async function recordSolved(count = 1, now = new Date()): Promise<void> {
  if (!Number.isFinite(count) || count <= 0) return;
  const key = hourKey(now);
  const cur = await getStored<StoredActivity>(KEY, DEFAULTS);
  const buckets = { ...(cur?.buckets ?? {}) };
  buckets[key] = (buckets[key] ?? 0) + count;

  // Keep last ~400 days to be safe.
  const cutoff = now.getTime() - 400 * 24 * 60 * 60 * 1000;
  for (const k of Object.keys(buckets)) {
    const t = parseHourKey(k);
    if (t != null && t < cutoff) delete buckets[k];
  }

  await setStored(KEY, { buckets });
}

