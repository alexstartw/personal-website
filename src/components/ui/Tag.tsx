import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent";
  size?: "sm" | "md";
}

export function Tag({
  children,
  className,
  variant = "default",
  size = "md",
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full font-medium transition-colors",
        size === "md" && "px-3 py-1 text-xs",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        variant === "default" && "bg-[var(--border)] text-[var(--muted)]",
        variant === "accent" && "bg-blue-500/10 text-[var(--accent)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
