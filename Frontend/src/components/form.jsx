import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";

export default function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both a username and a password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      const token = data.body.token;

      const profileRes = await fetch(
        "http://localhost:3001/api/v1/user/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        setError(profileData.message || "Failed to fetch user profile");
        return;
      }

      dispatch(login({ user: profileData.body, token, rememberMe }));

      navigate("/user");
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="input-remember">
        <input
          type="checkbox"
          id="remember-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember-me">Remember me</label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" className="sign-in-button">
        Sign In
      </button>
    </form>
  );
}
