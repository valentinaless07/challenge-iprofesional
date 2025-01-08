"use client";
import Button from "@/components/button";
import { useCart } from "../context/cart-context";
import { formatPrice } from "../utils/format-price";
import CheckoutItem from "./checkout-item";
import { useState } from "react";
import { postOrder } from "@/lib/actions/order.actions";
import Loader from "@/components/loader";
import axios from "axios";

interface OrderAmounts {
  total: number;
  subtotal: number;
  discount: {
    id: number | null;
    percentage: number;
    category_id: number;
  };
  totalDiscounted: number;
  discountCodeName: string | null;
}

const Checkout = () => {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [orderAmounts, setOrderAmounts] = useState<OrderAmounts | undefined>(
    undefined
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      const products = cart.map(({ id, quantity }) => ({ id, quantity }));
      const data: OrderAmounts = await postOrder({ products, discountCode });
      setOrderAmounts({
        total: data.total,
        subtotal: data.subtotal,
        discount: data.discount,
        totalDiscounted: data.totalDiscounted,
        discountCodeName: data.discountCodeName,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
      {cart.length > 0 ? (
        <>
          <div className="pb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Resumen de tu Pedido
            </h2>
            {cart.map((item) => (
              <CheckoutItem
                key={item.id}
                item={item}
                discount={{
                  ...orderAmounts?.discount,
                  category_id: orderAmounts?.discount?.category_id ?? 0,
                  name: orderAmounts?.discountCodeName,
                }}
              />
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <input
                type="text"
                placeholder="Código de descuento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </div>

            <Button
              ariaLabel="Calcular precio final"
              className="w-full py-3 mt-6"
            >
              Calcular precio final
            </Button>
          </form>
          {!isLoading ? (
            <>
              {!errorMessage ? (
                <>
                  {orderAmounts && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">
                          Subtotal
                        </span>
                        <span className="text-lg text-gray-900">
                          {formatPrice(orderAmounts?.subtotal)}
                        </span>
                      </div>

                      {orderAmounts.totalDiscounted > 0 && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-medium text-gray-800">
                            Descuento total
                          </span>
                          <span className="text-lg text-gray-900">
                            - {formatPrice(orderAmounts.totalDiscounted)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4 font-semibold">
                        <span className="text-xl">Total</span>
                        <span className="text-xl text-gray-900">
                          {formatPrice(orderAmounts.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-4 text-center text-md font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}
            </>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <div className="mt-4 text-center text-lg font-semibold text-gray-700">
          Tu carrito está vacío. Agrega productos para continuar.
        </div>
      )}
    </div>
  );
};

export default Checkout;
