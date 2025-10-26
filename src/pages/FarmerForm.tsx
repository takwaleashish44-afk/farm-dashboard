import React, { useState } from 'react';

export default function FarmerForm() {
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: cropName,
      quantity: Number(quantity || 0),
      price: Number(price || 0),
      farmer: farmerName || 'unknown'
    };

    try {
      const res = await fetch('/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `status ${res.status}`);
      }

      // success: clear form and notify other parts of the app
      setCropName('');
      setQuantity('');
      setPrice('');
      setFarmerName('');
      window.dispatchEvent(new Event('crops-updated'));
    } catch (err: any) {
      console.error('Failed to add crop', err);
      setError(err?.message || 'Failed to add crop');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
      <div>
        <label htmlFor="cropName">Crop name</label>
        <input id="cropName" value={cropName} onChange={e => setCropName(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} type="number" min="0" required />
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input id="price" value={price} onChange={e => setPrice(e.target.value)} type="number" min="0" required />
      </div>

      <div>
        <label htmlFor="farmerName">Farmer</label>
        <input id="farmerName" value={farmerName} onChange={e => setFarmerName(e.target.value)} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Crop'}</button>
      </div>

      {error && <div role="alert" style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </form>
  );
}