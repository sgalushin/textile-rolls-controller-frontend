import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Amplify } from "aws-amplify";
import "antd/dist/antd.css";

import { App } from "./components/App";
import store from "./redux/store";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
