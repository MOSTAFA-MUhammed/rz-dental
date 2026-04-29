"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { useCart } from "@/hooks/use-cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#ecdcc1]/70 bg-[#fffaf2]/80 backdrop-blur-xl">
      <div className="section-shell flex min-h-20 items-center justify-between gap-4">
        
        <Link href="/" className="flex items-center gap-3">
          <Image src="/Logo-png-rz.png" alt="RZ Dental logo"  width={40} height={40} className="h-21 w-21" />
        </Link>

        <nav className="hidden md:flex items-center gap-2 rounded-full border border-[#ecdcc1]/80 bg-white/75 p-2 shadow-[0_10px_30px_rgba(63,42,12,0.08)]">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[linear-gradient(135deg,#c79b58_0%,#a07233_48%,#6a4a20_100%)] text-white"
                    : "text-[#66523a] hover:bg-[#f6ecdc] hover:text-[#20170d]"
                }`}
              >
                {link.label}
                {link.href === "/cart" && totalItems > 0
                  ? ` (${totalItems})`
                  : ""}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-xl border border-[#ecdcc1] bg-white p-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-4 pb-4 transition-all duration-300 ease-out ${
            open ? "translate-y-0 scale-100" : "-translate-y-2 scale-95"
          }`}
        >
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-[#ecdcc1]/80 bg-white p-3 shadow-[0_10px_30px_rgba(63,42,12,0.08)]">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#c79b58_0%,#a07233_48%,#6a4a20_100%)] text-white"
                      : "text-[#66523a] hover:bg-[#f6ecdc] hover:text-[#20170d]"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && totalItems > 0
                    ? ` (${totalItems})`
                    : ""}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
