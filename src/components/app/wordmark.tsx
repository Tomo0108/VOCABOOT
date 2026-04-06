import { cn } from "@/lib/utils";

type AppWordmarkProps = {
  className?: string;
  size?: "md" | "lg" | "hero";
};

/** アプリ名は Vocaboost（語彙 + boost）。ゴールドで後半を強調 */
export function AppWordmark({ className, size = "lg" }: AppWordmarkProps) {
  const text =
    size === "hero"
      ? "text-[clamp(2.7rem,9.5vw,4rem)] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[clamp(3.1rem,8vw,4.25rem)]"
      : size === "lg"
        ? "text-2xl sm:text-[1.65rem]"
        : "text-lg font-semibold";

  const title = (
    <p
      className={cn(
        "font-semibold leading-none tracking-tight text-foreground drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]",
        text
      )}
    >
      <span className="font-bold">Voca</span>
      <span className="font-bold text-primary">boost</span>
    </p>
  );

  if (size === "hero") {
    return (
      <div className={cn("select-none", className)}>
        <div className="wordmark-hero-glow">
          <span className="wordmark-hero-glow-spin" aria-hidden />
          <div className="wordmark-hero-glow__inner px-4 py-3 sm:px-6 sm:py-4">
            {title}
          </div>
        </div>
      </div>
    );
  }

  return <div className={cn("select-none", className)}>{title}</div>;
}
