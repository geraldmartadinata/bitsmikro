import type { HTMLAttributes } from "react";

export type BadgeVariant = "neutral" | "sage" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "bg-ink/5 text-muted",
  sage: "bg-sage/10 text-sage",
  danger: "bg-danger/10 text-danger",
};

export function Badge({ variant = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  );
}