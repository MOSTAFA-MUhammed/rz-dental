"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/button";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types";

type ProductsPageProps = {
  initialProducts: Product[];
};

const PRODUCTS_PER_PAGE = 10;

export function ProductsPage({ initialProducts }: ProductsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [targetProductId, setTargetProductId] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("product") ?? ""
      : "",
  );
  const deferredQuery = useDeferredValue(query);
  const { isLoading, products } = useProducts(initialProducts);
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();

    return products
      .flatMap((product) => product.categoryTags)
      .filter((tag) => {
        const normalized = tag.toLowerCase();

        if (seen.has(normalized)) {
          return false;
        }

        seen.add(normalized);
        return true;
      })
      .sort((left, right) => left.localeCompare(right));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.description, product.category, ...(product.brand ? [product.brand] : [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "all" ||
        product.categoryTags.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase(),
        );

      return matchesQuery && matchesCategory;
    });
  }, [deferredQuery, products, selectedCategory]);

  const targetProductPage = useMemo(() => {
    if (!targetProductId || products.length === 0) {
      return null;
    }

    const productIndex = products.findIndex((product) => product.id === targetProductId);

    if (productIndex === -1) {
      return null;
    }

    return Math.floor(productIndex / PRODUCTS_PER_PAGE) + 1;
  }, [products, targetProductId]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const resolvedPage = targetProductPage ?? currentPage;
  const safePage = Math.min(resolvedPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safePage]);

  useEffect(() => {
    if (!isCategoryMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCategoryMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCategoryMenuOpen]);

  useEffect(() => {
    if (!targetProductId || isLoading) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-product-id="${targetProductId}"]`,
      );

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [safePage, isLoading, targetProductId]);

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? "All Categories"
      : categoryOptions.find((category) => category === selectedCategory) ?? selectedCategory;

  return (
    <main className="section-shell flex flex-1 flex-col py-12">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="section-tag">Products</span>
          <h1 className="section-title mt-4">
            Discover modern dental supplies built for fast clinic ordering.
          </h1>
          <p className="section-copy mt-4">
            Add products directly to your cart, then finalize the booking with your
            contact and address details.
          </p>
        </div>

        <label className="w-full max-w-md">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setTargetProductId("");
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product, category, or use case"
            className="w-full rounded-full border border-[#ead8ba]/80 bg-white/85 px-5 py-4 text-sm outline-none ring-0 backdrop-blur-xl transition focus:border-[#b98a46] focus:bg-white"
          />
        </label>
      </div>

      {!isLoading && categoryOptions.length > 0 ? (
        <div className="mb-8 space-y-4">
          <div className="block sm:hidden" ref={categoryMenuRef}>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7438]">
              Category
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-[1.5rem] border border-[#ead8ba]/80 bg-white/90 px-4 py-4 text-left shadow-[0_16px_50px_rgba(110,78,28,0.08)] backdrop-blur-xl transition hover:border-[#d3b37c]"
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="menu"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b28a4f]">
                    Filter
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {selectedCategoryLabel}
                  </p>
                </div>
                <span
                  className={`text-lg text-[#8f6b37] transition ${isCategoryMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {isCategoryMenuOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-[1.6rem] border border-[#ead8ba] bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] p-2 shadow-[0_24px_70px_rgba(78,52,16,0.18)]">
                  <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
                    {["all", ...categoryOptions].map((category) => {
                      const isAll = category === "all";
                      const isSelected = selectedCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setTargetProductId("");
                            setSelectedCategory(category);
                            setCurrentPage(1);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-[1.1rem] px-4 py-3 text-left text-sm font-medium transition ${
                            isSelected
                              ? "bg-[linear-gradient(135deg,#c79b58_0%,#a07233_48%,#6a4a20_100%)] text-white shadow-[0_12px_30px_rgba(122,91,44,0.22)]"
                              : "text-slate-700 hover:bg-white hover:text-slate-950"
                          }`}
                          role="menuitem"
                        >
                          <span>{isAll ? "All Categories" : category}</span>
                          <span
                            className={`text-xs ${isSelected ? "opacity-100" : "opacity-0"}`}
                            aria-hidden="true"
                          >
                            ●
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="hidden flex-wrap gap-3 sm:flex">
            <Button
              variant={selectedCategory === "all" ? "primary" : "secondary"}
              onClick={() => {
                setTargetProductId("");
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
            >
              All Categories
            </Button>
            {categoryOptions.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "secondary"}
                onClick={() => {
                  setTargetProductId("");
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
            <div
              key={index}
              className="h-[380px] animate-pulse rounded-[2rem] border border-white/60 bg-white/75"
            />
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="mb-6 flex flex-col gap-4 rounded-[1.8rem] border border-white/60 bg-white/65 px-5 py-4 text-sm text-slate-600 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing <span className="font-semibold text-slate-950">{paginatedProducts.length}</span> of{" "}
                <span className="font-semibold text-slate-950">{filteredProducts.length}</span> products
              </p>
              <p>
                {selectedCategory === "all" ? "All categories" : selectedCategory}
              </p>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product, index) => (
              <div
                key={product.id}
                id={`product-${product.id}`}
                data-product-id={product.id}
              >
                <ProductCard
                  product={product}
                  direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length > PRODUCTS_PER_PAGE ? (
            <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-white/60 justify-center text-center bg-white/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTargetProductId("");
                    setCurrentPage(Math.max(1, safePage - 1));
                  }}
                  disabled={safePage === 1}
                >
                  Previous
                </Button>
                <span className="min-w-20 text-center text-sm font-semibold text-slate-950">
                  {safePage} / {totalPages}
                </span>
                <Button
                  onClick={() => {
                    setTargetProductId("");
                    setCurrentPage(Math.min(totalPages, safePage + 1));
                  }}
                  disabled={safePage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {!isLoading && filteredProducts.length === 0 ? (
        <div className="glass-panel mt-8 rounded-[2rem] border border-white/60 p-8 text-center">
          <p className="text-xl font-semibold text-slate-950">No products matched your search.</p>
          <p className="mt-2 text-sm text-slate-600">
            Try another search term or category filter, and make sure your Google Sheet contains valid product rows.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="secondary">Back Home</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
