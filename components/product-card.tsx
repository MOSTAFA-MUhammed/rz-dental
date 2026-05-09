"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Share2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/toast-provider";
import type { Product } from "@/types";

type ProductCardProps = {
  direction?: "left" | "right" | "up";
  product: Product;
};

export function ProductCard({
  direction = "up",
  product,
}: ProductCardProps) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const { notify } = useToast();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const cartItem = items.find((item) => item.id === product.id);

  const revealClass =
    direction === "left"
      ? "scroll-reveal scroll-reveal-left"
      : direction === "right"
        ? "scroll-reveal scroll-reveal-right"
        : "scroll-reveal";

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleCheckout = () => {
    addItem(product);
    router.push("/cart");
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/products?product=${encodeURIComponent(product.id)}`
        : `/products?product=${encodeURIComponent(product.id)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          text: `Check out ${product.name} from RZ Dental`,
          title: product.name,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      notify("Product link copied", "info");
    } catch {
      notify("Unable to share this product right now.", "error");
    }
  };

  return (
    <>
      <Reveal
        className={`${revealClass} group glass-panel flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/50 p-3 sm:rounded-[2rem] sm:p-5`}
      >
        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#7f5d2c] shadow-[0_10px_24px_rgba(63,42,12,0.12)] backdrop-blur-xl transition hover:bg-white"
            aria-label={`Share ${product.name}`}
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="block w-full text-left"
            aria-label={`View details for ${product.name}`}
          >
            <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-[1.2rem] bg-slate-100 sm:mb-5 sm:rounded-[1.5rem]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {product.categoryTags.slice(0, 2).map((tag) => (
              <span
                key={`${product.id}-${tag}`}
                className="rounded-full bg-[#f8ecd9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#946d35] sm:px-3 sm:text-xs sm:tracking-[0.16em]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="text-left"
            >
              <h3 className="text-base font-bold leading-5 text-slate-950 sm:text-2xl sm:leading-normal">
                {product.name}
              </h3>
            </button>
            <div className="text-right">
              {product.originalPrice ? (
                <p className="text-xs text-slate-400 line-through">EGP {product.originalPrice}</p>
              ) : null}
              <span className="text-xs font-semibold text-[#a07233] sm:text-sm">EGP {product.price}</span>
            </div>
          </div>
          <p className="flex-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-7">
            {product.description}
          </p>
          <div className="mt-auto space-y-3">
            <p
              className={`text-xs font-semibold sm:text-sm ${
                product.inStock ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDetailsOpen(true)}
                fullWidth
                className="min-h-10 px-3 text-xs sm:min-h-12 sm:px-5 sm:text-sm"
              >
                View Details
              </Button>
              <Button
                onClick={handleAddToCart}
                fullWidth
                disabled={!product.inStock}
                className="min-h-10 px-3 text-xs sm:min-h-12 sm:px-5 sm:text-sm"
              >
                {product.inStock ? (
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItem ? "Add More" : "Add to Cart"}
                  </span>
                ) : (
                  "Unavailable"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Modal
        eyebrow="Product Details"
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={product.name}
      >
        <div className="space-y-6">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.8rem] bg-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {product.categoryTags.map((tag) => (
              <span
                key={`modal-${product.id}-${tag}`}
                className="rounded-full bg-[#f8ecd9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#946d35]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-4 rounded-[1.6rem] border border-[#ead8ba] bg-[#fffaf2] p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7438]">Price</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-2xl font-bold text-slate-950">EGP {product.price}</p>
                {product.originalPrice ? (
                  <p className="text-sm text-slate-400 line-through">EGP {product.originalPrice}</p>
                ) : null}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7438]">Availability</p>
              <p
                className={`mt-2 text-base font-semibold ${
                  product.inStock ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7438]">Brand</p>
              <p className="mt-2 text-sm text-slate-700">{product.brand || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7438]">Warranty</p>
              <p className="mt-2 text-sm text-slate-700">{product.warranty || "Not specified"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a7438]">Description</p>
            <p className="mt-3 text-sm leading-8 text-slate-600">{product.description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleCheckout}
              fullWidth
              disabled={!product.inStock}
            >
              {product.inStock ? "Checkout" : "Unavailable"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAddToCart}
              fullWidth
              disabled={!product.inStock}
            >
              Add to Cart
            </Button>
            <Button variant="ghost" onClick={handleShare} fullWidth>
              Share
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
