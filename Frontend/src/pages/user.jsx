import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";
import Account from "../components/Account";
import { login } from "../redux/authSlice";

export default function User() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.userName || "");
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName: newUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update username");
      }

      dispatch(login({ user: data.body, token, rememberMe: true }));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setNewUsername(user.userName);
    setEditing(false);
    setError("");
  };

  const accounts = [
    {
      title: "Argent Bank Checking (x8349)",
      amount: "$2,082.79",
      description: "Available Balance",
    },
    {
      title: "Argent Bank Savings (x6712)",
      amount: "$10,928.42",
      description: "Available Balance",
    },
    {
      title: "Argent Bank Credit Card (x8349)",
      amount: "$184.30",
      description: "Current Balance",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/sign-in");
    }
  }, [user, token, navigate]);

  if (!user || !token) return null;

  return (
    <>
      <Header loggedIn={true} />
      <main className="main bg-dark">
        <div className="header">
          <h1>Welcome back</h1>

          {editing ? (
            <div className="edit-form">
              <div className="input-wrapper">
                <label>User name</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label>First name</label>
                <input type="text" value={user.firstName} readOnly disabled />
              </div>
              <div className="input-wrapper">
                <label>Last name</label>
                <input type="text" value={user.lastName} readOnly disabled />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="confirm-buttons">
                <button className="edit-button" onClick={handleSave}>
                  Save
                </button>
                <button className="edit-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <button className="edit-button" onClick={() => setEditing(true)}>
                Edit Name
              </button>
            </>
          )}
        </div>

        <h2 className="sr-only">Accounts</h2>
        {accounts.map((account, index) => (
          <Account
            key={index}
            title={account.title}
            amount={account.amount}
            description={account.description}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
