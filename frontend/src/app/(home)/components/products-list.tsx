import { Product } from "@/types";
import ProductCard from "./product-card";

const ProductsList = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 place-items-center">
      {products.map((product) => (
        <ProductCard key={product.id} item={product} />
      ))}
    </div>
  );
};

export default ProductsList;
