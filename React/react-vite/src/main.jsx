import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./pages/App";

// redux
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
