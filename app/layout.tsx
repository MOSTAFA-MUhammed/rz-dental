import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";

export const metadata: Metadata = {
  title: "RZ Dental",
  description:
    "Modern dental product booking with a smooth cart flow, responsive design, and instant booking notifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--color-canvas)] text-slate-900 antialiased">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
