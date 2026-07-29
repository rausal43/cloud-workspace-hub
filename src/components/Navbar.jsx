import React, { useState } from 'react';
import { 
  FolderKanban, 
  Database, 
  Sun, 
  Moon, 
  Settings, 
  Grid, 
  Plus, 
  ChevronDown,
  Layers,
  Edit3,
  Trash2,
  User,
  LogIn,
  LogOut,
  Users
} from 'lucide-react';

export default function Navbar({ 
  projects, 
  activeProject, 
  setActiveProject, 
  isDarkMode, 
  setIsDarkMode, 
  onOpenSettings,
  onNewProject,
  onEditProject,
  onDeleteProject,
  onOpenLoginModal,
  onOpenTeamModal,
  currentUser,
  isLiveFirebase
}) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="app-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left: Brand Logo & Project Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Google Project Hub Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 50%, #fbbc04 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)'
          }}>
            <Layers size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="brand-title" style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                Google Cloud Hub
              </span>
            </div>
            <span className="brand-subtext" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Integrated Firebase & Drive Platform
            </span>
          </div>
        </div>

        <div className="divider-hide-mobile" style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

        {/* Project Selector Dropdown & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary project-selector-btn"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              style={{ borderRadius: 'var(--radius-md)', padding: '5px 10px', gap: '6px' }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: activeProject?.color || 'var(--g-blue)'
              }} />
              <span style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeProject ? activeProject.name : 'Pilih Proyek'}
              </span>
              <ChevronDown size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            </button>

            {showProjectDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '260px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  DAFTAR PROYEK AKTIF
                </div>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setActiveProject(proj);
                      setShowProjectDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: activeProject?.id === proj.id ? 'var(--bg-surface-hover)' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: proj.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{proj.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{proj.category}</div>
                    </div>
                  </div>
                ))}

                <hr style={{ margin: '8px 0', borderColor: 'var(--border-subtle)' }} />

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowProjectDropdown(false);
                    onNewProject();
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Buat Proyek Baru
                </button>
              </div>
            )}
          </div>

          {/* Quick Edit & Delete Project Actions */}
          {activeProject && (
            <div style={{ display: 'flex', gap: '2px' }}>
              <button
                className="btn-icon"
                onClick={onEditProject}
                title="Edit Proyek Ini"
                style={{ padding: '5px' }}
              >
                <Edit3 size={15} color="var(--text-secondary)" />
              </button>
              <button
                className="btn-icon"
                onClick={onDeleteProject}
                title="Hapus Proyek Ini"
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
      </div>

      {/* Right Actions: Firebase status, Theme Toggle, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Firebase Status Badge */}
        <button
          onClick={onOpenSettings}
          className="btn"
          style={{
            background: 'var(--g-green-light)',
            color: 'var(--g-green)',
            border: '1px solid rgba(52,168,83,0.3)',
            padding: '4px 10px',
            fontSize: '0.78rem',
            borderRadius: '20px'
          }}
          title="Konfigurasi Google Firebase & Drive API"
        >
          <Database size={13} />
          <span className="badge-text-mobile-hide">{isLiveFirebase ? 'Firebase Live' : 'Cloud Database Active'}</span>
          <Settings size={13} style={{ marginLeft: '2px', opacity: 0.7 }} />
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Ganti Tema (Dark / Light)"
          style={{ padding: '6px' }}
        >
          {isDarkMode ? <Sun size={18} color="#fbbc04" /> : <Moon size={18} />}
        </button>

        {/* User Profile Dropdown / Login Button */}
        <div style={{ position: 'relative' }}>
          {currentUser ? (
            <div 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 4px', borderRadius: '20px' }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="avatar"
                style={{ width: '32px', height: '32px', border: '2px solid var(--g-blue)' }}
              />
              <ChevronDown size={14} color="var(--text-secondary)" />
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onOpenLoginModal}
              style={{ padding: '4px 12px', fontSize: '0.85rem' }}
            >
              <LogIn size={14} /> Login Google
            </button>
          )}

          {showUserDropdown && currentUser && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="avatar" />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
                  <span className="badge badge-blue" style={{ marginTop: '2px', fontSize: '0.65rem' }}>{currentUser.role}</span>
                </div>
              </div>

              <hr style={{ margin: '8px 0', borderColor: 'var(--border-subtle)' }} />

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenTeamModal();
                }}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', marginBottom: '6px' }}
              >
                <Users size={14} /> Undang Tim Gmail
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenLoginModal();
                }}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', color: 'var(--g-red)' }}
              >
                <LogOut size={14} /> Sign Out / Ganti Akun
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
