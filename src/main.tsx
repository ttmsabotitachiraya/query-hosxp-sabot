import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "prismjs/themes/prism-tomorrow.css";
import "./lib/prism";
import "./styles/global.css";
import "./styles/admin-edit-fixes.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
