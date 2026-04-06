"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, Home, Settings } from "lucide-react";

/** 画面遷移（route-transition）と揃えた減速カーブ */
const tabEase = "cubic-bezier(0.16, 1, 0.3, 1)";

const items = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/study", label: "学習", icon: BookOpen },
  { href: "/review", label: "復習", icon: Clock },
  { href: "/settings", label: "設定", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/90 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.875rem)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname?.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              style={{ transitionTimingFunction: tabEase }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-[10px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-xs",
                "transition-[color,background-color,transform,box-shadow] duration-300",
                "active:scale-[0.96] active:transition-[transform] active:duration-150",
                active
                  ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground active:bg-muted"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative flex flex-col items-center">
                <Icon
                  className={cn(
                    "h-5 w-5 origin-center transition-[transform,filter] duration-300",
                    active
                      ? "scale-110 text-primary drop-shadow-[0_1px_8px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                      : "scale-100"
                  )}
                  style={{ transitionTimingFunction: tabEase }}
                  aria-hidden
                />
                <span
                  className={cn(
                    "mt-1 h-0.5 max-w-full rounded-full bg-primary transition-[width,opacity] duration-300",
                    active ? "w-5 opacity-100" : "w-0 opacity-0"
                  )}
                  style={{ transitionTimingFunction: tabEase }}
                  aria-hidden
                />
              </span>
              <span
                className={cn(
                  "leading-none transition-[font-weight,letter-spacing,opacity] duration-300",
                  active ? "font-semibold tracking-tight" : "font-medium"
                )}
                style={{ transitionTimingFunction: tabEase }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
