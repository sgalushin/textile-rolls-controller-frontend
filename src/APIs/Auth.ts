import { Auth } from "aws-amplify";

export const getCognitoAuthToken = async () => {
  return (await Auth.currentSession()).getIdToken().getJwtToken();
};

export const getCurrentUserRepresentation = async () => {
  const userInfo = await Auth.currentUserInfo();
  return userInfo.attributes.email; // can be changed, for example, to Name+Surname, if UserPool is created with corresponding attributes
};
