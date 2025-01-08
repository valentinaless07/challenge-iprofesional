import { getProducts } from "@/lib/actions/product.actions";
import ProductsList from "./components/products-list";

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-2xl px-6 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <ProductsList products={products} />
    </div>
  );
}
