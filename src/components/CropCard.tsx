import React from 'react';

type Crop = {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  harvestDate: string;
  photo?: string;
};

export default function CropCard({
  crop,
  onRequest,
}: {
  crop: Crop;
  onRequest?: (id?: string) => void;
}) {
  return (
    <div
      style={{
        background: '#fff',
        padding: 12,
        borderRadius: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {crop.photo ? (
        <img src={crop.photo} alt={crop.name} style={{ height: 80, objectFit: 'cover', borderRadius: 8 }} />
      ) : (
        <div style={{ height: 80, background: '#eee', borderRadius: 8 }} />
      )}

      <div>
        <h3 style={{ margin: '6px 0' }}>{crop.name}</h3>
        <p style={{ margin: 0, fontSize: 14 }}>{crop.quantity} kg · ₹{crop.price}/kg</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#555' }}>Harvest: {crop.harvestDate}</p>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={() => onRequest && onRequest(crop.id)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: '#0b69ff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Request
        </button>
      </div>
    </div>
  );
}