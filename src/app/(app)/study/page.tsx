"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, focusRingLink } from "@/lib/utils";
import { Screen } from "@/components/app/screen";
import { GoalPill } from "@/components/app/goal-pill";
import { VOCABOOT_STUDY_SUBTITLE } from "@/lib/product";
import { BookOpen, Sparkles } from "lucide-react";

export default function StudyPage() {
  return (
    <Screen
      title="学習"
      subtitle={VOCABOOT_STUDY_SUBTITLE}
      icon={<BookOpen className="h-5 w-5" />}
    >
      <GoalPill className="mb-1" />
      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
            いま始める
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
            未学習を10語
          </Link>
          <Link
            href="/study/session?mode=mix&n=10&offset=0"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              focusRingLink,
              "h-14 rounded-2xl shadow-sm transition-colors"
            )}
          >
            リストを10語
          </Link>
        </CardContent>
      </Card>
    </Screen>
  );
}
