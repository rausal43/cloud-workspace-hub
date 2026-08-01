import React from 'react';

export function AddTaskModal({ 
  isOpen, 
  onClose, 
  taskText, 
  setTaskText, 
  taskAssignee, 
  setTaskAssignee, 
  taskDueDate, 
  setTaskDueDate, 
  activeProject, 
  currentUser, 
  onSubmit 
}) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Item Tugas Baru</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Tugas</label>
            <input
              type="text"
              className="input-field"
              placeholder="Misal: Buat dokumentasi Firestore schema..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Penanggung Jawab (Assignee Undangan Gmail)</label>
            <select
              className="input-field"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
            >
              {activeProject?.members && activeProject.members.length > 0 ? (
                activeProject.members.map((m, idx) => (
                  <option key={idx} value={m.name || m.email}>
                    {m.name} ({m.email || 'Anggota'}) - {m.role || 'Member'}
                  </option>
                ))
              ) : (
                <option value={currentUser ? currentUser.name : 'Rausal Bahtiar'}>
                  {currentUser ? currentUser.name : 'Rausal Bahtiar'}
                </option>
              )}
              <option value="Semua Anggota Tim">Semua Anggota Tim</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Target Selesai (Due Date)</label>
            <input
              type="date"
              className="input-field"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditTaskModal({ 
  isOpen, 
  onClose, 
  taskText, 
  setTaskText, 
  taskAssignee, 
  setTaskAssignee, 
  taskDueDate, 
  setTaskDueDate, 
  activeProject, 
  currentUser, 
  onSubmit 
}) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Item Tugas</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Tugas</label>
            <input
              type="text"
              className="input-field"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Penanggung Jawab (Assignee Undangan Gmail)</label>
            <select
              className="input-field"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
            >
              {activeProject?.members && activeProject.members.length > 0 ? (
                activeProject.members.map((m, idx) => (
                  <option key={idx} value={m.name || m.email}>
                    {m.name} ({m.email || 'Anggota'}) - {m.role || 'Member'}
                  </option>
                ))
              ) : (
                <option value={currentUser ? currentUser.name : 'Rausal Bahtiar'}>
                  {currentUser ? currentUser.name : 'Rausal Bahtiar'}
                </option>
              )}
              <option value="Semua Anggota Tim">Semua Anggota Tim</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Target Selesai (Due Date)</label>
            <input
              type="date"
              className="input-field"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddCategoryModal({ isOpen, onClose, newCategoryName, setNewCategoryName, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Kelompok List Baru</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Kelompok List</label>
            <input
              type="text"
              className="input-field"
              placeholder="Misal: Tugas Desain / Testing API / Sprint 1"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Buat Kelompok List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
