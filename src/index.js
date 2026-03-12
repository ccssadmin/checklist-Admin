// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from "react-redux";
import { store } from "./redux/store";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>


const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
  <Provider store={store}>
   <BrowserRouter>
          <App />
        </BrowserRouter>
  </Provider>
);

