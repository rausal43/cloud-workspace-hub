import React, { useState } from 'react';
import { Users, Mail, Plus, Trash2, Edit3, Check, Send, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import RoleManagerModal from './RoleManagerModal';

export default function TeamManagerModal({ 
  isOpen, 
  onClose, 
  activeProject, 
  onUpdateProjectMembers,
  availableRoles,
  setAvailableRoles,
  onAddActivity
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'invite'
  const [showRoleManager, setShowRoleManager] = useState(false);
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState(availableRoles[0]?.name || 'Developer');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit member role state
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [editedRole, setEditedRole] = useState('');

  if (!isOpen || !activeProject) return null;

  const members = activeProject.members || [];
  const selectedRoleName = inviteRole || (availableRoles[0] ? availableRoles[0].name : 'Developer');

  // Generate Real Join / Access Link
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://project-management-388.pages.dev';
  const inviteLink = `${currentOrigin}/?invite=${encodeURIComponent(activeProject.id)}&role=${encodeURIComponent(selectedRoleName)}&email=${encodeURIComponent(inviteEmail || 'user')}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendGmailInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      name: inviteName.trim() || inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&w=150&q=80`,
      role: selectedRoleName
    };

    const updatedMembers = [...members, newMember];
    onUpdateProjectMembers(updatedMembers);

    // Record Real Activity
    if (onAddActivity) {
      onAddActivity(`Mengundang ${newMember.name} (${newMember.email}) sebagai ${selectedRoleName}`);
    }

    // Open Real Gmail Web Composer with prefilled email & invite link
    const subject = encodeURIComponent(`Undangan Bergabung ke Proyek: ${activeProject.name}`);
    const bodyText = encodeURIComponent(
      `Halo,\n\nAnda diundang untuk bergabung ke dalam proyek "${activeProject.name}" sebagai ${selectedRoleName}.\n\nKlik link di bawah ini untuk mengakses ruang kerja proyek:\n${inviteLink}\n\nSalam,\nTim ${activeProject.name}`
    );
    
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inviteEmail.trim())}&su=${subject}&body=${bodyText}`;
    window.open(gmailWebUrl, '_blank');

    setInviteSuccessMsg(`Undangan ditambahkan! Gmail composer telah dibuka untuk mengirikan email ke ${inviteEmail}.`);
    setInviteEmail('');
    setInviteName('');
    
    setTimeout(() => {
      setInviteSuccessMsg('');
      setActiveTab('list');
    }, 2500);
  };

  const handleRemoveMember = (index) => {
    if (members.length <= 1) {
      alert('Proyek minimal harus memiliki 1 anggota tim.');
      return;
    }
    const removed = members[index];
    const updatedMembers = members.filter((_, i) => i !== index);
    onUpdateProjectMembers(updatedMembers);
    if (onAddActivity && removed) {
      onAddActivity(`Menghapus ${removed.name} dari tim proyek`);
    }
  };

  const handleSaveRole = (index) => {
    const updatedMembers = members.map((m, i) => {
      if (i === index) {
        return { ...m, role: editedRole };
      }
      return m;
    });
    onUpdateProjectMembers(updatedMembers);
    if (onAddActivity && members[index]) {
      onAddActivity(`Mengubah peran ${members[index].name} menjadi ${editedRole}`);
    }
    setEditingMemberIndex(null);
  };

  const getRoleColor = (roleName) => {
    const found = availableRoles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    return found ? found.color : '#1a73e8';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--g-blue-light)', color: 'var(--g-blue)' }}>
              <Users size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manajemen Tim & Akses Proyek</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {activeProject.name} ({members.length} Anggota)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowRoleManager(true)}
              style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              title="Atur Peran Kustom & Batasan Hak Akses"
            >
              <ShieldCheck size={14} color="var(--g-blue)" /> Matriks Peran
            </button>
            <button
              className="btn"
              onClick={() => setActiveTab('list')}
              style={{
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'list' ? 'var(--g-blue)' : 'var(--bg-surface-hover)',
                color: activeTab === 'list' ? '#fff' : 'var(--text-primary)'
              }}
            >
              Daftar Tim
            </button>
            <button
              className="btn"
              onClick={() => setActiveTab('invite')}
              style={{
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'invite' ? 'var(--g-blue)' : 'var(--bg-surface-hover)',
                color: activeTab === 'invite' ? '#fff' : 'var(--text-primary)'
              }}
            >
              + Undang Gmail
            </button>
          </div>
        </div>

        {/* Tab 1: Member List & CRUD */}
        {activeTab === 'list' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '50vh', overflowY: 'auto' }}>
              {members.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={m.name} className="avatar" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.email || `${m.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {editingMemberIndex === idx ? (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <select
                          className="input-field"
                          value={editedRole}
                          onChange={(e) => setEditedRole(e.target.value)}
                          style={{ height: '32px', padding: '2px 6px', fontSize: '0.78rem' }}
                        >
                          {availableRoles.map(r => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                        <button className="btn btn-primary" onClick={() => handleSaveRole(idx)} style={{ padding: '4px 8px' }}>
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="badge" style={{ background: `${getRoleColor(m.role)}18`, color: getRoleColor(m.role) }}>
                        {m.role}
                      </span>
                    )}

                    <button
                      className="btn-icon"
                      onClick={() => {
                        setEditingMemberIndex(idx);
                        setEditedRole(m.role);
                      }}
                      title="Edit Peran Anggota"
                      style={{ padding: '4px' }}
                    >
                      <Edit3 size={14} color="var(--text-secondary)" />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleRemoveMember(idx)}
                      title="Hapus dari Tim"
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={14} color="var(--g-red)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setActiveTab('invite')}>
                  <Plus size={16} /> Undang Anggota Baru
                </button>
                <button className="btn btn-secondary" onClick={() => setShowRoleManager(true)}>
                  <ShieldCheck size={15} color="var(--g-blue)" /> Atur Matriks Peran
                </button>
              </div>
              <button className="btn btn-secondary" onClick={onClose}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Invite via Gmail Form & Real Link Generator */}
        {activeTab === 'invite' && (
          <form onSubmit={handleSendGmailInvite}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Alamat Email Gmail Anggota
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="rekan.tim@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Nama Anggota (Opsional)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Misal: Dewi Lestari"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Peran dalam Proyek (Role & Hak Akses)
                </label>
                <span 
                  onClick={() => setShowRoleManager(true)} 
                  style={{ fontSize: '0.75rem', color: 'var(--g-blue)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  + Tambah Peran Kustom
                </span>
              </div>
              <select className="input-field" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {availableRoles.map(r => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.level} - {r.canDelete ? 'Akses Edit & Hapus' : (r.canEdit ? 'Akses Edit' : 'Read-Only')})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Join Link Preview & Copy */}
            <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>LINK AKSES / UNDANGAN LANGSUNG</span>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  style={{ background: 'none', border: 'none', color: 'var(--g-blue)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Copy size={12} /> {copiedLink ? '✓ Tersalin!' : 'Salin Link'}
                </button>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {inviteLink}
              </div>
            </div>

            {inviteSuccessMsg && (
              <div style={{ color: 'var(--g-green)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> {inviteSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>
                Kembali ke Daftar Tim
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} /> Kirim via Gmail Web
              </button>
            </div>
          </form>
        )}

        {/* Role Manager Modal Nested */}
        <RoleManagerModal
          isOpen={showRoleManager}
          onClose={() => setShowRoleManager(false)}
          availableRoles={availableRoles}
          setAvailableRoles={setAvailableRoles}
        />
      </div>
    </div>
  );
}
