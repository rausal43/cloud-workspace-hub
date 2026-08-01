import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  ChevronDown, 
  Moon, 
  Sun, 
  LogOut, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Users
} from 'lucide-react';

export default function Navbar({ 
  projects, 
  activeProject, 
  setActiveProject, 
  isDarkMode, 
  setIsDarkMode, 
  onNewProject,
  onEditProject,
  onDeleteProject,
  onOpenLoginModal,
  onOpenTeamModal,
  currentUser
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('hub_currentUser');
    window.location.reload();
  };

  return (
    <header style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left Section: Brand & Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #1a73e8, #34a853)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)'
            }}>
              <FolderGit2 size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
                Google Cloud Hub
              </h1>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '-2px' }}>
                Integrated Workspace & Realtime Platform
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Project Dropdown Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: activeProject?.color || 'var(--g-blue)'
              }} />
              <span>{activeProject?.name || 'Pilih Proyek'}</span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className="dropdown-menu-mobile glass-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  width: '260px',
                  zIndex: 200,
                  padding: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 8px' }}>
                  DAFTAR PROYEK AKTIF
                </div>
                {projects.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProject(proj);
                      setShowDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: activeProject?.id === proj.id ? 'var(--g-blue-light)' : 'transparent',
                      color: activeProject?.id === proj.id ? 'var(--g-blue)' : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: activeProject?.id === proj.id ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: proj.color || 'var(--g-blue)'
                    }} />
                    <div>
                      <div>{proj.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>{proj.category}</div>
                    </div>
                  </button>
                ))}

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onNewProject();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    color: 'var(--g-blue)',
                    border: '1px dashed var(--g-blue)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Buat Proyek Baru
                </button>
              </div>
            )}
          </div>

          {/* Quick Active Project Actions */}
          {activeProject && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                className="btn-icon"
                onClick={onEditProject}
                title="Edit Nama/Deskripsi Proyek"
                style={{ padding: '5px' }}
              >
                <Edit3 size={15} color="var(--text-secondary)" />
              </button>
              <button
                className="btn-icon"
                onClick={onDeleteProject}
                title="Hapus Proyek"
                style={{ padding: '5px' }}
              >
                <Trash2 size={15} color="var(--g-red)" />
              </button>
              <button
                className="btn-icon"
                onClick={onOpenTeamModal}
                title="Kelola Tim & Undang Gmail"
                style={{ padding: '5px' }}
              >
                <Users size={15} color="var(--g-blue)" />
              </button>
            </div>
          )}
        </div>

        {/* Right Actions: Theme Toggle & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle */}
          <button
            className="btn-icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? <Sun size={18} color="var(--g-yellow)" /> : <Moon size={18} />}
          </button>

          {/* User Profile / Login */}
          <div style={{ position: 'relative' }}>
            {currentUser ? (
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '20px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0D8ABC&color=fff&bold=true`}
                  alt={currentUser.name}
                  className="avatar"
                  style={{ width: '28px', height: '28px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0D8ABC&color=fff&bold=true`;
                  }}
                />
                <span className="badge-text-mobile-hide" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {currentUser.name}
                </span>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={onOpenLoginModal}
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              >
                <UserCheck size={14} /> Masuk Akun
              </button>
            )}

            {/* User Account Menu */}
            {showUserMenu && currentUser && (
              <div
                className="dropdown-menu-mobile glass-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '220px',
                  zIndex: 200,
                  padding: '12px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img 
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0D8ABC&color=fff&bold=true`} 
                    alt={currentUser.name} 
                    className="avatar" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0D8ABC&color=fff&bold=true`;
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

                <button
                  onClick={onOpenTeamModal}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Users size={14} color="var(--g-blue)" /> Kelola Anggota Tim
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: 'var(--g-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px'
                  }}
                >
                  <LogOut size={14} /> Sign Out / Ganti Akun
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
