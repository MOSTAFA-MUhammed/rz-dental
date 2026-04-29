import { ProductsPage } from "@/components/products-page";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Products | RZ Dental",
  description: "Browse premium dental products and add them to your booking cart.",
};

export default async function Page() {
  const products = await getProducts();

  return <ProductsPage initialProducts={products} />;
}
