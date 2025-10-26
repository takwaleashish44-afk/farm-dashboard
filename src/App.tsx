import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DealerDashboard from './pages/DealerDashboard';
import FarmerForm from './pages/FarmerForm';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Link to="/">Dealer</Link>
          <Link to="/farmer">Farmer</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DealerDashboard />} />
          <Route path="/farmer" element={<FarmerForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}