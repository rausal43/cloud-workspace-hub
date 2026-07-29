import React, { useState } from 'react';
import { Shield, Plus, Edit3, Trash2, Check, Lock, ShieldCheck, Palette } from 'lucide-react';

export default function RoleManagerModal({ isOpen, onClose, availableRoles, setAvailableRoles }) {
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleLevel, setRoleLevel] = useState('Editor');
  const [roleColor, setRoleColor] = useState('#1a73e8');
  
  // Permissions Checkboxes
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [canInvite, setCanInvite] = useState(false);
  const [canManageProject, setCanManageProject] = useState(false);

  const presetColors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#a142f4', '#00bcd4', '#607d8b'];

  if (!isOpen) return null;

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const newRole = {
      id: `role-${Date.now()}`,
      name: roleName.trim(),
      level: roleLevel,
      color: roleColor,
      canEdit,
      canDelete,
      canInvite,
      canManageProject
    };

    setAvailableRoles([...availableRoles, newRole]);
    resetForm();
    setShowAddRoleModal(false);
  };

  const handleOpenEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleLevel(role.level || 'Editor');
    setRoleColor(role.color || '#1a73e8');
    setCanEdit(!!role.canEdit);
    setCanDelete(!!role.canDelete);
    setCanInvite(!!role.canInvite);
    setCanManageProject(!!role.canManageProject);
  };

  const handleSaveEditRole = (e) => {
    e.preventDefault();
    if (!roleName.trim() || !editingRole) return;

    const updated = availableRoles.map(r => {
      if (r.id === editingRole.id) {
        return {
          ...r,
          name: roleName.trim(),
          level: roleLevel,
          color: roleColor,
          canEdit,
          canDelete,
          canInvite,
          canManageProject
        };
      }
      return r;
    });

    setAvailableRoles(updated);
    resetForm();
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId) => {
    if (availableRoles.length <= 1) {
      alert('Minimal harus ada 1 peran dalam sistem.');
      return;
    }
    setAvailableRoles(availableRoles.filter(r => r.id !== roleId));
  };

  const resetForm = () => {
    setRoleName('');
    setRoleLevel('Editor');
    setRoleColor('#1a73e8');
    setCanEdit(true);
    setCanDelete(false);
    setCanInvite(false);
    setCanManageProject(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--g-blue-light)', color: 'var(--g-blue)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Matriks Peran & Batasan Hak Akses</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Buat peran kustom & tentukan batasan wewenang tim secara fleksibel
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowAddRoleModal(true);
            }}
            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          >
            <Plus size={16} /> Tambah Peran Kustom
          </button>
        </div>

        {/* Roles & Permissions Matrix List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '50vh', overflowY: 'auto' }}>
          {availableRoles.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--bg-main)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge" style={{ background: `${r.color || '#1a73e8'}18`, color: r.color || '#1a73e8', fontWeight: 700 }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tingkat: {r.level || 'Custom'}</span>
                </div>

                {/* Permission Flags */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ color: r.canEdit ? 'var(--g-green)' : 'var(--text-muted)' }}>
                    {r.canEdit ? '✓ Tambah/Edit Content' : '✕ Tidak Bisa Edit'}
                  </span>
                  <span style={{ color: r.canDelete ? 'var(--g-green)' : 'var(--text-muted)' }}>
                    {r.canDelete ? '✓ Hapus Content' : '✕ Tidak Bisa Hapus'}
                  </span>
                  <span style={{ color: r.canInvite ? 'var(--g-green)' : 'var(--text-muted)' }}>
                    {r.canInvite ? '✓ Undang Tim' : '✕ Tanpa Akses Undang'}
                  </span>
                  <span style={{ color: r.canManageProject ? 'var(--g-green)' : 'var(--text-muted)' }}>
                    {r.canManageProject ? '✓ Admin Proyek' : '✕ Tanpa Akses Admin'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className="btn-icon"
                  onClick={() => handleOpenEditRole(r)}
                  title="Edit Batasan Peran"
                  style={{ padding: '4px' }}
                >
                  <Edit3 size={15} color="var(--text-secondary)" />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDeleteRole(r.id)}
                  title="Hapus Peran Ini"
                  style={{ padding: '4px' }}
                >
                  <Trash2 size={15} color="var(--g-red)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Selesai
          </button>
        </div>

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <div className="modal-overlay" onClick={() => setShowAddRoleModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Buat Peran Kustom Baru</h3>
              <form onSubmit={handleCreateRole}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Peran</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Misal: DevOps Engineer / Marketing Specialist"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tingkat Peran</label>
                  <select className="input-field" value={roleLevel} onChange={(e) => setRoleLevel(e.target.value)}>
                    <option value="Admin">Admin (Akses Pengelolaan Penuh)</option>
                    <option value="Editor">Editor (Akses Tambah & Edit)</option>
                    <option value="Read-Only">Read-Only (Hanya Akses Lihat)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Warna Badge Peran</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {presetColors.map(c => (
                      <div
                        key={c}
                        onClick={() => setRoleColor(c)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: c,
                          cursor: 'pointer',
                          border: roleColor === c ? '3px solid var(--text-primary)' : 'none'
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={roleColor}
                      onChange={(e) => setRoleColor(e.target.value)}
                      style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Permission Checkboxes */}
                <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>Matriks Batasan Hak Akses:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canEdit} onChange={(e) => setCanEdit(e.target.checked)} />
                      <span>Dapat Membuka & Mengedit Content (Diskusi, Tugas, File, Event)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canDelete} onChange={(e) => setCanDelete(e.target.checked)} />
                      <span>Dapat Menghapus Content</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canInvite} onChange={(e) => setCanInvite(e.target.checked)} />
                      <span>Dapat Mengundang & Mengelola Anggota Tim</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canManageProject} onChange={(e) => setCanManageProject(e.target.checked)} />
                      <span>Dapat Mengatur & Menghapus Proyek</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddRoleModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Peran</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {editingRole && (
          <div className="modal-overlay" onClick={() => setEditingRole(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Batasan Peran</h3>
              <form onSubmit={handleSaveEditRole}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Peran</label>
                  <input
                    type="text"
                    className="input-field"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tingkat Peran</label>
                  <select className="input-field" value={roleLevel} onChange={(e) => setRoleLevel(e.target.value)}>
                    <option value="Admin">Admin (Akses Pengelolaan Penuh)</option>
                    <option value="Editor">Editor (Akses Tambah & Edit)</option>
                    <option value="Read-Only">Read-Only (Hanya Akses Lihat)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Warna Badge Peran</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {presetColors.map(c => (
                      <div
                        key={c}
                        onClick={() => setRoleColor(c)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: c,
                          cursor: 'pointer',
                          border: roleColor === c ? '3px solid var(--text-primary)' : 'none'
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={roleColor}
                      onChange={(e) => setRoleColor(e.target.value)}
                      style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Permission Checkboxes */}
                <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>Matriks Batasan Hak Akses:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canEdit} onChange={(e) => setCanEdit(e.target.checked)} />
                      <span>Dapat Membuka & Mengedit Content (Diskusi, Tugas, File, Event)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canDelete} onChange={(e) => setCanDelete(e.target.checked)} />
                      <span>Dapat Menghapus Content</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canInvite} onChange={(e) => setCanInvite(e.target.checked)} />
                      <span>Dapat Mengundang & Mengelola Anggota Tim</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={canManageProject} onChange={(e) => setCanManageProject(e.target.checked)} />
                      <span>Dapat Mengatur & Menghapus Proyek</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingRole(null)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
