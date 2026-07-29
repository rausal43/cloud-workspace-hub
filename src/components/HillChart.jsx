import React, { useState } from 'react';
import { Mountain, Plus, ArrowUpRight, ArrowDownRight, CheckCircle2, HelpCircle } from 'lucide-react';

export default function HillChart({ items, setItems }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPosition, setNewItemPosition] = useState(30);

  // SVG Curve Math for Hill Chart (Bell curve shape)
  // x: 0 to 500, y curve
  const width = 600;
  const height = 180;

  const getPointCoordinates = (percent) => {
    // percent is 0 to 100
    const x = (percent / 100) * (width - 60) + 30;
    // Bell curve equation: y = height - (peak_height * sin(pi * x_normalized))
    const normX = percent / 100;
    const y = height - 30 - Math.sin(normX * Math.PI) * (height - 60);
    return { x, y };
  };

  const handleUpdatePosition = (id, newPos) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const stage = newPos >= 50 ? 'downhill' : 'uphill';
        return { ...item, position: newPos, stage };
      }
      return item;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem = {
      id: `hill-${Date.now()}`,
      name: newItemName,
      position: Number(newItemPosition),
      stage: Number(newItemPosition) >= 50 ? 'downhill' : 'uphill',
      color: Number(newItemPosition) >= 50 ? '#34a853' : '#1a73e8'
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setShowAddModal(false);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mountain size={20} color="var(--g-blue)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Basecamp Hill Chart™</h3>
            <span className="badge badge-blue">Visual Progress</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Visualisasi status pengerjaan: <strong>Uphill</strong> (Mencari solusi/ketidakpastian) vs <strong>Downhill</strong> (Penyelesaian akhir)
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
        >
          <Plus size={16} /> Tambah Item Hill
        </button>
      </div>

      {/* Hill Chart SVG Graphic */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-surface-hover)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 10px 10px 10px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        {/* Stage Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginBottom: '-10px', fontSize: '0.75rem', fontWeight: 700 }}>
          <div style={{ color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> FIGURING IT OUT (UPHILL)
          </div>
          <div style={{ color: '#34a853', display: 'flex', alignItems: 'center', gap: '4px' }}>
            GETTING IT DONE (DOWNHILL) <ArrowDownRight size={14} />
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="hillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#fbbc04" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#34a853" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Dotted Center Divide Line */}
          <line x1={width / 2} y1="20" x2={width / 2} y2={height - 20} stroke="var(--border-color)" strokeDasharray="4 4" />

          {/* Peak Crest Label */}
          <text x={width / 2} y="15" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="bold">
            TITIK PUNCAK (SOLUSI JELAS)
          </text>

          {/* Bell Curve Background Fill */}
          <path
            d={`
              M 30,${height - 30}
              Q ${width * 0.25},${height - 130} ${width / 2},${height - 140}
              Q ${width * 0.75},${height - 130} ${width - 30},${height - 30}
              L ${width - 30},${height - 10}
              L 30,${height - 10}
              Z
            `}
            fill="url(#hillGrad)"
          />

          {/* Bell Curve Stroke Line */}
          <path
            d={`
              M 30,${height - 30}
              Q ${width * 0.25},${height - 130} ${width / 2},${height - 140}
              Q ${width * 0.75},${height - 130} ${width - 30},${height - 30}
            `}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Render Item Dots on Hill */}
          {items.map((item) => {
            const { x, y } = getPointCoordinates(item.position);
            const isSelected = selectedItem?.id === item.id;

            return (
              <g key={item.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
                {/* Dot Pulse Effect if selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r="12" fill={item.color} opacity="0.3">
                    <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Main Dot Point */}
                <circle cx={x} cy={y} r="7" fill={item.color || '#1a73e8'} stroke="#ffffff" strokeWidth="2.5" />

                {/* Text Label next to point */}
                <text
                  x={x + (item.position > 80 ? -12 : 12)}
                  y={y - 10}
                  textAnchor={item.position > 80 ? 'end' : 'start'}
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : '600'}
                >
                  {item.name} ({item.position}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Item Position Adjuster & Quick List */}
      {selectedItem && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Geser Progres: <span style={{ color: selectedItem.color }}>{selectedItem.name}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Status saat ini: {selectedItem.position >= 50 ? ' Downhill (Eksekusi)' : ' Uphill (Eksplorasi)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '350px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>0%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItem.position}
              onChange={(e) => handleUpdatePosition(selectedItem.id, Number(e.target.value))}
              style={{ width: '100%', accentColor: selectedItem.color }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>100%</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setSelectedItem(null)}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Tutup
          </button>
        </div>
      )}

      {/* Add Hill Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Item ke Hill Chart</h3>
            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nama Fitur / Tugas Proyek
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Integrasi Google Drive Upload API"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Posisi Awal di Hill: {newItemPosition}% ({newItemPosition >= 50 ? 'Downhill' : 'Uphill'})
                </label>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={newItemPosition}
                  onChange={(e) => setNewItemPosition(e.target.value)}
                  style={{ width: '100%', accentColor: '#1a73e8' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>0% (Baru Ide)</span>
                  <span>50% (Puncak)</span>
                  <span>100% (Selesai)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
