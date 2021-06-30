import { configureStore } from "@reduxjs/toolkit";
import { productsSlice } from "./products/productsSlice";
import { useDispatch } from "react-redux";
import { cuttingStudioSlice } from "./cuttingStudio/cuttingStudioSlice";
import { editRollSlice } from "./editRoll/editRollSlice";

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cuttingStudio: cuttingStudioSlice.reducer,
    editRoll: editRollSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
