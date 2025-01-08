"use client";
import { useCart } from "@/app/context/cart-context";
import RemoveIcon from "@/components/icons/remove-icon";

const RemoveCartItem = ({ itemId }: { itemId: number }) => {
  const { removeFromCart } = useCart();

  return (
    <button onClick={() => removeFromCart(itemId)} className="ml-4 text-red-600 hover:text-red-500" title="Quitar producto">
      <RemoveIcon />
    </button>
  );
};

export default RemoveCartItem;
