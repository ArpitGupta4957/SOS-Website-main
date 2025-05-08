import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./Login.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const user = auth.currentUser;

  const handleResetPassword = async () => {
    if (!user) {
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Password successfully updated! Please login with your new password.");
      navigate("/login");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="background">
      <div className="container-1">
        <h2>Reset Password</h2>
        <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button onClick={handleResetPassword}>Update Password</button>
      </div>
    </div>
  );
};

export default ResetPassword;
