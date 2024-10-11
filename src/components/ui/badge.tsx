import { ClassValue } from "clsx";
import { cn } from "../../lib/utils";

export default function Badge({
  className,
  text,
}: {
  className?: ClassValue;
  text: string;
}) {
  return (
    <div
      className={cn(
        "w-min flex gap-3 rounded-base border-2 text-text border-border dark:border-darkBorder  px-3 py-1.5 text-sm font-base",
        className
      )}
    >
      <img src={`assets/svg/${text}.svg`} alt={text} className="h-5 w-5" />
      <div>{text}</div>
    </div>
  );
}
