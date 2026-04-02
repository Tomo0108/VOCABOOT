"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Screen } from "@/components/app/screen";
import { GoalPill } from "@/components/app/goal-pill";
import { cn } from "@/lib/utils";
import { VOCABOOT_SETTINGS_INTRO } from "@/lib/product";
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
      subtitle="表示・復習の間隔 · TOEIC 800点ライン向けの調整"
      icon={<Settings2 className="h-5 w-5" />}
    >
      <div className="space-y-2">
        <GoalPill />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {VOCABOOT_SETTINGS_INTRO}
        </p>
      </div>
      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">外観</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            端末の表示設定に合わせる場合は「自動」を選びます。
          </p>
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
              いまの表示: {resolvedTheme === "dark" ? "ダーク" : "ライト"}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">学習中</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">復習間隔を詰める</div>
              <div className="text-xs text-muted-foreground">
                オンにすると次回までの日数がやや短くなります
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
              <div className="text-sm font-medium">例文を出す</div>
              <div className="text-xs text-muted-foreground">和訳の下に例文を表示</div>
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
