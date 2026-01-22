import React, { useState } from 'react';
import { apiFetch } from "../api";

export default function SearchLineItemById() {
  const [lineItemId, setLineItemId] = useState('');
  const [lineItemData, setLineItemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    if (!lineItemId) return;

    setLoading(true);
    setLineItemData(null);
    setError('');

    try {
      const res = await apiFetch(`/api/line_items/${lineItemId}`);
      if (!res.ok) throw new Error('Line Item not found');

      const data = await res.json();
      setLineItemData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch line item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Line Item by ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={lineItemId}
          onChange={e => setLineItemId(e.target.value)}
          placeholder="Enter Line Item ID"
        />
        <button type="submit" disabled={!lineItemId || loading}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {lineItemData && (
        <div className="lineitem-details">
          <h3>Line Item Properties</h3>
          <table>
            <tbody>
              {Object.entries(lineItemData.properties || {}).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value ?? <span className="null-value">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
