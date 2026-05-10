"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useToast } from "@/components/toast-provider";
import { useCart } from "@/hooks/use-cart";
import { submitBooking } from "@/services/booking-client";
import type { BookingFormValues, CartLine, PaymentMethod, ShippingMethod } from "@/types";

type BookingFormProps = {
  paymentMethod: PaymentMethod;
  onComplete: (
    message: string,
    orderSummary: {
      itemCount: number;
      items: CartLine[];
      paymentMethod: PaymentMethod;
      total: number;
    },
  ) => void;
};

type FieldErrors = Partial<Record<keyof BookingFormValues, string>>;

const initialValues: BookingFormValues = {
  address: "",
  name: "",
  notes: "",
  phone: "",
};

export const shippingMethod: ShippingMethod = {
  eta: "Arrives within 2-4 days",
  fee: 0,
  id: "bosta-delivery",
  label: "Bosta Delivery",
};

export const paymentMethods: PaymentMethod[] = [
  {
    description: "Pay securely using InstaPay with 0% extra fees.",
    details: [
      "01068640141",
      "Transfer the full order amount using InstaPay to the number above.",
      "Send a screenshot of the successful transfer via WhatsApp to the same number.",
    ],
    feeLabel: "0% Fees",
    id: "instapay",
    label: "InstaPay - Bank Transfer",
  },
  {
    description: "Pay with Vodafone Cash at no additional fees.",
    details: [
      "01068640141",
      "Transfer the full order amount to the Vodafone Cash wallet number above.",
      "Send the payment screenshot on WhatsApp after transfer confirmation.",
    ],
    feeLabel: "0% Fees",
    id: "vodafone-cash",
    label: "Vodafone Cash - Mobile Wallet",
  },
  {
    description: "Cash on delivery is (COD) ",
    details: [
      "",
    ],
    feeLabel: "",
    id: "cash-on-delivery",
    label: "Cash on Delivery (COD)",
  },
];

function validate(values: BookingFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 3) {
    errors.name = "Please enter a valid name.";
  }

  if (!/^[0-9+\s()-]{8,20}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (values.address.trim().length < 8) {
    errors.address = "Please enter a complete address.";
  }

  return errors;
}

export function BookingForm({ onComplete, paymentMethod }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { clearCart, items } = useCart();
  const { notify } = useToast();

  const totals = useMemo(
    () =>
      items.reduce(
        (summary, item) => ({
          itemCount: summary.itemCount + item.quantity,
          total: summary.total + item.quantity * item.price,
        }),
        { itemCount: 0, total: 0 },
      ),
    [items],
  );

  const orderTotal = totals.total + shippingMethod.fee;

  const handleChange = (field: keyof BookingFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      notify("Please complete the required booking details.", "error");
      return;
    }

    if (items.length === 0) {
      notify("Your cart is empty.", "error");
      return;
    }
    
    if (orderTotal < 300) {
      notify("Minimum order is 300 EGP to place a booking.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitBooking({
        customer: values,
        items,
        paymentMethod,
        shippingMethod,
      });

      if (!result.ok) {
        setErrors({
          address: result.fieldErrors.address,
          name: result.fieldErrors.name,
          phone: result.fieldErrors.phone,
        });
        notify(result.message, "error");
        return;
      }

      const completedOrderSummary = {
        itemCount: totals.itemCount,
        items: items.map((item) => ({ ...item })),
        paymentMethod,
        total: orderTotal,
      };

      clearCart();
      setValues(initialValues);
      notify(result.message, "success");
      onComplete(result.message, completedOrderSummary);
    } catch {
      notify("Something went wrong while sending your booking.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          placeholder="Dr. Ahmed Hassan"
          value={values.name}
          onChange={(event) => handleChange("name", event.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Phone"
          name="phone"
          placeholder="01021535882"
          value={values.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          error={errors.phone}
          required
        />
      </div>

      <Input
        label="Address"
        name="address"
        placeholder="Clinic address, area, and floor details"
        value={values.address}
        onChange={(event) => handleChange("address", event.target.value)}
        error={errors.address}
        required
      />

      <Input
        label="Notes"
        name="notes"
        placeholder="Optional delivery notes or preferred contact time"
        value={values.notes}
        onChange={(event) => handleChange("notes", event.target.value)}
        multiline
      />

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-[#24190e]">Shipping method</h3>
        </div>
        {/* <div className="rounded-[1.6rem] border border-[#caa46a] bg-white/90 p-5 shadow-[0_14px_40px_rgba(122,91,44,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-[#24190e]">{shippingMethod.label}</p>
              <p className="mt-1 text-base text-[#6a5a46]">{shippingMethod.eta}</p>
            </div>
            <p className="text-xl font-bold text-[#8f6932]">EGP {shippingMethod.fee}</p>
          </div>
        </div> */}
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.6rem] border border-[#dec7a1] bg-white/90 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a7438]">
            Payment Method
          </p>
          <p className="mt-3 text-base font-semibold text-[#24190e]">
            {paymentMethod.label} ({paymentMethod.feeLabel})
          </p>
          <p className="mt-2 text-sm leading-7 text-[#5f503e]">{paymentMethod.description}</p>
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-[#ead5b1] bg-[#faf2e2]/85 p-4 text-sm text-[#655541]">
        <p className="font-semibold text-[#24190e]">
          {totals.itemCount} items ready for buying
        </p>
        <p className="mt-1">Products total: EGP {totals.total}</p>
        {/* <p className="mt-1">Shipping fee: EGP {shippingMethod.fee}</p> */}
        <p className="mt-2 text-base font-semibold text-[#24190e]">
          Final total: EGP {orderTotal}
        </p>
      </div>

      <Button type="submit"  fullWidth   disabled={isSubmitting || orderTotal < 300}>
         {orderTotal < 300
          ? "Minimum order is 300 EGP"
          : isSubmitting
          ? "Submitting buying..."
          : "Submit Buying"}
      </Button>
    </form>
  );
}
