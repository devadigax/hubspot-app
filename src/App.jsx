import React, { useState } from 'react';
import './App.css';

import TokenProvider from './TokenProvider';
import { apiFetch } from './api';

import SearchDealById from './components/SearchDealById';
import SearchContactById from './components/SearchContactById';
import SearchCompanyById from './components/SearchCompanyById';
import SearchLineItemById from './components/SearchLineItemById';
import SearchLineItemsByDealId from './components/SearchLineItemsByDealId';

const TABS = [
  { key: 'deals', label: 'Deals' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'companies', label: 'Companies' },
  { key: 'line_items', label: 'Line Items' },
  { key: 'line_items_by_deal', label: 'Line Items by Deal ID' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('deals');

  const resetToken = () => {
    localStorage.removeItem('hubspotToken');
    window.location.reload();
  };

  return (
    <TokenProvider>
      <div className="app-container">

        {/* HEADER AREA */}
        <header className="header">
          <h1>HubSpot Tools</h1>

          <button className="logout-button" onClick={resetToken}>
            Reset Token
          </button>
        </header>

        {/* TAB NAVIGATION */}
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* PAGE CONTENT */}
        <div className="main-content">
          {activeTab === 'deals' && <SearchDealById />}
          {activeTab === 'contacts' && <SearchContactById />}
          {activeTab === 'companies' && <SearchCompanyById />}
          {activeTab === 'line_items' && <SearchLineItemById />}
          {activeTab === 'line_items_by_deal' && <SearchLineItemsByDealId />}
        </div>

      </div>
    </TokenProvider>
  );
}
