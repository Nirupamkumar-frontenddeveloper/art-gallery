import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <CartProvider>
      <ProductProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProductProvider>
    </CartProvider>
  </React.StrictMode>
);
