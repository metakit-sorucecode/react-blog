import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./app/router";
import { DummyProvider } from "./shared/dummy/DummyProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DummyProvider>
      <RouterProvider router={router} />
    </DummyProvider>
  </React.StrictMode>
);
