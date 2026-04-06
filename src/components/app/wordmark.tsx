import { cn } from "@/lib/utils";

type AppWordmarkProps = {
  className?: string;
  size?: "md" | "lg" | "hero";
};

/** アプリ名は Vocaboost（語彙 + boost）。ゴールドで後半を強調 */
export function AppWordmark({ className, size = "lg" }: AppWordmarkProps) {
  const text =
    size === "hero"
      ? "text-[2.35rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl"
      : size === "lg"
        ? "text-2xl sm:text-[1.65rem]"
        : "text-lg font-semibold";
  return (
    <div className={cn("select-none", className)}>
      <p
        className={cn(
          "font-semibold leading-none tracking-tight text-foreground drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]",
          text
        )}
      >
        <span className="font-bold">Voca</span>
        <span className="font-bold text-primary">boost</span>
      </p>
    </div>
  );
}
