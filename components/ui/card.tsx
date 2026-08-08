import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`card-surface rounded-md ${className}`} {...props}>
      {children}
    </div>
  );
}