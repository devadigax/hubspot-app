import React, { useState } from 'react';
import { apiFetch } from "../api";

export default function SearchLineItemsByDealId() {
  const [dealId, setDealId] = useState('');
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    if (!dealId) return;

    setLoading(true);
    setError('');
    setLineItems([]);

    try {
      const res = await apiFetch(`/api/line_items/by-deal/${dealId}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setLineItems(data.lineItems || []);
    } catch (err) {
      setError(err.message || 'Error fetching line items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Line Items by Deal ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={dealId}
          onChange={e => setDealId(e.target.value)}
          placeholder="Enter Deal ID"
        />
        <button type="submit" disabled={loading || !dealId}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {lineItems.length > 0 && (
        <table border="1" cellPadding="6" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Deal Linked?</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.properties?.name}</td>
                <td>{item.properties?.quantity}</td>
                <td>{item.properties?.price}</td>
                <td style={{ fontWeight: 'bold' }}>
                  {item.isAssociated ? "✅ Yes" : "❌ No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {lineItems.length === 0 && !loading && !error && <p>No line items found.</p>}
    </div>
  );
}
