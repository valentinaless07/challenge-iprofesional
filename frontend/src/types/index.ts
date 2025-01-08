export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  categories: Category[];
  discount: number;
  price: number;
  total_price: number;
};

export type Category = {
  id: number;
  name: string;
};

export type CartItem = Product & {
  quantity: number;
};
