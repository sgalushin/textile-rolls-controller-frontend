import { Roll } from "../Roll";

export interface CuttingStudioState {
  parent: {
    qrCode?: string;
    loading: boolean;
    error?: string;
    roll?: any;
  };
  descendants: {
    loading: boolean;
    rolls: any[];
  };
  currentDescendant: {
    isSaving: boolean;
    error?: string;
    totalLength: number;
    firstClassLength: number;
    qrCode?: string;
    quality: object;
    justSaved: boolean;
  };
}

export const emptyCurrentDescendant = {
  isSaving: false,
  totalLength: 0,
  firstClassLength: 0,
  quality: {},
  justSaved: false,
};

export const emptyCuttingStudioState: CuttingStudioState = {
  parent: {
    loading: false,
  },
  descendants: {
    loading: false,
    rolls: [],
  },
  currentDescendant: emptyCurrentDescendant,
};
