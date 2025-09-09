import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./providers/UserContextProvider.tsx";
import AppContextProvider from "./providers/AppContextProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
