import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,

      retry: (failureCount, error) => {
        if (error.response && error.response.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            border: "none",
            padding: "8px 16px",
            width: "fit-content",
            right: 0,
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
