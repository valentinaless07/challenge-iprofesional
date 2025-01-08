"use client";
import { formatPrice } from "@/app/utils/format-price";
import { CartItem } from "@/types";
import Image from "next/image";
import RemoveCartItem from "./remove-cart-item";
import { useCart } from "@/app/context/cart-context";

const CartItemComponent = ({ item }: { item: CartItem }) => {
  const { updateItemQuantity } = useCart();

  const handleQuantityChange = (change: number) =>
    updateItemQuantity(item.id, item.quantity + change);

  const hasDiscount = item.discount > 0;

  const totalPrice = item.price * item.quantity;
  const totalDiscountedPrice = item.total_price * item.quantity;

  return (
    <div className="group relative rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white mb-4">
      <div className="flex items-center py-4 px-6">
        <Image
          alt={item.name}
          src={item.image || "/default-image.jpg"}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}

          <div className="mt-2">
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(totalPrice)}
              </p>
            )}
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(totalDiscountedPrice)}
            </p>
            {hasDiscount && (
              <span className="ml-2 text-sm text-green-500 font-semibold">
                {`${item.discount}% OFF`}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center">
            <label className="text-sm text-gray-600">Cantidad: </label>
            <div className="flex items-center ml-2 space-x-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                aria-label="Disminuir cantidad"
                disabled={item.quantity === 1}
                className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-lg">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                aria-label="Aumentar cantidad"
                className="px-2 py-1 bg-gray-200 rounded-md"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <RemoveCartItem itemId={item.id} />
      </div>
    </div>
  );
};

export default CartItemComponent;
