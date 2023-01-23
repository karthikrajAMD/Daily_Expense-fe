import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./Component/Home";
import DisplayRecords from "./Component/DisplayRecords";
import { Context } from "./Context";
import Sidebar from "./Component/Sidebar";
function App() {
  const [sideShow, setSideShow] = useState(false);
  return (
    <div className="App">
      <Context.Provider value={[sideShow, setSideShow]}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/displayRecords" element={<DisplayRecords />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
