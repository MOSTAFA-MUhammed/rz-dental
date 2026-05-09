"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/use-cart";

export function FloatingCartButton() {
  const { totalItems } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label={`Open cart with ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#ead8ba] bg-[linear-gradient(135deg,#c79b58_0%,#a07233_52%,#6a4a20_100%)] text-white shadow-[0_18px_45px_rgba(79,52,18,0.28)] transition hover:scale-105 hover:brightness-105 sm:right-6"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 px-1 text-xs font-bold leading-none text-white">
        {totalItems}
      </span>
    </Link>
  );
}
