"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Screen } from "@/components/app/screen";
import { cn } from "@/lib/utils";
import { getPreferences, setPreferences, type AppPreferences } from "@/lib/preferences";
import { Monitor, Moon, Settings2, Sun } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await getPreferences();
      if (!cancelled) setPrefs(p);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function updatePrefs(patch: Partial<AppPreferences>) {
    const next = await setPreferences(patch);
    setPrefs(next);
  }

  return (
    <Screen
      title="設定"
      subtitle="表示と復習の間隔を調整できます。"
      icon={<Settings2 className="h-5 w-5" />}
    >
      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">外観</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!mounted ? (
            <p className="sr-only">テーマを読み込み中です。</p>
          ) : null}
          <div
            className={cn("grid grid-cols-3 gap-2", !mounted && "animate-pulse")}
            role="group"
            aria-busy={!mounted}
            aria-label="カラーテーマ"
          >
            {(
              [
                { id: "light" as const, label: "ライト", icon: Sun },
                { id: "dark" as const, label: "ダーク", icon: Moon },
                { id: "system" as const, label: "自動", icon: Monitor },
              ] as const
            ).map(({ id, label, icon: Icon }) => {
              const active = mounted && theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "border-primary/50 bg-primary/15 text-foreground"
                      : "border-border/80 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 opacity-90" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
          {mounted ? (
            <p className="text-[11px] text-muted-foreground">
              現在: {resolvedTheme === "dark" ? "ダーク" : "ライト"}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">学習</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">復習間隔を短くする</div>
              <div className="text-xs text-muted-foreground">
                次の復習までの日数をやや短めに設定します
              </div>
            </div>
            <Switch
              checked={prefs?.compactSchedule ?? false}
              disabled={prefs == null}
              onCheckedChange={(checked) => void updatePrefs({ compactSchedule: Boolean(checked) })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">例文を表示する</div>
              <div className="text-xs text-muted-foreground">和訳と一緒に例文を出します</div>
            </div>
            <Switch
              checked={prefs?.showExample ?? true}
              disabled={prefs == null}
              onCheckedChange={(checked) => void updatePrefs({ showExample: Boolean(checked) })}
            />
          </div>
        </CardContent>
      </Card>
    </Screen>
  );
}
