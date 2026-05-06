"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import type { Product } from "@/types";

type HomePageProps = {
  allProducts: Product[];
  featuredProducts: Product[];
};

const branchMapLink = "https://maps.app.goo.gl/U93Q3zPHoL9YqJr38?g_st=ic";
const branchMapEmbedAddress =
  "المنصورة - حي الجامعة، شارع خالد بن الوليد، ناصية الشارع من حي الجامعة Papa Johns ومحسن كافيه، وناصية الشارع من أحمد ماهر محل 99.99";

const stats = [
  { label: "Premium items", value: "49+" },
  { label: "Fast ordering flow", value: "1 min" },
  { label: "Instant admin notice", value: "24/7" },
];

const highlights = [
  "Exclusive agent and distributor for multiple premium dental products.",
  "Trusted by over 10,000 dentists across Egypt and the Arab world.",
  "Committed to delivering innovation, quality, and reliability in every product.",
];

const founderStoryPoints = [
  "•	RZ High-Speed Contra",
  "•	Low-Speed Handpieces",
  "•	Light Cure (1-Second Technology)",
  "• Focused on long-term relationships, not one-time transactions.",
];

export function HomePage({ allProducts, featuredProducts }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const suggestedProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return allProducts
      .filter((product) =>
        [product.name, product.category, product.description, ...(product.brand ? [product.brand] : [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 6);
  }, [allProducts, searchQuery]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="section-shell grid flex-1 gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <Reveal className="scroll-reveal space-y-7">
          <span className="section-tag">Dental Product WEBSITE</span>
          <div className="space-y-5">
            <h1 className="section-title max-w-2xl !text-5xl sm:!text-6xl">
              Order dental supplies with a cleaner cart flow and zero payment friction.
            </h1>
            <p className="section-copy max-w-2xl">
              Browse premium dental products, build your basket, and submit a complete
              order request in one smooth responsive experience.
            </p>
          </div>

          <div className="relative max-w-2xl">
            <label className="sr-only" htmlFor="hero-product-search">
              Search products
            </label>
            <input
              id="hero-product-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products and jump directly to the item"
              className="w-full rounded-[1.8rem] border border-[#ead8ba]/80 bg-white/90 px-5 py-4 text-base text-slate-900 outline-none shadow-[0_18px_55px_rgba(103,72,26,0.08)] backdrop-blur-xl transition focus:border-[#b98a46] focus:bg-white"
            />

            {searchQuery.trim() ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.8rem)] z-20 overflow-hidden rounded-[1.8rem] border border-[#ead8ba] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7eb_100%)] p-2 shadow-[0_24px_70px_rgba(78,52,16,0.16)]">
                {suggestedProducts.length > 0 ? (
                  <div className="space-y-1">
                    {suggestedProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products?product=${encodeURIComponent(product.id)}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center justify-between gap-4 rounded-[1.2rem] px-4 py-3 transition hover:bg-white/90"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9a7438]">
                            {product.categoryTags.slice(0, 2).join(" • ") || product.category}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#8f6932]">
                          EGP {product.price}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.2rem] px-4 py-5 text-sm text-slate-600">
                    No matching products found.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/products">
              <Button className="min-w-44">Browse Products</Button>
            </Link>
            <Link href="/cart">
              <Button variant="secondary" className="min-w-44">
                Open Cart
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-[1.8rem] border border-white/60 p-5"
              >
                <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="hero-float relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#f3d8ab]/45 via-[#fff7ea]/20 to-[#b78947]/18 blur-3xl" />
          <div className="hero-zoom glass-panel relative overflow-hidden rounded-[2.6rem] border border-white/60 p-5">
            <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-[#d8af6f]/30 blur-2xl" />
            <div className="absolute -left-8 bottom-8 h-32 w-32 rounded-full bg-[#8b6836]/18 blur-2xl" />
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] bg-slate-100">
              <Image
                src="/rzdental.jpeg"
                alt="Dental products hero illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 10vw"
                // className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-white/60 bg-white/60 py-5 backdrop-blur-xl">
        <div className="marquee-track flex min-w-max gap-4 px-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
          {Array.from({ length: 2 }).flatMap((_, cycleIndex) =>
            highlights.map((item, itemIndex) => (
              <span
                key={`${cycleIndex}-${itemIndex}`}
                className="rounded-full bg-[#f7eddc] px-5 py-3 text-[#7b5a2b]"
              >
                {item}
              </span>
            )),
          )}
        </div>
      </section>

      <section className="section-shell grid gap-10 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal className="scroll-reveal scroll-reveal-left space-y-5">
          <span className="section-tag">Why It Works</span>
          <h2 className="section-title">Built for fast product selection and cleaner request handoff.</h2>
          <p className="section-copy">
            The flow removes payment complexity and focuses on speed: select products,
            adjust quantities, submit details, and let the admin receive the request
            instantly by email and optional WhatsApp.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "Browse",
              copy: "Curated cards with product visuals, descriptions, and quick add actions.",
            },
            {
              title: "Review",
              copy: "Edit basket quantities, remove items, and confirm the exact requested mix.",
            },
            {
              title: "Buy",
              copy: "Submit clinic details once and send the full request to the admin instantly.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="glass-panel rounded-[2rem] border border-white/50 p-6"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9a7438]">
                Step {index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-4">
        <Reveal className="scroll-reveal mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-tag">Featured Products</span>
            <h2 className="section-title mt-4">High-demand essentials ready for buy.</h2>
          </div>
          <Link href="/products">
            <Button variant="secondary">View All Products</Button>
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <Reveal className="scroll-reveal md:block">
            <div className="relative overflow-hidden rounded-[2.7rem] border border-white/60 bg-[linear-gradient(135deg,#fff8ee_0%,#f8f2e7_42%,#f3e3c8_100%)] p-6 shadow-[0_30px_90px_rgba(63,42,12,0.08)] sm:p-8">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#ddc08a]/45 blur-3xl" />
              <div className="absolute bottom-8 right-0 h-40 w-40 rounded-full bg-[#8d6939]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <div className="absolute inset-x-10 bottom-0 h-32 rounded-full bg-[#b88a47]/20 blur-3xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-[#f5efe4]">
                  <Image
                    src="/founder.jpeg"
                    alt="Dr. Rami Zaazoua founder portrait"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="scroll-reveal scroll-reveal-right">
            <div className="mx-auto max-w-xl space-y-6 lg:ml-auto">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.34em] text-[#8d6a36]">
                  About The Brand
                </p>
                <h2 className="section-title mt-4">Dr. Rami Zaazoua Founder &apos; CEO, RZ Dental Co. </h2>
                <p className="mt-4 text-2xl leading-tight text-[#2e2113]">
                  From a humble beginning to continuous growth, the journey of RZ Dental Co. has been built on passion, persistence, and a clear vision.
                </p>
              </div>

              <div className="space-y-4 text-base leading-8 text-[#635441]">
                <p>
                  What started as working with local dental products has evolved into importing and developing our own exclusive, high-quality dental equipment. Step by step, we moved forward—growing, improving, and building a brand that dentists can trust.
                </p>
                <p>
                  Behind this journey lies a tremendous amount of hard work, dedication, and belief in delivering real value to the dental field.
                </p>
              </div>

              <div className="grid gap-3">
                {founderStoryPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.4rem] border border-[#e3cfb0]/80 bg-white/80 px-4 py-3 text-sm font-medium text-[#6b583f] backdrop-blur-xl"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8e7046]">
                Built to support clinics with less friction and more confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell py-20">
        <Reveal className="scroll-reveal overflow-hidden rounded-[2.5rem] border border-white/60 bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.16)]">
          <div className="relative min-h-[620px]">
            <iframe
              title="RZ Dental branch location"
              src={`https://www.google.com/maps?output=embed&q=${encodeURIComponent(branchMapEmbedAddress)}`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,14,7,0.76)_0%,rgba(21,14,7,0.42)_24%,rgba(21,14,7,0.08)_54%,rgba(21,14,7,0.22)_100%)]" />

            <div className="relative z-10 flex min-h-[620px] items-start p-6 sm:p-10 lg:items-center lg:p-14">
              <div className="glass-panel w-full max-w-md rounded-[2rem] border border-white/70 bg-white/88 p-8 sm:p-10">
                <p className="font-mono text-sm uppercase tracking-[0.38em] text-[#8d6a36]">
                  RZ Dental
                </p>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
                  Mansoura Branch
                </h2>
                <p className="mt-6 text-lg leading-9 text-slate-700">
                  {branchMapEmbedAddress}
                </p>
                <p className="mt-3 text-base font-medium text-slate-600">
                  Saturday - Thursday, 8 am - 6 pm
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={branchMapLink} target="_blank" rel="noreferrer">
                    <Button className="min-w-52">Open in Google Maps</Button>
                  </a>
                  <Link href="/products">
                    <Button variant="secondary" className="min-w-44">
                      Browse Products
                    </Button>
                  </Link>
                </div>

                <p className="mt-7 text-sm font-medium text-slate-500">
                  Pin the branch on your route before completing your purchase.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
