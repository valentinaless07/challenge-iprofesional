"use client";
import Button from "@/components/button";
import { useCart } from "../context/cart-context";
import CartItemComponent from "./components/cart-item";
import Link from "next/link";

const Cart = () => {
  const { cart } = useCart();

  return (
    <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
      {cart.length > 0 ? (
        <>
          <div className="pb-6">
            {cart.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
          <Link href="/checkout">
            <Button
              ariaLabel="Continuar al checkout"
              onClick={() => console.log("Continuar al checkout")}
              className="w-full py-3"
            >
              Continuar compra
            </Button>
          </Link>
        </>
      ) : (
        <div className="mt-4 text-center text-lg font-semibold text-gray-700">
          Tu carrito está vacío.
        </div>
      )}
    </div>
  );
};

export default Cart;
