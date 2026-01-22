import React, { useState } from 'react';
import { apiFetch } from "../api";

export default function SearchDealById() {
  const [dealId, setDealId] = useState('');
  const [dealData, setDealData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    if (!dealId) return;

    setLoading(true);
    setDealData(null);
    setError('');

    try {
      const res = await apiFetch(`/api/deals/${dealId}`);
      if (!res.ok) throw new Error('Deal not found');

      const data = await res.json();
      setDealData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Deal by ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={dealId}
          onChange={e => setDealId(e.target.value)}
          placeholder="Enter Deal ID"
        />
        <button type="submit" disabled={!dealId || loading}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {dealData && (
        <div className="deal-details">
          <h3>Deal Properties</h3>

          <table>
            <tbody>
              {Object.entries(dealData.deal.properties || {}).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value ?? <span className="null-value">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Associated Line Items</h3>

          {dealData.lineItems.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {Object.keys(dealData.lineItems[0].properties).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dealData.lineItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {Object.values(item.properties).map((val, i) => (
                      <td key={i}>
                        {val ?? <span className="null-value">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No associated line items.</div>
          )}
        </div>
      )}
    </div>
  );
}
