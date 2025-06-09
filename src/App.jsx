import React, { useState, useEffect } from 'react';
import ObjectList from './components/ObjectList';
import ObjectDetail from './components/ObjectDetail';

export default function App() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [items, setItems] = useState([]);
  const [paging, setPaging] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  const fetchItems = (after = null) => {
    let url = `/api/${activeTab}?limit=20`;
    if (after) url += `&after=${after}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data.results);
        setPaging(data.paging || null);
        setSelectedObject(null);
      })
      .catch(() => {
        setItems([]);
        setPaging(null);
        setSelectedObject(null);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        {['contacts', 'companies', 'deals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: 10,
              padding: '8px 16px',
              backgroundColor: tab === activeTab ? '#007bff' : '#eee',
              color: tab === activeTab ? 'white' : 'black',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, maxWidth: 300, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: 10 }}>
          <ObjectList items={items} onSelect={setSelectedObject} />
          <div style={{ marginTop: 10 }}>
            {paging?.next ? (
              <button onClick={() => fetchItems(paging.next.after)}>Load Next Page</button>
            ) : (
              <span>No more items</span>
            )}
          </div>
        </div>

        <div style={{ flex: 2, paddingLeft: 20 }}>
          <ObjectDetail item={selectedObject} />
        </div>
      </div>
    </div>
  );
}
