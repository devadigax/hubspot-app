import React, { useState, useEffect } from 'react';
import ObjectList from './components/ObjectList';
import ObjectDetail from './components/ObjectDetail';
import CreateObject from './components/CreateObject';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [items, setItems] = useState([]);
  const [paging, setPaging] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = (after = null) => {
    setLoading(true);
    setError(null);

    let url = `/api/${activeTab}?limit=100`;
    if (after) url += `&after=${after}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data.results);
        setPaging(data.paging || null);
        setSelectedObject(null);
      })
      .catch(err => {
        console.error(err);
        setItems([]);
        setPaging(null);
        setSelectedObject(null);
        setError('Failed to load data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  return (
    <div className="app-container">
      <nav className="tab-nav">
        {['contacts', 'companies', 'deals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${tab === activeTab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="main-content">
        <div className="list-panel">
          <CreateObject objectType={activeTab} onCreated={() => fetchItems()} />

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <ObjectList items={items} onSelect={setSelectedObject} selectedId={selectedObject?.id} />
              <div className="pagination">
                {paging?.next ? (
                  <button onClick={() => fetchItems(paging.next.after)}>Load Next Page</button>
                ) : (
                  <span>No more items</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="detail-panel">
          <ObjectDetail item={selectedObject} />
        </div>
      </div>
    </div>
  );
}
