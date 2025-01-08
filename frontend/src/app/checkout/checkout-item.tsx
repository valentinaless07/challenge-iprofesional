import React from "react";
import { formatPrice } from "../utils/format-price";
import { CartItem } from "@/types";
import Image from "next/image";

const CheckoutItem = ({
  item,
  discount,
}: {
  item: CartItem;
  discount: {
    id?: number | null;
    percentage?: number;
    name?: string | null;
    category_id?: number;
  };
}) => {
  // Si el producto tiene descuento propio
  const hasItemDiscount = item.discount > 0;

  // Si no tiene descuento propio, pero el descuento es aplicable por categoría
  const isCategoryDiscountApplicable = discount.category_id
    ? item.categories.some((category) => category.id === discount.category_id)
    : false;

  // Determina el descuento más alto entre el descuento del producto y el descuento por categoría (si aplica)
  const discountToApply = Math.max(
    hasItemDiscount ? item.discount : 0,
    isCategoryDiscountApplicable ? (discount.percentage ?? 0) : 0
  );

  // Calculamos el precio con descuento por unidad
  const unitPriceAfterDiscount =
    discountToApply > 0 ? item.price - item.price * (discountToApply / 100) : item.price;

  const totalPrice = item.price * item.quantity;
  const discountedPrice =
    discountToApply > 0 ? totalPrice - totalPrice * (discountToApply / 100) : totalPrice;

  return (
    <div className="flex items-center space-x-6 border-b border-gray-300 py-5">
      <Image
        alt={item.name}
        src={item.image || "/default-image.jpg"}
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {item.quantity} x {formatPrice(unitPriceAfterDiscount)} {/* Precio por unidad después del descuento */}
        </p>
      </div>
      <div className="text-right">
        {(hasItemDiscount || isCategoryDiscountApplicable) && (
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-green-500 font-medium">{`${discountToApply}%`}</span>
            <p className="text-sm text-gray-500 line-through">{formatPrice(totalPrice)}</p>
          </div>
        )}
        <p className="text-lg font-normal text-primary-600">{formatPrice(discountedPrice)}</p>
      </div>
    </div>
  );
};

export default CheckoutItem;
