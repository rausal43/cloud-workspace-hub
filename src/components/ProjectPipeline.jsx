import React, { useState } from 'react';
import { Layers, Activity, CheckCircle2, Clock, AlertCircle, TrendingUp, ChevronRight, Plus } from 'lucide-react';

export default function ProjectPipeline({ stages, setStages }) {
  const [activeStageId, setActiveStageId] = useState('stage-2'); // default Development
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageProgress, setNewStageProgress] = useState(50);

  const defaultStages = stages && stages.length > 0 ? stages : [
    { id: 'stage-1', name: 'Perancangan & Arsitektur', progress: 100, status: 'completed', tasksCount: 5, color: '#34a853' },
    { id: 'stage-2', name: 'Pengembangan Backend & API', progress: 80, status: 'in-progress', tasksCount: 12, color: '#1a73e8' },
    { id: 'stage-3', name: 'Pengujian & QA Verification', progress: 45, status: 'in-progress', tasksCount: 8, color: '#fbbc04' },
    { id: 'stage-4', name: 'Peluncuran & Deployment', progress: 15, status: 'pending', tasksCount: 4, color: '#ea4335' }
  ];

  const currentStages = stages || defaultStages;

  // Calculate overall project velocity
  const avgProgress = Math.round(
    currentStages.reduce((acc, s) => acc + s.progress, 0) / currentStages.length
  );

  const handleUpdateProgress = (id, newProg) => {
    const updated = currentStages.map(s => {
      if (s.id === id) {
        let status = 'in-progress';
        if (newProg >= 100) status = 'completed';
        if (newProg <= 0) status = 'pending';
        return { ...s, progress: newProg, status };
      }
      return s;
    });
    setStages(updated);
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      progress: Number(newStageProgress),
      status: Number(newStageProgress) >= 100 ? 'completed' : 'in-progress',
      tasksCount: 3,
      color: '#1a73e8'
    };

    setStages([...currentStages, newStage]);
    setNewStageName('');
    setShowAddModal(false);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--g-blue)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Visual Progres & Pipeline Alur Kerja</h3>
            <span className="badge badge-blue">{avgProgress}% Total Progres</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Pelacakan visual interaktif berdasarkan tahapan alur kerja dan tingkat kecepatan eksekusi tim.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
        >
          <Plus size={16} /> Tambah Tahap Pipeline
        </button>
      </div>

      {/* Interactive Pipeline Track */}
      <div style={{
        background: 'var(--bg-surface-hover)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 20px',
        border: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}>
        {/* Step Nodes Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Connecting Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            right: '40px',
            height: '4px',
            background: 'var(--border-color)',
            zIndex: 0
          }} />

          {/* Active Filled Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            width: `${avgProgress * 0.88}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #34a853, #1a73e8)',
            zIndex: 0,
            transition: 'width 0.4s ease'
          }} />

          {currentStages.map((stg, idx) => {
            const isSelected = activeStageId === stg.id;
            return (
              <div
                key={stg.id}
                onClick={() => setActiveStageId(stg.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 1,
                  position: 'relative'
                }}
              >
                {/* Stage Circle Node */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: stg.status === 'completed' ? 'var(--g-green)' : (isSelected ? 'var(--g-blue)' : 'var(--bg-surface)'),
                  color: stg.status === 'completed' || isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: `3px solid ${stg.status === 'completed' ? 'var(--g-green)' : (isSelected ? 'var(--g-blue)' : 'var(--border-color)')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: isSelected ? '0 0 0 4px var(--g-blue-light)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}>
                  {stg.status === 'completed' ? <CheckCircle2 size={22} /> : (idx + 1)}
                </div>

                {/* Stage Title */}
                <span style={{
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 800 : 600,
                  marginTop: '10px',
                  color: isSelected ? 'var(--g-blue)' : 'var(--text-primary)',
                  textAlign: 'center',
                  maxWidth: '130px'
                }}>
                  {stg.name}
                </span>

                {/* Percentage Tag */}
                <span className={`badge ${stg.progress === 100 ? 'badge-green' : (stg.progress > 0 ? 'badge-blue' : 'badge-yellow')}`} style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                  {stg.progress}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail & Interactive Slider */}
      {activeStageId && (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {(() => {
            const activeStg = currentStages.find(s => s.id === activeStageId) || currentStages[0];
            return (
              <>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                    Penyesuaian Progres: <span style={{ color: 'var(--g-blue)' }}>{activeStg.name}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Status: <strong>{activeStg.status.toUpperCase()}</strong> ({activeStg.tasksCount} Tugas Terkait)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '380px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeStg.progress}
                    onChange={(e) => handleUpdateProgress(activeStg.id, Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--g-blue)' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>100%</span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Add Stage Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Tahap Pipeline Baru</h3>
            <form onSubmit={handleAddStage}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nama Tahap Alur Kerja
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Uji Coba Keamanan & User Acceptance Test"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Progres Saat Ini ({newStageProgress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newStageProgress}
                  onChange={(e) => setNewStageProgress(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--g-blue)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tahap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
