import { Product } from "../Product";
import { Characteristic } from "../Characteristic";

export interface ProductsState {
  products: {
    loading: boolean;
    error: string | null;
    items: Product[];
  };
  characteristics: {
    loading: boolean;
    error: string | null;
    items: {
      [key: string]: Characteristic[];
    };
  };
}

export const emptyProductsState: ProductsState = {
  products: {
    loading: false,
    error: null,
    items: [],
  },
  characteristics: {
    loading: false,
    error: null,
    items: {},
  },
};
