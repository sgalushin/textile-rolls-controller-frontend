import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import awsExports from "../aws-exports";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCognitoAuthToken } from "./Auth";

// Returns a temporary URL to a picture, identified by hash
export const getPicture = async (hash: string) => {
  const { region, userPoolId, identityPoolId } = awsExports.Auth;

  const cognitoIdentityClient = new CognitoIdentityClient({
    region,
  });

  const logins = {
    [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: await getCognitoAuthToken(),
  };

  const credentials = fromCognitoIdentityPool({
    client: cognitoIdentityClient,
    identityPoolId: identityPoolId!,
    logins,
  });

  const s3client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: credentials,
  });

  const getObjCommand = new GetObjectCommand({
    Bucket: process.env.REACT_APP_PRODUCT_CATALOG_PICTURE_BUCKET,
    Key: `${hash}.jpg`,
  });

  const res = await getSignedUrl(s3client, getObjCommand, { expiresIn: 5 });

  return res;
};
