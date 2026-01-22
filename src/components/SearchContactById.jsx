import React, { useState } from 'react';
import { apiFetch } from "../api";

export default function SearchContactById() {
  const [contactId, setContactId] = useState('');
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    if (!contactId) return;

    setLoading(true);
    setContactData(null);
    setError('');

    try {
      const res = await apiFetch(`/api/contacts/${contactId}`);
      if (!res.ok) throw new Error('Contact not found');

      const data = await res.json();
      setContactData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Contact by ID</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={contactId}
          onChange={e => setContactId(e.target.value)}
          placeholder="Enter Contact ID"
        />
        <button type="submit" disabled={!contactId || loading}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {contactData && (
        <div className="contact-details">
          <h3>Contact Properties</h3>
          <table>
            <tbody>
              {Object.entries(contactData.properties || {}).map(([key, value]) => (
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
