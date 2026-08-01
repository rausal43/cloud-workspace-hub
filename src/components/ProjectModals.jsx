import React from 'react';

export function NewProjectModal({ 
  isOpen, 
  onClose, 
  projName, 
  setProjName, 
  projCat, 
  setProjCat, 
  projDesc, 
  setProjDesc, 
  onSubmit 
}) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Buat Proyek Baru</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Proyek</label>
            <input
              type="text"
              className="input-field"
              placeholder="Misal: test / Portal Pelanggan Google Cloud"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
            <input
              type="text"
              className="input-field"
              placeholder="Misal: Infrastructure / Mobile App"
              value={projCat}
              onChange={(e) => setProjCat(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Singkat</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Jelaskan tujuan utama proyek ini..."
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Buat Proyek</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditProjectModal({ 
  isOpen, 
  onClose, 
  projName, 
  setProjName, 
  projCat, 
  setProjCat, 
  projDesc, 
  setProjDesc, 
  onSubmit 
}) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Informasi Proyek</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Proyek</label>
            <input
              type="text"
              className="input-field"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
            <input
              type="text"
              className="input-field"
              value={projCat}
              onChange={(e) => setProjCat(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi</label>
            <textarea
              className="input-field"
              rows={3}
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteProjectModal({ isOpen, onClose, activeProject, onDeleteConfirm }) {
  if (!isOpen || !activeProject) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <h3 style={{ marginBottom: '12px', fontWeight: 800, color: 'var(--g-red)' }}>Hapus Proyek?</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Apakah Anda yakin ingin menghapus proyek <strong>"{activeProject.name}"</strong>? Seluruh data tugas dan diskusi di dalamnya akan dihapus.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={onDeleteConfirm} style={{ background: 'var(--g-red)' }}>
            Ya, Hapus Proyek
          </button>
        </div>
      </div>
    </div>
  );
}
