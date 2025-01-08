import axios from "axios";

interface ProductOrder {
  id: number;
  quantity: number;
}

interface PostOrderParams {
  products: ProductOrder[];
  discountCode?: string;
}

export const postOrder = async ({
  products,
  discountCode,
}: PostOrderParams) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order`,
      {
        products,
        discountCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error en postOrder:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};
