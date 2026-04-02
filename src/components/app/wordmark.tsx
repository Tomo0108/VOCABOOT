import { cn } from "@/lib/utils";

type AppWordmarkProps = {
  className?: string;
  size?: "md" | "lg";
};

/** アプリ名は Vocaboot（語彙 + boot）。ゴールドで後半を強調 */
export function AppWordmark({ className, size = "lg" }: AppWordmarkProps) {
  const text =
    size === "lg" ? "text-2xl sm:text-[1.65rem]" : "text-lg font-semibold";
  return (
    <div className={cn("select-none", className)}>
      <p
        className={cn(
          "font-semibold leading-none tracking-tight text-foreground",
          text
        )}
      >
        <span className="font-bold">Voca</span>
        <span className="font-bold text-primary">boot</span>
      </p>
    </div>
  );
}
