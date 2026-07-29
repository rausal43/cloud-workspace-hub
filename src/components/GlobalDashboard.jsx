import React, { useState } from 'react';
import { Calendar as CalendarIcon, HelpCircle, Clock, MapPin, CheckCircle, Globe, Layers, User, Filter, ArrowRight, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';

export default function GlobalDashboard({ projects, events, checkins, onSelectProject, setEvents }) {
  const [selectedFilterProjectId, setSelectedFilterProjectId] = useState('ALL');
  const [hideCompletedGlobal, setHideCompletedGlobal] = useState(false);

  const toggleEventCompleted = (evtId, e) => {
    if (e) e.stopPropagation();
    if (!setEvents) return;

    const updated = events.map(evt => {
      if (evt.id === evtId) {
        return { ...evt, completed: !evt.completed };
      }
      return evt;
    });

    setEvents(updated);
  };

  // Aggregate all events across all projects
  const allEvents = events.filter(evt => {
    const matchesProject = selectedFilterProjectId === 'ALL' || evt.projectId === selectedFilterProjectId;
    const matchesHide = !hideCompletedGlobal || !evt.completed;
    return matchesProject && matchesHide;
  });

  const completedCount = events.filter(e => e.completed).length;

  // Aggregate all checkins across all projects
  const allCheckins = checkins.filter(chk => {
    if (selectedFilterProjectId === 'ALL') return true;
    return chk.projectId === selectedFilterProjectId;
  });

  const getProjectInfo = (projId) => {
    const found = projects.find(p => p.id === projId);
    return found || { name: 'Proyek Utama', color: '#1a73e8' };
  };

  // Count total status responses across checkins
  let totalResponses = 0;
  allCheckins.forEach(chk => {
    totalResponses += (chk.responses || []).length;
  });

  return (
    <div style={{ padding: '16px 0 40px 0' }}>
      {/* Global Master Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '240px',
          height: '100%',
          background: 'linear-gradient(225deg, rgba(26, 115, 232, 0.15) 0%, rgba(52, 168, 83, 0.15) 50%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={12} /> Dashboard Master Lintas Proyek
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {projects.length} Proyek Aktif Terhubung
              </span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.4px', marginBottom: '6px' }}>
              Kalender & Standup Otomatis Terpadu
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
              Pusat pantau gabungan seluruh jadwal agenda, milestone, dan laporan status kerja harian dari seluruh proyek tim Anda.
            </p>
          </div>

          {/* Quick Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Filter size={16} color="var(--g-blue)" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>FILTER PROYEK:</div>
              <select
                className="input-field"
                value={selectedFilterProjectId}
                onChange={(e) => setSelectedFilterProjectId(e.target.value)}
                style={{ padding: '2px 8px', height: '28px', fontSize: '0.825rem', border: 'none', background: 'transparent', fontWeight: 700 }}
              >
                <option value="ALL">🌐 Semua Proyek ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--g-blue-light)', color: 'var(--g-blue)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{projects.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Proyek Aktif</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--g-green-light)', color: 'var(--g-green)' }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{allEvents.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Agenda & Milestone</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--g-red-light)', color: 'var(--g-red)' }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalResponses}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Laporan Status Standup</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: UNIFIED GLOBAL CALENDAR */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon color="var(--g-blue)" size={22} /> Kalender & Milestone Lintas Proyek
          </h2>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Hide / Show Completed Button */}
            <button
              className="btn btn-secondary"
              onClick={() => setHideCompletedGlobal(!hideCompletedGlobal)}
              style={{
                fontSize: '0.8rem',
                color: hideCompletedGlobal ? 'var(--g-blue)' : 'var(--text-primary)',
                borderColor: hideCompletedGlobal ? 'var(--g-blue)' : 'var(--border-color)'
              }}
            >
              {hideCompletedGlobal ? <EyeOff size={15} color="var(--g-blue)" /> : <Eye size={15} />}
              {hideCompletedGlobal ? 'Agenda Selesai Disembunyikan' : `Sembunyikan Selesai (${completedCount})`}
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {allEvents.length} Agenda Tampil
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {allEvents.map(evt => {
            const proj = getProjectInfo(evt.projectId);
            const cardColor = evt.color || proj.color || '#1a73e8';
            const isDone = !!evt.completed;

            return (
              <div
                key={evt.id}
                className="glass-card"
                style={{
                  padding: '18px',
                  borderLeft: `5px solid ${isDone ? 'var(--g-green)' : cardColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  opacity: isDone ? 0.75 : 1,
                  background: isDone ? 'var(--bg-surface-hover)' : 'var(--bg-glass)'
                }}
              >
                <div>
                  {/* Project Tag Badge & Completion Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn-icon"
                        onClick={(e) => toggleEventCompleted(evt.id, e)}
                        title={isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                        style={{ padding: '2px' }}
                      >
                        {isDone ? <CheckSquare size={18} color="var(--g-green)" /> : <Square size={18} color="var(--text-muted)" />}
                      </button>

                      <button
                        className="btn"
                        onClick={() => onSelectProject(proj.id)}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          borderRadius: '12px',
                          background: `${proj.color || '#1a73e8'}18`,
                          color: proj.color || '#1a73e8',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        title="Buka Proyek Ini"
                      >
                        📁 {proj.name}
                      </button>
                    </div>

                    <span className="badge" style={{ background: isDone ? 'var(--g-green-light)' : `${cardColor}18`, color: isDone ? 'var(--g-green)' : cardColor, fontSize: '0.7rem' }}>
                      {isDone ? '✓ Selesai' : evt.date}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
                  }}>
                    {evt.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} color={isDone ? 'var(--text-muted)' : cardColor} /> {evt.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--text-muted)" /> {evt.location}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  {evt.syncGoogleCalendar ? (
                    <span style={{ fontSize: '0.72rem', color: 'var(--g-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle size={11} /> Google Calendar
                    </span>
                  ) : <div />}

                  <button
                    className="btn btn-secondary"
                    onClick={() => onSelectProject(proj.id)}
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    Buka Proyek <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: UNIFIED GLOBAL STANDUPS FEED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle color="var(--g-red)" size={22} /> Standup Otomatis & Status Report Lintas Proyek
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {totalResponses} Laporan Diterima
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allCheckins.map(chk => {
            const proj = getProjectInfo(chk.projectId);

            return (
              <div key={chk.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    {/* Project Tag Badge */}
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: `${proj.color || '#1a73e8'}18`,
                      color: proj.color || '#1a73e8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '4px'
                    }}>
                      📁 Proyek: {proj.name}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{chk.question}</h3>
                  </div>

                  <span className="badge badge-yellow" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <Clock size={11} /> {chk.schedule}
                  </span>
                </div>

                {/* Responses List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(chk.responses || []).map((resp, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        background: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <img src={resp.avatar} alt={resp.author} className="avatar" style={{ width: '32px', height: '32px' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{resp.author}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{resp.time}</span>
                        </div>
                        <p style={{ fontSize: '0.88rem' }}>{resp.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
