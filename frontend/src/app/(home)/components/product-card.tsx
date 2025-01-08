import Image from "next/image";
import { Product } from "@/types";
import AddToCart from "./add-to-cart";
import { formatPrice } from "@/app/utils/format-price";
import React from "react";

const ProductCard = ({ item }: { item: Product }) => {
  return (
    <div className="w-72 h-full group relative rounded-lg border border-gray-200 shadow-lg hover:shadow-lg transition-shadow duration-200 bg-white">
      <Image
        priority
        alt={`Imagen de ${item.name}`}
        src={item.image ? item.image : "/default-image.jpg"}
        width={300}
        height={300}
        className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-75 transition-opacity duration-300"
      />
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis line-clamp-2">
            {item.name}
          </h3>

          <div className="flex flex-col items-start space-y-1">
            {item.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(item.price)}
              </p>
            )}
            <div className="flex items-center">
              <p className="text-xl font-semibold text-gray-900">
                {formatPrice(item.total_price)}
              </p>
              {item.discount > 0 && (
                <span className="text-sm text-green-500 font-semibold ml-2">
                  {`${item.discount}% OFF`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          {item.categories.slice(0, 4).map((category) => (
            <span
              key={category.id}
              title={`Categoria: ${category.name}`}
              className="cursor-default inline-block text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-1 mr-2 mb-2"
            >
              {category.name}
            </span>
          ))}
        </div>

        <AddToCart item={item} />
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
