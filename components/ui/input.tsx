import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-terracotta focus:outline-2 focus:outline-terracotta/25 ${className}`}
      {...props}
    />
  );
}