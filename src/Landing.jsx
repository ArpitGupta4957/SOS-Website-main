import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate(); 

  return (
    <div>
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <button className="sos-button1" onClick={() => navigate("/login")}>
        <span className="alert-icon">⚠️</span>
        <span className="sos-text">SOS</span>
      </button>
    </div>
  );
};

export default Landing;
