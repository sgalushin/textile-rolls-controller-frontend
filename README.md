# TRC - Frontend

This is a frontend (written in React, Typescript) for Textile Rolls Controller app. 

**All information about the app, including deployment instructions, is located in the backend repo - https://github.com/sgalushin/textile-rolls-controller-backend.** 

Current implementation in React is an early draft; this frontend is supposed to be split into independent apps:
 
 - **Cutting Studio** (ReactNative to run on Android tablet)
 - **TRC Rolls Creator** (Web)
 - **TRC Rolls management and analytics** (Web)

## Enviroment Variables

The following environment variables must be set when running (`npm run`) or building (`npm run build`).



| Variable Name                      | Example                                                      | Description |
|------------------------------------|--------------------------------------------------------------|-------------|
| `REACT_APP_AWS_REGION`             | eu-west-1                                                    | The assumption is that AWS Cognito User pool and S3 Products bucket are in the same region.            |
| `REACT_APP_USER_POOL_ID`             | eu-west-1_URPa8c9Xo                                          | Must be the value of CloudFormation stack's exported variable `TRC-${STAGE}-UserPool`.            |
| `REACT_APP_USER_POOL_WEB_CLIENT_ID`  | 2iqibpm21j7s2qdo4g0q293ftm                                   | Must be the value of CloudFormation stack's exported variable `TRC-${STAGE}-WebUserPoolClient`.             |
| `REACT_APP_IDENTITY_POOL_ID`         | eu-west-1:0252e05f-f6b9-4553-8f60-2951acca690e               | Must be the value of CloudFormation stack's exported variable `TRC-${STAGE}-IdentityPool`.             |
| `REACT_APP_PRODUCT_CATALOG_BASE_URL` | https://txrezwgyg3.execute-api.eu-west-1.amazonaws.com/Prod/ | Must be the value of CloudFormation stack's exported variable `TRC-${STAGE}-Products-API-URL`.            |
| `REACT_APP_PRODUCT_CATALOG_PICTURE_BUCKET` | trc-st2-common-productimagesbucket-1y26als6ohdyd | Must be the value of CloudFormation stack's exported variable `TRC-${STAGE}-ProductImagesBucket`. |
| `REACT_APP_ROLLS_BASE_URL`           | https://bazvjapr2a.execute-api.eu-west-1.amazonaws.com/Prod/ | Must be the value of an output key `APIAddress` of CloudFormation stack `trc-${STAGE}-rolls`. |

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE.txt) file.