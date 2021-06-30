const {
  REACT_APP_AWS_REGION: AWS_REGION,
  REACT_APP_USER_POOL_ID: USER_POOL_ID,
  REACT_APP_USER_POOL_WEB_CLIENT_ID: USER_POOL_WEB_CLIENT_ID,
  REACT_APP_IDENTITY_POOL_ID: IDENTITY_POOL_ID,
} = process.env;

const awsExports = {
  Auth: {
    region: AWS_REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
    identityPoolId: IDENTITY_POOL_ID,
  },
};

export default awsExports;
