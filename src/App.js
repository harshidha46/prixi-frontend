import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrixiDashboard from "./dashboard";
import FactoryHealth from "./FactoryHealth";
import ProductionRate from "./ProductionRate";
import AlertsHistory from "./alerts";
import Inventory from "./Inventory";
import SalesPersonnel from "./SalesPersonnel";
import Carding from "./Carding";
import Spinning from "./Spinning";
import Weaving from "./Weaving";
import Finishing from "./Finishing";
import Copilot from "./Copilot";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrixiDashboard />} />
        <Route path="/factory-health" element={<FactoryHealth />} />
        <Route path="/production-rate" element={<ProductionRate />} />
        <Route path="/alerts" element={<AlertsHistory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales-personnel" element={<SalesPersonnel />} />
        <Route path="/carding" element={<Carding />} />
        <Route path="/spinning" element={<Spinning />} />
        <Route path="/weaving" element={<Weaving />} />
        <Route path="/finishing" element={<Finishing />} />
        <Route path="/copilot" element={<Copilot />} />
      </Routes>
    </BrowserRouter>
  );
}
