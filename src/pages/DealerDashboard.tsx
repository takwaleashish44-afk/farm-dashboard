import React, { useEffect, useState } from 'react';

type Crop = { id: number; name: string; quantity: number; price: number; farmer?: string };

export default function DealerDashboard() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = '/crops';

  const loadCrops = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Crop[] = await res.json();
      setCrops(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Failed loading crops', err);
      setError('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    // initial load
    loadCrops(controller.signal);

    // event listener for farmer updates
    const handler = () => loadCrops();
    window.addEventListener('crops-updated', handler);

    // polling fallback every 5s
    const poll = setInterval(() => loadCrops(), 5000);

    return () => {
      window.removeEventListener('crops-updated', handler);
      clearInterval(poll);
      controller.abort();
    };
  }, []);

  return (
    <section>
      <h2>Available Crops</h2>
      {loading && <div>Loading crops...</div>}
      {error && <div role="alert" style={{ color: 'crimson' }}>{error}</div>}
      {!loading && crops.length === 0 && <div>No crops available</div>}
      <ul>
        {crops.map(c => (
          <li key={c.id}>
            <strong>{c.name}</strong> — {c.quantity} units — ₹{c.price} — Farmer: {c.farmer || 'unknown'}
          </li>
        ))}
      </ul>
    </section>
  );
}