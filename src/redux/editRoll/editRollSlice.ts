import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { emptyEditRollState } from "./editRollState";
import { createRoll, getRoll, updateRoll } from "../../APIs/rollsAPI";
import { RollRef } from "../../RollRef";
import { getCurrentUserRepresentation } from "../../APIs/Auth";
import { RootState } from "../store";
import { fetchAllCharacteristicsForAProduct } from "../products/productsSlice";

export const fetchRollByQrCode = createAsyncThunk("editRoll/fetchRollByQrCode", async (qrCode: string, thunkAPI) => {
  thunkAPI.dispatch(editRollSlice.actions.setRollInDbQrCode(qrCode));
  if (!qrCode) {
    return;
  }

  const roll = await getRoll(RollRef.fromUrl(qrCode));
  if (!roll) {
    return thunkAPI.rejectWithValue("Roll not found");
  }
  thunkAPI.dispatch(fetchAllCharacteristicsForAProduct(roll.product.id));
  return roll;
});

export const saveRoll = createAsyncThunk("editRoll/saveRoll", async (formValues: any, thunkAPI) => {
  const userRepresentation = await getCurrentUserRepresentation();

  const { productId, characteristicId } = formValues;
  const state = thunkAPI.getState() as RootState;
  const product = state.products.products.items.find((p) => p.id === productId);
  const characteristic = state.products.characteristics.items[productId].find((c) => c.id === characteristicId);

  if (!(product && characteristic)) {
    throw new Error("Product or characteristic referenced in the roll are not fetched.");
  }

  const createRollInput = {
    product,
    characteristic,
    user: {
      representation: userRepresentation,
    },
    previousDepartmentInfo: {
      note: formValues.previousDepartmentNote,
    },
    totalLength: formValues.totalLength,
  };

  if (state.editRoll.rollInDb?.roll) {
    console.log(formValues);
    const { id, version } = state.editRoll.rollInDb.roll;
    const updateRollInput = {
      ...createRollInput,
      ref: {
        id,
        version,
      },
      deletionMark: formValues.deletionMark,
      firstClassLength: formValues.firstClassLength,
      quality: { note: formValues.qualityNote },
    };
    return JSON.stringify(await updateRoll(updateRollInput));
  } else {
    return JSON.stringify(await createRoll(createRollInput));
  }
});

export const editRollSlice = createSlice({
  name: "editRoll",
  initialState: emptyEditRollState,
  reducers: {
    setRollInDbQrCode: (state, action) => {
      if (!action.payload) {
        return emptyEditRollState;
      } else {
        state.rollInDb = {
          qrCode: action.payload,
          isFetching: state.rollInDb?.isFetching ?? false,
        };
      }
    },
    setProductId: (state, action) => {
      const newProductId = action.payload;
      if (newProductId !== state.productId) {
        state.productId = newProductId;
        state.characteristicId = undefined;
      }
    },
    setCharacteristicId: (state, action) => {
      state.characteristicId = action.payload;
    },
    resetAll: (state) => {
      return emptyEditRollState;
    },
    resetSavingError: (state) => {
      state.isSaving = false;
      state.savingError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRollByQrCode.pending, (state, action) => {
      state.rollInDb = {
        isFetching: true,
        qrCode: state.rollInDb?.qrCode ?? "",
      };
    });
    builder.addCase(fetchRollByQrCode.fulfilled, (state, action) => {
      if (!state.rollInDb?.qrCode) {
        return emptyEditRollState;
      }
      state.rollInDb = {
        isFetching: false,
        qrCode: state.rollInDb?.qrCode ?? "",
        roll: action.payload,
      };
      const { product, characteristic, previousDepartmentInfo, totalLength } = action.payload;
      state.productId = product.id;
      state.characteristicId = characteristic.id;
      state.previousDepartmentInfo = previousDepartmentInfo;
      state.totalLength = totalLength;
    });
    builder.addCase(fetchRollByQrCode.rejected, (state, action) => {
      state.rollInDb = {
        isFetching: false,
        qrCode: state.rollInDb?.qrCode ?? "",
        fetchingError: JSON.stringify(action.error),
      };
    });
    builder.addCase(saveRoll.pending, (state, action) => {
      state.isSaving = true;
      state.savingError = undefined;
    });
    builder.addCase(saveRoll.fulfilled, (state, action) => {
      state.isSaving = false;
      state.savingError = undefined;
      state.savedRef = JSON.parse(action.payload);
    });
    builder.addCase(saveRoll.rejected, (state, action) => {
      state.isSaving = false;
      state.savingError = "Error saving this roll: " + action.error.message;
    });
  },
});

export default editRollSlice.reducer;

export const { setProductId, resetSavingError, setCharacteristicId, resetAll } = editRollSlice.actions;
