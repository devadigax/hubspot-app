import React, { useState } from "react";

export default function TokenProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("hubspotToken") || "");

  const save = () => {
    if (!token.trim()) return;
    localStorage.setItem("hubspotToken", token.trim());
    window.location.reload();
  };

  if (!localStorage.getItem("hubspotToken")) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Enter HubSpot Private App Token</h2>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: 350, padding: 8 }}
          placeholder="HubSpot Token"
        />
        <br /><br />
        <button onClick={save} style={{ padding: "8px 20px" }}>
          Save Token
        </button>
      </div>
    );
  }

  return children;
}
