import React, { useState } from 'react';
import { Database, Key, CheckCircle, AlertCircle, RefreshCw, X, Server } from 'lucide-react';
import { isLiveSupabase, saveSupabaseCredentials } from '../supabase';

export default function SupabaseSettingsModal({ isOpen, onClose }) {
  const [urlInput, setUrlInput] = useState(() => localStorage.getItem('hub_supabase_url') || '');
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem('hub_supabase_key') || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(urlInput.trim(), keyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    saveSupabaseCredentials('', '');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} color="var(--g-blue)" /> Pengaturan Database Supabase (PostgreSQL)
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ 
          background: isLiveSupabase ? 'rgba(52, 168, 83, 0.1)' : 'rgba(251, 188, 4, 0.1)',
          border: `1px solid ${isLiveSupabase ? 'var(--g-green)' : 'var(--g-yellow)'}`,
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {isLiveSupabase ? (
            <CheckCircle color="var(--g-green)" size={24} />
          ) : (
            <AlertCircle color="var(--g-yellow)" size={24} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isLiveSupabase ? 'var(--g-green)' : 'var(--g-yellow)' }}>
              {isLiveSupabase ? 'Terhubung ke Database Cloud Supabase PostgreSQL' : 'Database Cloud Belum Terhubung'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isLiveSupabase 
                ? 'Seluruh data proyek, tugas, diskusi & chat tersimpan secara permanen dan terhubung real-time antar pengguna.' 
                : 'Masukkan Supabase URL & Anon Key project Anda di bawah ini agar data tersimpan permanen di cloud PostgreSQL.'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              <Server size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Supabase Project URL
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://your-project.supabase.co"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              <Key size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Supabase Anon Key (API Key)
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              required
            />
          </div>

          <div style={{
            background: 'var(--bg-main)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '20px'
          }}>
            💡 <strong>Panduan Cepat Supabase (1 Menit):</strong>
            <ol style={{ marginLeft: '18px', marginTop: '6px' }}>
              <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--g-blue)' }}>supabase.com</a> ➔ Login / Buat Proyek Baru.</li>
              <li>Masuk ke <strong>Project Settings ➔ API</strong>.</li>
              <li>Salin <strong>Project URL</strong> & <strong>anon public key</strong>, lalu tempel di atas dan klik Simpan.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {isLiveSupabase ? (
              <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ color: 'var(--g-red)' }}>
                Putuskan Supabase
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} /> {isSaved ? 'Tersimpan!' : 'Simpan & Hubungkan SQL'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
