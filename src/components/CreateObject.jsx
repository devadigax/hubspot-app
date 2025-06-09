import React, { useState } from 'react';
import './CreateObject.css'; // Assuming you have some styles for the form

export default function CreateObject({ objectType, onCreated }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false); // Closed by default

  const fields = {
    contacts: ['firstname', 'lastname', 'email', 'phone', 'jobtitle', 'company'],
    companies: ['name', 'website', 'phone', 'address', 'city', 'state', 'zip', 'country'],
    deals: ['dealname', 'amount', 'dealstage', 'pipeline'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/${objectType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(() => {
        setFormData({});
        onCreated();
        setIsOpen(false); // Auto-collapse after creation
      })
      .catch(console.error);
  };

  return (
    <div className="create-form-container">
      <div
        className="create-form-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <strong>Create New {objectType.slice(0, -1)}</strong>
        <span style={{ float: 'right' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <form className="create-form" onSubmit={handleSubmit}>
          {fields[objectType]?.map(field => (
            <input
              key={field}
              name={field}
              value={formData[field] || ''}
              placeholder={field}
              onChange={handleChange}
            />
          ))}
          <button type="submit">Create {objectType.slice(0, -1)}</button>
        </form>
      )}
    </div>
  );
}
