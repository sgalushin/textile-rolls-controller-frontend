import { Product } from "./Product";
import { Characteristic } from "./Characteristic";

export interface Roll {
  product: Product;
  characteristic: Characteristic;
  registrationDate: string;
  user: object; // TODO improve
  physicalId: string;
  deletionMark: boolean;
  modified: string;
  totalLength: number;
  id: string;
  version: string;
}
