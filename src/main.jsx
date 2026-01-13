
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
