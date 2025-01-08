import { CartItem } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Estado para controlar si el componente se ha montado en el cliente
  const [isClient, setIsClient] = useState(false);

  // Lee el carrito desde localStorage si existe
  const loadCartFromLocalStorage = () => {
    if (typeof window !== "undefined" && localStorage) {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  };

  const [cart, setCart] = useState<CartItem[]>([]);

  // Asegura que el código que depende de window solo se ejecute en el cliente
  useEffect(() => {
    setIsClient(true); // Marca que el componente se ha montado en el cliente
  }, []);

  // Una vez que el componente se monta en el cliente, carga el carrito desde localStorage
  useEffect(() => {
    if (isClient) {
      const initialCart = loadCartFromLocalStorage();
      setCart(initialCart);
    }
  }, [isClient]);

  // Efecto para actualizar localStorage cuando cambie el carrito
  useEffect(() => {
    if (isClient) {
      if (cart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        localStorage.removeItem("cart");
      }
    }
  }, [cart, isClient]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex !== -1) {
        // Si ya existe el producto, actualizo su cantidad
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...prevCart[existingItemIndex],
          quantity: prevCart[existingItemIndex].quantity + item.quantity,
        };
        return updatedCart;
      } else {
        // Si no existe, lo agrego al carrito
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
