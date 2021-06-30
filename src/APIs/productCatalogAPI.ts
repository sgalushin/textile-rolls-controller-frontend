import axios from "axios";
import { getCognitoAuthToken } from "./Auth";

export const createProductCatalogAPI = async () => {
  const authorizationToken = await getCognitoAuthToken();
  return axios.create({
    baseURL: process.env.REACT_APP_PRODUCT_CATALOG_BASE_URL!,
    headers: {
      Authorization: authorizationToken,
    },
  });
};

export const getAllProducts = async () => {
  const response = await (await createProductCatalogAPI()).get("/products");
  return response.data;
};

export const getAllCharacteristics = async (productId: string) => {
  const response = await (await createProductCatalogAPI()).get(`/products/${productId}`);
  return response.data;
};
