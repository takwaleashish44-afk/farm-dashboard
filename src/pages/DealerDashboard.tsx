import React, { useEffect, useRef, useState } from 'react';
import CropCard from '../components/CropCard';
import { io, Socket } from 'socket.io-client';
console.log('TRACE: Dealer component rendered');
type RawCrop = {
  id?: string;
  name: string;
  qty: number;
  price: number;
  harvest: string;
  photo?: string;
};

type MappedCrop = {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  harvestDate: string;
  photo?: string;
};

export default function DealerDashboard() {
  const [crops, setCrops] = useState<MappedCrop[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const mapCrop = (c: RawCrop): MappedCrop => ({
    id: c.id,
    name: c.name,
    quantity: c.qty,
    price: c.price,
    harvestDate: c.harvest,
    photo: c.photo,
  });
console.log('Dealer component mounted');
  useEffect(() => {
    const s = io('http://localhost:3000', { transports: ['websocket'] });
    socketRef.current = s;

    console.log('Dealer attempting socket connect...');
    s.on('connect', () => {
      console.log('Dealer socket connected', s.id);
      s.emit('join', 'dealer');
    });

    s.on('connect_error', (err) => console.error('Dealer connect_error', err));
    s.on('disconnect', (reason) => console.log('Dealer socket disconnected', reason));

    s.on('inventory:init', (data: RawCrop[]) => {
      console.log('Dealer received inventory:init', data);
      setCrops(Array.isArray(data) ? data.map(mapCrop) : []);
    });

    s.on('inventory:changed', (data: RawCrop[]) => {
      console.log('Dealer received inventory:changed', data);
      setCrops(Array.isArray(data) ? data.map(mapCrop) : []);
      // optional visual cue (non-blocking)
      const t = document.createElement('div');
      t.textContent = `inventory changed, items=${Array.isArray(data) ? data.length : 0}`;
      Object.assign(t.style, { position: 'fixed', left: 12, bottom: 12, zIndex: 9999, background: '#0b69ff', color: '#fff', padding: '8px 12px', borderRadius: 8 });
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleRequest = (id?: string) => {
    console.log('Request clicked for id:', id);
    alert('Request sent for crop id: ' + id);
  };

  return (
    <div style={{ padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Dealer Dashboard</h1>
        <p style={{ margin: '6px 0', color: '#666' }}>Crop count: {crops.length}</p>
      </header>

      <section style={{ marginBottom: 16 }}>
        <h2>Available Crops</h2>
        <p>Live farmer-submitted inventory via Socket.IO</p>
      </section>

      <section id="inventory" style={{ padding: 8 }}>
        <div
          className="grid"
          style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {crops.length === 0 ? (
            <div style={{ padding: 12, border: '1px dashed #ccc', borderRadius: 8 }}>
              No crops available. Ask farmers to submit.
            </div>
          ) : (
            crops.map((c) => <CropCard key={c.id ?? `${c.name}-${c.harvestDate}`} crop={c} onRequest={(id) => handleRequest(id)} />)
          )}
        </div>
      </section>

      <div style={{ position: 'fixed', right: 12, top: 12, zIndex: 9999, background: '#fff9', padding: 8, borderRadius: 8, maxWidth: 360, maxHeight: 300, overflow: 'auto' }}>
        <strong style={{ display: 'block', marginBottom: 6 }}>Debug Inventory</strong>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(crops, null, 2)}</pre>
      </div>
    </div>
  );
}