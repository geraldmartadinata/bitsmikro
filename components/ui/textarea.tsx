import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-[100px] w-full resize-y rounded-md border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-terracotta focus:outline-2 focus:outline-terracotta/25 ${className}`}
      {...props}
    />
  );
}