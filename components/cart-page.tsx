"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BookingForm, paymentMethods } from "@/components/booking-form";
import { Button } from "@/components/button";
import { CartItem } from "@/components/cart-item";
import { Modal } from "@/components/modal";
import { useCart } from "@/hooks/use-cart";

export function CartPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const { items, totalItems } = useCart();

  const totals = useMemo(
    () =>
      items.reduce(
        (summary, item) => ({
          subtotal: summary.subtotal + item.price * item.quantity,
          uniqueItems: summary.uniqueItems + 1,
        }),
        { subtotal: 0, uniqueItems: 0 },
      ),
    [items],
  );

  const selectedPaymentMethod =
    paymentMethods.find((method) => method.id === selectedPaymentId) ?? null;

  return (
    <main className="section-shell flex flex-1 flex-col py-12">
      <div className="mb-10 max-w-3xl">
        <span className="section-tag">Cart</span>
        <h1 className="section-title mt-4">Review your basket and submit your booking request.</h1>
        <p className="section-copy mt-4">
          Update quantities, remove products, and complete the booking form when your
          selection is ready.
        </p>
      </div>

      {successMessage ? (
        <section className="mb-8 space-y-5">
          <div className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/80 p-5 text-sm font-medium text-emerald-900">
            {successMessage}
          </div>

          <div className="overflow-hidden rounded-[2.2rem] border border-[#e5d4b8] bg-white/80 shadow-[0_24px_80px_rgba(63,42,12,0.08)]">
            <div className="relative aspect-[4/5] w-full bg-[#f8f4ec] sm:aspect-[16/9]">
              <Image
                src="/image.png"
                alt="RZ Dental booking success"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>
      ) : null}

      {items.length === 0 ? (
        <div className="glass-panel grid gap-6 rounded-[2.4rem] border border-white/60 p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Your cart is empty.</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Browse the product catalog, add the items you need, then come back here
              to send the booking request.
            </p>
          </div>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <aside className="glass-panel h-fit rounded-[2rem] border border-white/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9a7438]">
                Basket Summary
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Total quantity</span>
                  <span className="font-semibold text-slate-950">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Unique products</span>
                  <span className="font-semibold text-slate-950">{totals.uniqueItems}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm text-slate-600">Estimated total</span>
                  <span className="text-2xl font-bold text-slate-950">
                    EGP {totals.subtotal}
                  </span>
                </div>
              </div>

              <Button
                className="mt-8"
                fullWidth
                onClick={() => {
                  if (selectedPaymentMethod) {
                    setIsBookingOpen(true);
                  }
                }}
                disabled={!selectedPaymentMethod}
              >
                Book Now
              </Button>
              {!selectedPaymentMethod ? (
                <p className="mt-3 text-sm text-amber-700">
                  Choose a payment method first to continue with the booking.
                </p>
              ) : null}
            </aside>
          </div>

          <section className="glass-panel rounded-[2rem] border border-white/60 p-6 sm:p-7">
            <div className="mb-5">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9a7438]">
                Payment
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Choose your payment method</h2>
              <p className="mt-2 text-sm text-slate-600">
                Select the payment method here, then press Book Now to complete the popup form.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-[#dec7a1] bg-white/90">
              {paymentMethods.map((method, index) => {
                const isSelected = method.id === selectedPaymentId;

                return (
                  <label
                    key={method.id}
                    className={`block cursor-pointer ${index > 0 ? "border-t border-[#efe1ca]" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => setSelectedPaymentId(method.id)}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center gap-3 px-4 py-4 transition ${
                        isSelected
                          ? "bg-[#f8f1e3] ring-1 ring-inset ring-[#b98a46]"
                          : "bg-white hover:bg-[#fff9ef]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          isSelected ? "border-[#a07233] bg-[#a07233]" : "border-[#d8bf97] bg-white"
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#24190e]">
                          {method.label} ({method.feeLabel})
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="space-y-2 border-t border-[#e9d8ba] bg-[#fffdf8] px-5 py-4 text-sm leading-7 text-[#5f503e]">
                        <p>{method.description}</p>
                        {method.details.map((detail) => (
                          <p key={detail}>{detail}</p>
                        ))}
                      </div>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <Modal
        eyebrow="Booking"
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Complete your booking details"
      >
        {selectedPaymentMethod ? (
          <BookingForm
            paymentMethod={selectedPaymentMethod}
            onComplete={() => {
              setSuccessMessage("Successfully submitted. We will contact you soon.");
              setIsBookingOpen(false);
            }}
          />
        ) : null}
      </Modal>
    </main>
  );
}
