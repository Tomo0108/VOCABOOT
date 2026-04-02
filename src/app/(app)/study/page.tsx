"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, focusRingLink } from "@/lib/utils";
import { Screen } from "@/components/app/screen";
import { BookOpen, Sparkles } from "lucide-react";

export default function StudyPage() {
  return (
    <Screen
      title="学習"
      subtitle="10語ずつ、短いセットで進めます。"
      icon={<BookOpen className="h-5 w-5" />}
    >
      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
            クイックスタート
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Link
            href="/study/session?mode=new&n=10"
            className={cn(
              buttonVariants({ size: "lg" }),
              focusRingLink,
              "h-14 rounded-2xl shadow-sm transition-colors"
            )}
          >
            新規 10語
          </Link>
          <Link
            href="/study/session?mode=mix&n=10&offset=0"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              focusRingLink,
              "h-14 rounded-2xl shadow-sm transition-colors"
            )}
          >
            ミックス 10語
          </Link>
        </CardContent>
      </Card>
    </Screen>
  );
}
