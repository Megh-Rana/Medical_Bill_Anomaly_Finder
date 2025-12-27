import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { BillProvider } from "./context/BillContext";
import { AuthProvider } from "./context/AuthContext";

const root = document.getElementById("root");

if (!root) throw new Error("Root element missing");

createRoot(root).render(
  <AuthProvider>
    <BillProvider>
      <App />
    </BillProvider>
  </AuthProvider>
);
