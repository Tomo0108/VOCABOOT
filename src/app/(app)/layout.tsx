import type { ReactNode } from "react";
import { BottomNav } from "@/components/app/bottom-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[200] -translate-y-20 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground opacity-0 shadow-md transition-all focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        メインへスキップ
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none"
      >
        <div className="mx-auto w-full max-w-md pb-24 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:pl-[max(1.25rem,env(safe-area-inset-left))] sm:pr-[max(1.25rem,env(safe-area-inset-right))]">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

