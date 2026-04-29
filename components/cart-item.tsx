"use client";

import Image from "next/image";

import { Button } from "@/components/button";
import { useCart } from "@/hooks/use-cart";
import type { CartLine } from "@/types";

type CartItemProps = {
  item: CartLine;
};

export function CartItem({ item }: CartItemProps) {
  const { decrementItem, incrementItem, removeItem } = useCart();

  return (
    <article className="glass-panel flex flex-col gap-5 rounded-[2rem] border border-white/50 p-5 sm:flex-row sm:items-center">
      <div className="relative h-28 w-full overflow-hidden rounded-[1.4rem] bg-slate-100 sm:w-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{item.name}</h3>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            EGP {item.price * item.quantity}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => decrementItem(item.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg transition hover:bg-slate-50"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </button>
            <span className="min-w-8 text-center text-base font-semibold text-slate-950">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => incrementItem(item.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg transition hover:bg-slate-50"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <Button variant="ghost" onClick={() => removeItem(item.id)}>
            Remove item
          </Button>
        </div>
      </div>
    </article>
  );
}
