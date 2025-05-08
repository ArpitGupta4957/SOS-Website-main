import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import supabase from "./supabaseClient"; // Import Supabase client
import "./Login.css";
import axios from "axios";
import { url } from "./App";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response=await axios.post(`${url}/login`,{
      email:email,
      password:password
    }, {
      withCredentials: true, 
    })
    console.log(response)
    if (response.status!==200) {
      console.error("Login Failed:", error.message);
      alert("Login failed! Please check your credentials.");
    } else {
      localStorage.setItem("access_token",response.data.access_token);
      console.log("Login Success:", data);
      navigate("/dashboard");
    }
  };

  return (
    <div className="background">
      <div className="container-1">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="icon">📧</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon">🔒</span>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/">Forgot Password</a>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
