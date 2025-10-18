
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import App from "./App";
import Radiografia from "./pages/Radiografia";
import PlanCancelacion from "./pages/PlanCancelacion";
import FondoPaz from "./pages/FondoPaz";
import Seguimiento from "./pages/Seguimiento";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/radiografia" element={<Radiografia />} />
        <Route path="/plan-cancelacion" element={<PlanCancelacion />} />
        <Route path="/fondo-paz" element={<FondoPaz />} />
        <Route path="/seguimiento" element={<Seguimiento />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
