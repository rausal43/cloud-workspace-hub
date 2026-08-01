import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, CheckCircle, Edit3, Trash2, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScheduleCalendar({ events, setEvents, activeProject, notify }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 WIB');
  const [location, setLocation] = useState('Google Meet');
  const [color, setColor] = useState('#1a73e8');
  const [syncGoogleCalendar, setSyncGoogleCalendar] = useState(true);

  const presetColors = [
    { name: 'Google Blue', hex: '#1a73e8' },
    { name: 'Google Green', hex: '#34a853' },
    { name: 'Google Yellow', hex: '#fbbc04' },
    { name: 'Google Red', hex: '#ea4335' },
    { name: 'Purple', hex: '#a142f4' },
    { name: 'Cyan', hex: '#00bcd4' }
  ];

  const toggleEventCompleted = (evtId, e) => {
    if (e) e.stopPropagation();

    const updated = events.map(evt => {
      if (evt.id === evtId) {
        const nextState = !evt.completed;
        if (nextState) {
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
          } catch (err) {}
          notify?.(`Acara "${evt.title}" ditandai selesai 🎉`, 'success');
        } else {
          notify?.(`Status acara "${evt.title}" diperbarui`, 'info');
        }
        return { ...evt, completed: nextState };
      }
      return evt;
    });

    setEvents(updated);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      projectId: activeProject.id,
      title,
      date,
      time,
      location,
      color: color || '#1a73e8',
      syncGoogleCalendar,
      completed: false
    };

    setEvents([...events, newEvent]);
    setTitle('');
    setDate('');
    setColor('#1a73e8');
    setShowAddModal(false);
    notify?.(`Acara "${newEvent.title}" ditambahkan ke kalender!`, 'success');
  };

  const handleOpenEditEvent = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time || '');
    setLocation(evt.location || '');
    setColor(evt.color || '#1a73e8');
    setSyncGoogleCalendar(!!evt.syncGoogleCalendar);
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !editingEvent) return;

    setEvents(events.map(evt => {
      if (evt.id === editingEvent.id) {
        return {
          ...evt,
          title,
          date,
          time,
          location,
          color,
          syncGoogleCalendar
        };
      }
      return evt;
    }));

    setEditingEvent(null);
    setTitle('');
    setDate('');
    notify?.(`Acara "${title}" berhasil diperbarui`, 'info');
  };

  const handleDeleteEvent = (evtId) => {
    setEvents(events.filter(e => e.id !== evtId));
    notify?.('Acara berhasil dihapus dari kalender', 'delete');
  };

  // Filter events based on hideCompleted
  const filteredEvents = events.filter(evt => {
    if (hideCompleted && evt.completed) return false;
    return true;
  });

  const completedCount = events.filter(e => e.completed).length;

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon color="var(--g-blue)" size={24} /> Kalender & Milestone
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Jadwal milestone, meeting, dan tanggal penting proyek yang tersinkronisasi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Hide/Show Completed Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setHideCompleted(!hideCompleted)}
            style={{
              fontSize: '0.825rem',
              color: hideCompleted ? 'var(--g-blue)' : 'var(--text-primary)',
              borderColor: hideCompleted ? 'var(--g-blue)' : 'var(--border-color)'
            }}
            title="Sembunyikan atau tampilkan agenda yang sudah dicentang selesai"
          >
            {hideCompleted ? <EyeOff size={16} color="var(--g-blue)" /> : <Eye size={16} />}
            {hideCompleted ? 'Agenda Selesai Disembunyikan' : `Sembunyikan Selesai (${completedCount})`}
          </button>

          <button className="btn btn-primary" onClick={() => {
            setTitle('');
            setDate('');
            setTime('10:00 WIB');
            setLocation('Google Meet');
            setColor('#1a73e8');
            setShowAddModal(true);
          }}>
            <Plus size={18} /> Tambah Agenda Proyek
          </button>
        </div>
      </div>

      {/* Events List Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredEvents.map(evt => {
          const cardColor = evt.color || '#1a73e8';
          const isDone = !!evt.completed;

          return (
            <div 
              key={evt.id} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                borderLeft: `5px solid ${isDone ? 'var(--g-green)' : cardColor}`, 
                position: 'relative',
                opacity: isDone ? 0.75 : 1,
                background: isDone ? 'var(--bg-surface-hover)' : 'var(--bg-glass)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Interactive Checklist Checkbox */}
                  <button
                    className="btn-icon"
                    onClick={(e) => toggleEventCompleted(evt.id, e)}
                    title={isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                    style={{ padding: '2px' }}
                  >
                    {isDone ? <CheckSquare size={20} color="var(--g-green)" /> : <Square size={20} color="var(--text-muted)" />}
                  </button>

                  <span className="badge" style={{ background: isDone ? 'var(--g-green-light)' : `${cardColor}18`, color: isDone ? 'var(--g-green)' : cardColor }}>
                    {isDone ? '✓ Selesai' : evt.date}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {evt.syncGoogleCalendar && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--g-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
                      <CheckCircle size={12} /> Google Calendar
                    </span>
                  )}
                  <button className="btn-icon" onClick={() => handleOpenEditEvent(evt)} title="Edit Agenda & Warna Line" style={{ padding: '3px' }}>
                    <Edit3 size={14} color="var(--text-secondary)" />
                  </button>
                  <button className="btn-icon" onClick={() => handleDeleteEvent(evt.id)} title="Hapus Agenda" style={{ padding: '3px' }}>
                    <Trash2 size={14} color="var(--g-red)" />
                  </button>
                </div>
              </div>

              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                marginBottom: '10px',
                textDecoration: isDone ? 'line-through' : 'none',
                color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
              }}>
                {evt.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color={isDone ? 'var(--text-muted)' : cardColor} /> {evt.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--text-muted)" /> {evt.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Agenda Proyek Baru</h3>
            <form onSubmit={handleAddEvent}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Agenda / Milestone</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Review Sprint & Demo Firestore"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tanggal</label>
                  <input
                    type="date"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Waktu</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="10:00 - 11:30 WIB"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lokasi / Link Meeting</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Google Meet (meet.google.com/xyz)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Color Line Picker Palette */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Warna Line Card Agenda
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {presetColors.map(c => (
                    <div
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      title={c.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c.hex,
                        cursor: 'pointer',
                        border: color === c.hex ? '3px solid var(--text-primary)' : '2px solid transparent',
                        transform: color === c.hex ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s'
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    title="Pilih Warna Kustom"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="syncGcal"
                  checked={syncGoogleCalendar}
                  onChange={(e) => setSyncGoogleCalendar(e.target.checked)}
                />
                <label htmlFor="syncGcal" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Sinkronkan otomatis ke Google Calendar API
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Agenda & Warna Line</h3>
            <form onSubmit={handleSaveEditEvent}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Agenda / Milestone</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tanggal</label>
                  <input
                    type="date"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Waktu</label>
                  <input
                    type="text"
                    className="input-field"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lokasi / Link Meeting</label>
                <input
                  type="text"
                  className="input-field"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Color Line Picker Palette */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Warna Line Card Agenda
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {presetColors.map(c => (
                    <div
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      title={c.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c.hex,
                        cursor: 'pointer',
                        border: color === c.hex ? '3px solid var(--text-primary)' : '2px solid transparent',
                        transform: color === c.hex ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s'
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    title="Pilih Warna Kustom"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="syncGcalEdit"
                  checked={syncGoogleCalendar}
                  onChange={(e) => setSyncGoogleCalendar(e.target.checked)}
                />
                <label htmlFor="syncGcalEdit" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Sinkronkan otomatis ke Google Calendar API
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingEvent(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
