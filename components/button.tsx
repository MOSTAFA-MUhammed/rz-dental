"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#c79b58_0%,#a07233_48%,#6a4a20_100%)] text-white shadow-[0_18px_40px_rgba(122,91,44,0.28)] hover:brightness-[1.05]",
  secondary:
    "bg-white/90 text-[#24190e] ring-1 ring-[#d9c2a0] hover:bg-[#fffaf2]",
  ghost:
    "bg-transparent text-[#6b5637] ring-1 ring-[#d9c2a0] hover:bg-white/70",
  danger:
    "bg-rose-600 text-white shadow-[0_18px_40px_rgba(225,29,72,0.24)] hover:bg-rose-700",
};

export function Button({
  children,
  className = "",
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
