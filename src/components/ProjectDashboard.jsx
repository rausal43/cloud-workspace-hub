import React from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  HardDrive, 
  HelpCircle, 
  Users, 
  Plus, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { isMatchProject } from '../hooks/useWorkspaceData';

export default function ProjectDashboard({ 
  activeProject, 
  projects = [],
  onSelectTab,
  messages,
  todos,
  chatMessages,
  events,
  files,
  checkins,
  onOpenTeamModal,
  activities = []
}) {
  if (!activeProject) return null;

  // Filter core module items strictly for active project using isMatchProject helper
  const projectMessages = (messages || []).filter(m => isMatchProject(m.projectId, activeProject, projects));
  const projectTodos = (todos || []).filter(t => isMatchProject(t.projectId, activeProject, projects));
  const projectChatMessages = (chatMessages || []).filter(c => isMatchProject(c.projectId, activeProject, projects));
  const projectEvents = (events || []).filter(e => isMatchProject(e.projectId, activeProject, projects));
  const projectFiles = (files || []).filter(f => isMatchProject(f.projectId, activeProject, projects));
  const projectCheckins = (checkins || []).filter(c => isMatchProject(c.projectId, activeProject, projects));

  // Calculate To-Do statistics for this project only
  let totalTasks = 0;
  let completedTasks = 0;
  projectTodos.forEach(cat => {
    (cat.items || []).forEach(item => {
      totalTasks++;
      if (item.completed) completedTasks++;
    });
  });
  const todoPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const members = activeProject.members || [];

  return (
    <div style={{ padding: '16px 0 40px 0' }}>
      {/* Project Overview Header Card */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '180px',
          height: '100%',
          background: `linear-gradient(225deg, ${activeProject.color}22 0%, transparent 80%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{activeProject.category}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Diperbarui {activeProject.updatedAt}</span>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.4px', marginBottom: '6px' }}>
              {activeProject.name}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
              {activeProject.description}
            </p>
          </div>

          {/* Members Stack & Invite Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {members.map((m, idx) => (
                <img
                  key={idx}
                  src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=0D8ABC&color=fff&bold=true`}
                  alt={m.name}
                  className="avatar"
                  title={`${m.name} (${m.role})`}
                  style={{ marginLeft: idx > 0 ? '-8px' : 0, zIndex: members.length - idx }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=0D8ABC&color=fff&bold=true`;
                  }}
                />
              ))}
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={onOpenTeamModal}
              style={{ padding: '5px 10px', fontSize: '0.78rem' }}
            >
              <Users size={14} /> + Kelola Tim & Undang Gmail
            </button>
          </div>
        </div>
      </div>

      {/* 6 Core Module Tiles Grid */}
      <div 
        className="grid-mobile-1col"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* 1. Discussions & Announcements Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('messages')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-blue)' }}>
                <MessageSquare size={20} />
              </div>
              <span className="badge badge-blue">{projectMessages.length} Postingan</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Diskusi & Pengumuman</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {projectMessages[0] ? `Terakhir: "${projectMessages[0].title}"` : 'Posting pengumuman & diskusi tim'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--g-blue)', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Lihat Diskusi <ArrowRight size={14} />
          </div>
        </div>

        {/* 2. Task Manager Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('todos')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-green)' }}>
                <CheckSquare size={20} />
              </div>
              <span className="badge badge-green">{completedTasks}/{totalTasks} Selesai</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Manajemen Tugas (Kanban)</h3>
            <div style={{ height: '6px', background: 'var(--bg-surface-hover)', borderRadius: '3px', margin: '8px 0 6px 0', overflow: 'hidden' }}>
              <div style={{ width: `${todoPercent}%`, height: '100%', background: 'var(--g-green)', transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Progres penyelesaian: {todoPercent}%</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--g-green)', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Kelola Tugas <ArrowRight size={14} />
          </div>
        </div>

        {/* 3. Team Live Chat Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('chat')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-yellow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b08400' }}>
                <MessageCircle size={20} />
              </div>
              <span className="badge badge-yellow">{projectChatMessages.length} Pesan</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Obrolan Tim (Realtime Chat)</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {projectChatMessages[projectChatMessages.length - 1] 
                ? `${projectChatMessages[projectChatMessages.length - 1].sender}: "${projectChatMessages[projectChatMessages.length - 1].text}"`
                : 'Saluran obrolan langsung tim via Firestore'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b08400', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Buka Chat <ArrowRight size={14} />
          </div>
        </div>

        {/* 4. Calendar & Milestones Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('schedule')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-blue)' }}>
                <CalendarIcon size={20} />
              </div>
              <span className="badge badge-blue">{projectEvents.length} Agenda</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Kalender & Milestone</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {projectEvents[0] ? `Mendatang: ${projectEvents[0].title} (${projectEvents[0].date})` : 'Sinkronisasi agenda dengan Google Calendar'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--g-blue)', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Lihat Kalender <ArrowRight size={14} />
          </div>
        </div>

        {/* 5. Google Drive & Files Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('files')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-yellow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b08400' }}>
                <HardDrive size={20} />
              </div>
              <span className="badge badge-yellow">{projectFiles.length} Berkas</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Google Drive & Berkas</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Dokumen, spreadsheet, dan file tersimpan di Google Drive.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b08400', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Kelola File <ArrowRight size={14} />
          </div>
        </div>

        {/* 6. Automated Standups Tile */}
        <div
          className="glass-card"
          onClick={() => onSelectTab('standups')}
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--g-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-red)' }}>
                <HelpCircle size={20} />
              </div>
              <span className="badge badge-red">{projectCheckins.length} Pertanyaan</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Standup Otomatis (Status Report)</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {projectCheckins[0] ? `Aktif: "${projectCheckins[0].question}"` : 'Pengumpulan status harian otomatis'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--g-red)', fontSize: '0.825rem', fontWeight: 700, marginTop: '12px' }}>
            Lihat Standups <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Dynamic Real Activity Feed */}
      {(() => {
        const projectActivities = activities.filter(act => 
          act.projectId === activeProject?.id
        );
        return (
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity color="var(--g-blue)" size={18} /> Aktivitas Terbaru Proyek
            </h3>

            {projectActivities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                {projectActivities.map(act => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--g-blue)', flexShrink: 0 }} />
                    <span><strong>{act.user}</strong> {act.action}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Belum ada aktivitas terbaru dalam proyek ini.
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
