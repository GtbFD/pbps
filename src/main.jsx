import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportPrice from "./pages/ReportPrice.jsx";
import CodeSearchArea from "./components/CodeSearchArea.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<App children={<CodeSearchArea />} />} />
        <Route path="/report" element={<ReportPrice />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
