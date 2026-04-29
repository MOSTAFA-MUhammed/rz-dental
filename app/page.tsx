import { HomePage } from "@/components/home-page";
import { getProducts } from "@/lib/products";

export default async function Page() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);

  return <HomePage allProducts={products} featuredProducts={featuredProducts} />;
}
