import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Landing from "./Landing";
import { MyContext } from "./Cont";
import Login from "./Login";
import Dashboard from "./dashboard";
export const url = "https://sos-backend-uj48.onrender.com"; // Replace with your backend URL

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      // Perform any side effects here
      navigate("/dashboard");
    }
  }, []);
  return (
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
  );
};

export default App;
