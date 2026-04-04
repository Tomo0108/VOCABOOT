import { cn } from "@/lib/utils";

type AppWordmarkProps = {
  className?: string;
  size?: "md" | "lg" | "hero";
};

/** アプリ名は Vocaboot（語彙 + boot）。ゴールドで後半を強調 */
export function AppWordmark({ className, size = "lg" }: AppWordmarkProps) {
  const text =
    size === "hero"
      ? "text-[2rem] font-bold leading-[1.05] tracking-tight sm:text-4xl"
      : size === "lg"
        ? "text-2xl sm:text-[1.65rem]"
        : "text-lg font-semibold";
  return (
    <div className={cn("select-none", className)}>
      <p
        className={cn(
          "font-semibold leading-none tracking-tight text-foreground",
          text
        )}
      >
        <span className="font-bold">Voca</span>
        {size === "hero" ? (
          <span className="inline-flex items-baseline font-bold text-primary">
            b
            <span className="vocaboot-eyes" aria-hidden>
              <span className="vocaboot-eye">
                <span className="vocaboot-eye__ball">
                  <span className="vocaboot-eye__pupil" />
                </span>
              </span>
              <span className="vocaboot-eye vocaboot-eye--late">
                <span className="vocaboot-eye__ball">
                  <span className="vocaboot-eye__pupil" />
                </span>
              </span>
            </span>
            <span className="sr-only">oo</span>
            t
          </span>
        ) : (
          <span className="font-bold text-primary">boot</span>
        )}
      </p>
    </div>
  );
}
