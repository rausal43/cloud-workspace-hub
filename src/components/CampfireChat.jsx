import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Paperclip, Smile, Hash, Users, Sparkles, Plus, Edit3, Trash2 } from 'lucide-react';

export default function CampfireChat({ chatMessages, setChatMessages, activeProject }) {
  const [channels, setChannels] = useState([
    { id: 'general', name: 'general', desc: 'Obrolan umum & koordinasi tim' },
    { id: 'dev-talk', name: 'dev-talk', desc: 'Diskusi Google Cloud, Firestore API & Code' },
    { id: 'design', name: 'design-system', desc: 'Wireframe, UI/UX & Feedback visual' }
  ]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [textInput, setTextInput] = useState('');
  const chatBottomRef = useRef(null);

  // Channel CRUD State
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [channelNameInput, setChannelNameInput] = useState('');
  const [channelDescInput, setChannelDescInput] = useState('');

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const newMsg = {
      id: `chat-${Date.now()}`,
      projectId: activeProject.id,
      sender: 'Budi Santoso',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textInput
    };

    setChatMessages([...chatMessages, newMsg]);
    setTextInput('');
  };

  const handleAddChannel = (e) => {
    e.preventDefault();
    if (!channelNameInput.trim()) return;

    const formattedName = channelNameInput.trim().toLowerCase().replace(/\s+/g, '-');
    const newChan = {
      id: `chan-${Date.now()}`,
      name: formattedName,
      desc: channelDescInput || 'Saluran baru'
    };

    setChannels([...channels, newChan]);
    setActiveChannel(newChan.name);
    setChannelNameInput('');
    setChannelDescInput('');
    setShowAddChannelModal(false);
  };

  const handleOpenEditChannel = (ch, e) => {
    if (e) e.stopPropagation();
    setEditingChannel(ch);
    setChannelNameInput(ch.name);
    setChannelDescInput(ch.desc);
  };

  const handleSaveEditChannel = (e) => {
    e.preventDefault();
    if (!channelNameInput.trim() || !editingChannel) return;

    const formattedName = channelNameInput.trim().toLowerCase().replace(/\s+/g, '-');

    setChannels(channels.map(c => {
      if (c.id === editingChannel.id) {
        return {
          ...c,
          name: formattedName,
          desc: channelDescInput
        };
      }
      return c;
    }));

    if (activeChannel === editingChannel.name) {
      setActiveChannel(formattedName);
    }

    setEditingChannel(null);
    setChannelNameInput('');
    setChannelDescInput('');
  };

  const handleDeleteChannel = (chId, chName, e) => {
    if (e) e.stopPropagation();
    if (channels.length <= 1) {
      alert('Minimal harus ada 1 saluran chat.');
      return;
    }

    const remaining = channels.filter(c => c.id !== chId);
    setChannels(remaining);
    if (activeChannel === chName) {
      setActiveChannel(remaining[0].name);
    }
  };

  const currentChannelObj = channels.find(c => c.name === activeChannel) || channels[0];

  return (
    <div style={{ padding: '8px 0', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle color="var(--g-yellow)" size={24} /> Obrolan Tim (Realtime Chat)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Komunikasi tim langsung berbasis Firestore Realtime Listener.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--g-green)', fontWeight: 600 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--g-green)', display: 'inline-block' }} />
          3 Anggota Online
        </div>
      </div>

      {/* Main Chat Layout: Channels Sidebar + Chat Window */}
      <div className="chat-layout-mobile" style={{ display: 'flex', gap: '16px', flex: 1, overflow: 'hidden' }}>
        {/* Channel Sidebar */}
        <div className="glass-card chat-channels-mobile" style={{ width: '240px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              SALURAN CHAT ({channels.length})
            </div>
            <button
              className="btn-icon"
              onClick={() => {
                setChannelNameInput('');
                setChannelDescInput('');
                setShowAddChannelModal(true);
              }}
              title="Tambah Saluran Baru"
              style={{ padding: '2px' }}
            >
              <Plus size={16} color="var(--g-blue)" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {channels.map(ch => {
              const isActive = activeChannel === ch.name;
              return (
                <div
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: isActive ? 'var(--g-blue-light)' : 'transparent',
                    color: isActive ? 'var(--g-blue)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    <Hash size={15} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{ch.name}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button
                      className="btn-icon"
                      onClick={(e) => handleOpenEditChannel(ch, e)}
                      title="Edit Saluran"
                      style={{ padding: '2px' }}
                    >
                      <Edit3 size={13} color="var(--text-secondary)" />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={(e) => handleDeleteChannel(ch.id, ch.name, e)}
                      title="Hapus Saluran"
                      style={{ padding: '2px' }}
                    >
                      <Trash2 size={13} color="var(--g-red)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px' }}>
          {/* Active Channel Header */}
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{currentChannelObj?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {currentChannelObj?.desc}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={(e) => handleOpenEditChannel(currentChannelObj, e)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <Edit3 size={13} /> Edit Saluran
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img src={msg.avatar} alt={msg.sender} className="avatar" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{msg.sender}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    background: 'var(--bg-main)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'inline-block',
                    maxWidth: '85%'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              placeholder={`Kirim pesan ke #${activeChannel}...`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
              <Send size={16} /> Kirim
            </button>
          </form>
        </div>
      </div>

      {/* Add Channel Modal */}
      {showAddChannelModal && (
        <div className="modal-overlay" onClick={() => setShowAddChannelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Saluran Chat Baru</h3>
            <form onSubmit={handleAddChannel}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Saluran</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>#</span>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="misal: frontend-dev"
                    value={channelNameInput}
                    onChange={(e) => setChannelNameInput(e.target.value)}
                    style={{ paddingLeft: '28px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Saluran</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Diskusi khusus pengembangan frontend UI"
                  value={channelDescInput}
                  onChange={(e) => setChannelDescInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddChannelModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Buat Saluran</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Channel Modal */}
      {editingChannel && (
        <div className="modal-overlay" onClick={() => setEditingChannel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Saluran Chat</h3>
            <form onSubmit={handleSaveEditChannel}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Saluran</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>#</span>
                  <input
                    type="text"
                    className="input-field"
                    value={channelNameInput}
                    onChange={(e) => setChannelNameInput(e.target.value)}
                    style={{ paddingLeft: '28px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Saluran</label>
                <input
                  type="text"
                  className="input-field"
                  value={channelDescInput}
                  onChange={(e) => setChannelDescInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingChannel(null)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
