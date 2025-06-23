import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import CerrarSession from "./components/CerrarSession/CerrarSession";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./Routes/ProtectedRoute";
import "./App.css";


function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Router>
      <div id="app-container" inert={openModal ? true : undefined}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/salir" element={<CerrarSession />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout setOpenModal={setOpenModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;