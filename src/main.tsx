import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import store from "./store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <NextUIProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </NextUIProvider>
    </HelmetProvider>
  </React.StrictMode>
);
