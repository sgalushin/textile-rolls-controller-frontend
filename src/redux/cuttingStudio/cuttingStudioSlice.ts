import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { emptyCurrentDescendant, emptyCuttingStudioState } from "./CuttingStudioState";
import { createDescendantRoll, getAllRollsByPhysicalId, getRoll } from "../../APIs/rollsAPI";
import { ErrorIncorrectQrCode, RollRef } from "../../RollRef";
import { getCurrentUserRepresentation } from "../../APIs/Auth";
import { RootState } from "../store";

export const fetchParentRoll = createAsyncThunk("cuttingStudio/fetchParentRoll", async (qrCode: string, thunkAPI) => {
  thunkAPI.dispatch(cuttingStudioSlice.actions.setParentQr(qrCode));

  const ref = RollRef.fromQrCode(qrCode);
  const res = await getRoll(ref);
  if (!res) {
    return thunkAPI.rejectWithValue("Roll not found");
  }
  thunkAPI.dispatch(
    fetchAllDescendantRolls({
      physicalId: res.physicalId,
      id: ref.id,
      version: ref.version,
    })
  );
  return res;
});

export const fetchAllDescendantRolls = createAsyncThunk(
  "cuttingStudio/fetchAllDescendantRolls",
  async ({ physicalId, id, version }: { physicalId: string; id: string; version: string }) => {
    const rollsSortFunc = (a: any, b: any) => b.modified.localeCompare(a.modified);
    const res = await getAllRollsByPhysicalId(physicalId);
    // @ts-ignore
    const latestVersions = [...new Set(res.Items.filter((r: any) => r.parentRoll?.id == id).map((r: any) => r.id))].map(
      (id: string) => res.Items.filter((r: any) => r.id == id).sort(rollsSortFunc)[0]
    );
    console.log(latestVersions);
    return latestVersions;
  }
);

export const saveDescendantRoll = createAsyncThunk("cuttingStudio/saveDescendantRoll", async (qrCode: string, thunkAPI) => {
  const state = (thunkAPI.getState() as RootState).cuttingStudio;

  let rollInDb: any = null;
  try {
    const newRef = RollRef.fromQrCode(qrCode);
    rollInDb = await getRoll(newRef);
  } catch (e) {
    if (e instanceof ErrorIncorrectQrCode) {
      return thunkAPI.rejectWithValue("Incorrect QR Code");
    }
  }

  if (rollInDb) {
    return thunkAPI.rejectWithValue("This QR code is already associated with existing roll. Try another QR code.");
  }

  const ref = await createDescendantRoll({
    user: {
      representation: await getCurrentUserRepresentation(),
    },
    parentRef: RollRef.fromObj(state.parent.roll!),
    newRef: RollRef.fromQrCode(qrCode),
    quality: state.currentDescendant.quality,
    firstClassLength: state.currentDescendant.firstClassLength,
    totalLength: state.currentDescendant.totalLength,
  });

  const { physicalId, id, version } = state.parent.roll;
  thunkAPI.dispatch(
    fetchAllDescendantRolls({
      physicalId,
      id,
      version,
    })
  );

  return JSON.stringify(ref);
});

export const cuttingStudioSlice = createSlice({
  name: "cuttingStudio",
  initialState: emptyCuttingStudioState,
  reducers: {
    setParentQr: (state, action) => {
      if (!action.payload) {
        return emptyCuttingStudioState;
      }
      state.parent.qrCode = action.payload;
    },
    setDescendants: (state, action) => {
      state.descendants = action.payload;
    },
    setCurrentDescendant: (state, action) => {
      const { totalLength, firstClassLength, qualityNote } = action.payload;
      state.currentDescendant.totalLength = totalLength;
      state.currentDescendant.firstClassLength = firstClassLength;
      state.currentDescendant.quality = {
        note: qualityNote,
      };
    },
    resetCurrentDescendant: (state) => {
      state.currentDescendant = emptyCurrentDescendant;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchParentRoll.fulfilled, (state, action) => {
      state.parent.loading = false;
      state.parent.error = undefined;
      state.parent.roll = action.payload;
    });
    builder.addCase(fetchParentRoll.pending, (state, action) => {
      state.parent.loading = true;
      state.parent.error = undefined;
      state.parent.roll = undefined;
    });
    builder.addCase(fetchParentRoll.rejected, (state, action) => {
      state.parent.loading = false;
      state.parent.error = action.error.message == "Rejected" ? JSON.stringify(action.payload) : action.error.message;
      state.parent.roll = undefined;
    });

    builder.addCase(saveDescendantRoll.fulfilled, (state, action) => {
      state.currentDescendant.isSaving = false;
      state.currentDescendant.justSaved = true;
    });
    builder.addCase(saveDescendantRoll.pending, (state, action) => {
      state.currentDescendant.isSaving = true;
      state.currentDescendant.justSaved = false;
      state.currentDescendant.error = undefined;
    });
    builder.addCase(saveDescendantRoll.rejected, (state, action) => {
      state.currentDescendant.isSaving = false;
      state.currentDescendant.error = action.error.message == "Rejected" ? JSON.stringify(action.payload) : action.error.message;
    });

    builder.addCase(fetchAllDescendantRolls.fulfilled, (state, action) => {
      state.descendants.rolls = action.payload;
      state.descendants.loading = false;
    });
    builder.addCase(fetchAllDescendantRolls.pending, (state, action) => {
      state.descendants.rolls = [];
      state.descendants.loading = true;
    });
  },
});

export default cuttingStudioSlice.reducer;
export const { setParentQr, setCurrentDescendant, resetCurrentDescendant } = cuttingStudioSlice.actions;
