"use client";
import { useState } from "react";
import { useCart } from "@/app/context/cart-context";
import { Product } from "@/types";
import Toast from "@/components/toast";
import Button from "@/components/button";

const AddToCart = ({ item }: { item: Product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(event.target.value)); // Evita cantidades negativas o cero
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    Toast.success(`¡${item.name} se agregó al carrito con éxito!`);
  };

  return (
    <div className="mt-4 flex items-center">
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
        title="Cantidad de productos"
        className="w-16 h-full px-2 py-2 border border-gray-300 rounded-md text-center"
      />
      <Button
        ariaLabel={`Agregar ${item.name} al carrito`}
        onClick={handleAddToCart}
        className="px-4 py-2 ml-2"
      >
        Agregar al carrito
      </Button>
    </div>
  );
};

export default AddToCart;
