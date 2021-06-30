import axios from "axios";
import { getCognitoAuthToken } from "./Auth";
import { RollRef } from "../RollRef";

const createRollsAPI = async () => {
  const authorizationToken = await getCognitoAuthToken();
  return axios.create({
    baseURL: process.env.REACT_APP_ROLLS_BASE_URL!,
    headers: {
      Authorization: authorizationToken,
    },
  });
};

export const createRoll = async (input: object): Promise<RollRef> => {
  const res = await (await createRollsAPI()).post("/rolls/createRoll", input);
  return RollRef.fromObj(res.data);
};

export const updateRoll = async (input: object): Promise<RollRef> => {
  const res = await (await createRollsAPI()).post("/rolls/updateRoll", input);
  return RollRef.fromObj(res.data);
};

export const createDescendantRoll = async (input: object): Promise<RollRef> => {
  const res = await (await createRollsAPI()).post("/rolls/createDescendantRoll", input);
  return RollRef.fromObj(res.data);
};

export const getRoll = async (ref: RollRef) => {
  const res = await (
    await createRollsAPI()
  ).post(
    "rolls/getRoll",
    {
      id: ref.id,
      version: ref.version,
    },
    {
      validateStatus: (status) => [200, 404].includes(status),
    }
  );
  if (res.status == 404) {
    return null;
  }
  return res.data;
};

export const getEmptyRefs = async (numberOfRefs: number) => {
  const res = await (await createRollsAPI()).post("rolls/getRefsWithoutSaving", { numberOfRefs });
  return res.data.map(RollRef.fromObj);
};

export const getAllRollsByDate = async (date: Date) => {
  const res = await (await createRollsAPI()).post("rolls/getAllRollsByDate", { date });
  return res.data;
};

export const getAllRollsByPhysicalId = async (physicalId: string) => {
  const res = await (await createRollsAPI()).post("rolls/getAllRollsByPhysicalId", { physicalId });
  return res.data;
};
