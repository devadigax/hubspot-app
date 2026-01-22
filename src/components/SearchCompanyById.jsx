import React, { useState } from 'react';
import { apiFetch } from "../api";

export default function SearchCompanyById() {
  const [companyId, setCompanyId] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null); // FULL JSON

  const handleSearch = async e => {
    e.preventDefault();
    if (!companyId) return;

    setLoading(true);
    setCompanyData(null);
    setError('');
    setErrorDetails(null);

    try {
      const res = await apiFetch(`/api/companies/${companyId}`);
      const data = await res.json();
      setCompanyData(data);

    } catch (error) {
  const hubspotError = error.response?.data || {
    status: "error",
    message: error.message,
  };

  console.error("HubSpot API Error:", hubspotError);

  res.status(error.response?.status || 500).json(hubspotError);
}


    setLoading(false);
  };

  return (
    <div>
      <h2>Search Company by ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={companyId}
          onChange={e => setCompanyId(e.target.value)}
          placeholder="Enter Company ID"
        />
        <button type="submit" disabled={!companyId || loading}>Search</button>
      </form>

      {loading && <div>Loading...</div>}

      {/* Human-readable message */}
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Full JSON error message */}
      {errorDetails && (
        <pre
          style={{
            background: "#222",
            color: "#0f0",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "6px",
            maxHeight: "350px",
            overflow: "auto",
          }}
        >
{JSON.stringify(errorDetails, null, 2)}
        </pre>
      )}

      {/* Show company result */}
      {companyData && (
        <div className="company-details">
          <h3>Company Properties</h3>
          <table>
            <tbody>
              {Object.entries(companyData.properties || {}).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
