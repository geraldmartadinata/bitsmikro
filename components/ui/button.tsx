"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "ghost" | "outline";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-white shadow-sm hover:bg-terracotta-hover active:bg-terracotta-hover",
  ghost: "bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10",
  outline:
    "border border-hairline bg-transparent text-ink hover:border-terracotta hover:text-terracotta active:bg-terracotta/5",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}