import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCharacteristics, getAllProducts } from "../../APIs/productCatalogAPI";
import { RootState } from "../store";
import { emptyProductsState } from "./ProductsState";

export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
  return await getAllProducts();
});

export const fetchAllCharacteristicsForAProduct = createAsyncThunk(
  "products/fetchAllCharacteristicsForAProduct",
  async (productId: string) => {
    return {
      [productId]: await getAllCharacteristics(productId),
    };
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState: emptyProductsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products.items = action.payload;
      state.products.loading = false;
    });
    builder.addCase(fetchAllProducts.pending, (state, action) => {
      state.products.loading = true;
    });

    builder.addCase(fetchAllCharacteristicsForAProduct.pending, (state, action) => {
      state.characteristics.loading = true;
    });
    builder.addCase(fetchAllCharacteristicsForAProduct.fulfilled, (state, action) => {
      state.characteristics.items = {
        ...state.characteristics.items,
        ...action.payload,
      };
      state.characteristics.loading = false;
    });
  },
});

export default productsSlice.reducer;
