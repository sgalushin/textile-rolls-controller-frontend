import { Roll } from "../Roll";
import { RollRef } from "../../RollRef";

export interface EditRollState {
  productId?: string;
  characteristicId?: string;
  previousDepartmentInfo: {
    note?: string;
  };
  totalLength?: number;
  isSaving: boolean;
  savingError?: string;
  savedRef?: {
    id: string;
    version: string;
  };
  rollInDb?: {
    roll?: any;
    qrCode: string;
    isFetching: boolean;
    fetchingError?: string;
  };
}

export const emptyEditRollState: EditRollState = {
  isSaving: false,
  previousDepartmentInfo: {},
};
