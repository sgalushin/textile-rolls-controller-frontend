export interface Characteristic {
  id: string;
  version: string;
  previousVersion: string;
  name: string;
  deletionMark: boolean;
  picture?: {
    crock2: string;
    name: string;
    id: string;
    hash: string;
  };

  color?: {
    pantone?: string;
    name: string;
    id: string;
    r?: number;
    g?: number;
    b?: number;
  };
}
