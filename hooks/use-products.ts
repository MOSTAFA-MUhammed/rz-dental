"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/types";

export function useProducts(initialProducts: Product[]) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProducts(initialProducts);
      setIsLoading(false);
    }, 280);

    return () => window.clearTimeout(timeoutId);
  }, [initialProducts]);

  return { isLoading, products };
}
