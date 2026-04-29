"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ToastProvider, useToast } from "@/components/toast-provider";
import type { CartContextValue, CartLine, Product } from "@/types";

const CART_STORAGE_KEY = "rz-dental-cart";

const CartContext = createContext<CartContextValue | null>(null);

function CartStateProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as CartLine[];
        setItems(parsed);
      }
    } catch (error) {
      console.error("Failed to read cart from local storage", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product) => {
      startTransition(() => {
        setItems((current) => {
          const existingItem = current.find((item) => item.id === product.id);

          if (existingItem) {
            return current.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...current, { ...product, quantity: 1 }];
        });
      });

      notify("Added to cart", "success");
    };

    const incrementItem = (id: string) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    };

    const decrementItem = (id: string) => {
      setItems((current) =>
        current
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    };

    const removeItem = (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
      notify("Item removed from cart", "info");
    };

    const clearCart = () => {
      setItems([]);
    };

    return {
      addItem,
      clearCart,
      decrementItem,
      incrementItem,
      isReady,
      items,
      removeItem,
      totalItems: items.reduce((count, item) => count + item.quantity, 0),
    };
  }, [isReady, items, notify]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartStateProvider>{children}</CartStateProvider>
    </ToastProvider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }

  return context;
}
