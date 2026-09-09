import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./providers/UserContextProvider.tsx";
import AppContextProvider from "./providers/AppContextProvider.tsx";
import EditSessionProvider from "./providers/EditSessionProvider.tsx";
import ReimbursementSessionProvider from "./providers/ReimbursementSessionProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <EditSessionProvider>
          <ReimbursementSessionProvider>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </ReimbursementSessionProvider>
        </EditSessionProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
