export type Product = {
  category: string;
  categoryTags: string[];
  description: string;
  brand?: string;
  id: string;
  image: string;
  inStock: boolean;
  name: string;
  originalPrice?: number;
  price: number;
  warranty?: string;
};

export type CartLine = Product & {
  quantity: number;
};

export type BookingFormValues = {
  address: string;
  name: string;
  notes: string;
  phone: string;
};

export type ShippingMethod = {
  eta: string;
  fee: number;
  id: string;
  label: string;
};

export type PaymentMethod = {
  description: string;
  details: string[];
  feeLabel: string;
  id: string;
  label: string;
};

export type BookingPayload = {
  customer: BookingFormValues;
  items: CartLine[];
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
};

export type BookingRecord = BookingPayload & {
  createdAt: string;
  id: string;
};

export type BookingValidationErrors = Partial<
  Record<keyof BookingFormValues | "items", string>
>;

export type BookingResult =
  | {
      fieldErrors: BookingValidationErrors;
      message: string;
      ok: false;
    }
  | {
      bookingId: string;
      message: string;
      notifications: {
        emailSent: boolean;
        whatsappSent: boolean;
      };
      ok: true;
    };

export type BookingResponse = BookingResult;

export type CartContextValue = {
  addItem: (product: Product) => void;
  clearCart: () => void;
  decrementItem: (id: string) => void;
  incrementItem: (id: string) => void;
  isReady: boolean;
  items: CartLine[];
  removeItem: (id: string) => void;
  totalItems: number;
};
