import React, { useState } from 'react';
import { Database, Key, ShieldCheck, ExternalLink, Check, Copy } from 'lucide-react';

export default function FirebaseSettingsModal({ isOpen, onClose, isLiveFirebase }) {
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--g-blue-light)', color: 'var(--g-blue)' }}>
            <Database size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Konfigurasi Google Firebase & Drive API</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Hubungkan aplikasi ATM Basecamp ini dengan proyek Google Firebase & Google Drive asli milik Anda.
            </span>
          </div>
        </div>

        {/* Current Mode Badge */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: isLiveFirebase ? 'var(--g-green-light)' : 'var(--g-yellow-light)',
          border: `1px solid ${isLiveFirebase ? 'rgba(52,168,83,0.3)' : 'rgba(251,188,4,0.3)'}`,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isLiveFirebase ? 'var(--g-green)' : '#b08400' }}>
              Mode Saat Ini: {isLiveFirebase ? '🔥 Firebase Live Connected' : '⚡ Local Firebase Demo Mode'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isLiveFirebase 
                ? 'Terhubung dengan database Firestore real-time & Google Auth.'
                : 'Aplikasi berjalan lancar dengan mock database reaktif. Masukkan API keys untuk beralih ke backend live.'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '6px' }}>
              Firebase Web API Key
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '6px' }}>
              Firebase Project ID
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="my-google-basecamp-app"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '6px' }}>
              Firebase Storage Bucket URL
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="my-google-basecamp-app.appspot.com"
              value={storageBucket}
              onChange={(e) => setStorageBucket(e.target.value)}
            />
          </div>

          <div style={{
            background: 'var(--bg-main)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginBottom: '20px',
            border: '1px solid var(--border-color)'
          }}>
            ℹ️ <strong>Tips:</strong> Dapatkan kredensial ini secara gratis dari{' '}
            <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--g-blue)' }}>
              Google Firebase Console <ExternalLink size={11} />
            </a>.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {savedSuccess ? (
              <span style={{ color: 'var(--g-green)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={16} /> Kredensial Berhasil Disimpan!
              </span>
            ) : <div />}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Tutup
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan & Hubungkan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
