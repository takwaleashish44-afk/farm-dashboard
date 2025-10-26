import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const loc = useLocation();
  return (
    <header style={headerStyle}>
      <div style={{fontWeight:700}}>Farm Management</div>
      <nav style={{display:'flex', gap:12}}>
        <Link style={navLink(loc.pathname === '/')} to="/">Dealer Dashboard</Link>
        <Link style={navLink(loc.pathname === '/farmer')} to="/farmer">Farmer Portal</Link>
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 20px',
  background: '#f7faf6',
  borderBottom: '1px solid #e6e6e6'
};

const navLink = (active = false): React.CSSProperties => ({
  color: active ? '#2b7a2b' : '#333',
  textDecoration: 'none',
  fontWeight: 600
});