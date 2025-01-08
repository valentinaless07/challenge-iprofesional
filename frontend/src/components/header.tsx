"use client";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import Cart from "./icons/cart-icon";

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav
        aria-label="Global navigation"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="font-bold text-lg lg:text-xl text-blue-950 hover:text-blue-900 transition-colors"
            aria-label="Ir a la página de inicio"
          >
            Inicio
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="text-blue-950 hover:text-blue-900 transition-colors relative"
            aria-label="Ver carrito"
          >
            <Cart />
            <span className="absolute top-0 right-0 inline-block h-4 w-4 rounded-full bg-red-600 text-white text-[0.65rem] font-semibold text-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
