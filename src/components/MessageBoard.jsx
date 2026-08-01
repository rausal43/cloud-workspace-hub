import React, { useState } from 'react';
import { MessageSquare, Pin, Plus, Search, MessageCircle, User, Calendar, Tag, Edit3, Trash2, Settings, Check } from 'lucide-react';
import { useLocalStorageState } from '../hooks/useLocalStorage';

export default function MessageBoard({ messages, setMessages, activeProject, notify }) {
  const [categories, setCategories] = useLocalStorageState('gcloud_message_categories', ['Pengumuman', 'Desain', 'Teknis', 'Pitch']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMessageDetail, setActiveMessageDetail] = useState(null);
  
  // Category Management Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [editCatNameText, setEditCatNameText] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pengumuman');
  const [content, setContent] = useState('');

  // Comment State
  const [commentText, setCommentText] = useState('');

  const filteredMessages = messages.filter(msg => {
    const matchesCat = selectedCategory === 'Semua' || msg.category === selectedCategory;
    const matchesSearch = msg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      projectId: activeProject.id,
      title,
      author: 'Budi Santoso',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      category: category || categories[0] || 'Pengumuman',
      date: 'Baru saja',
      content,
      commentsCount: 0,
      comments: [],
      pinned: false
    };

    setMessages([newMsg, ...messages]);
    setTitle('');
    setContent('');
    setShowCreateModal(false);
    notify?.(`Diskusi "${newMsg.title}" berhasil diterbitkan!`, 'success');
  };

  const handleOpenEditModal = (msg, e) => {
    if (e) e.stopPropagation();
    setEditingMessage(msg);
    setTitle(msg.title);
    setCategory(msg.category);
    setContent(msg.content);
  };

  const handleSaveEditPost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !editingMessage) return;

    setMessages(messages.map(m => {
      if (m.id === editingMessage.id) {
        return {
          ...m,
          title,
          category,
          content,
          date: 'Diperbarui baru saja'
        };
      }
      return m;
    }));

    if (activeMessageDetail && activeMessageDetail.id === editingMessage.id) {
      setActiveMessageDetail({
        ...activeMessageDetail,
        title,
        category,
        content
      });
    }

    setEditingMessage(null);
    setTitle('');
    setContent('');
    notify?.(`Diskusi "${title}" berhasil diperbarui`, 'info');
  };

  const handleDeletePost = (msgId, e) => {
    if (e) e.stopPropagation();
    setMessages(messages.filter(m => m.id !== msgId));
    if (activeMessageDetail && activeMessageDetail.id === msgId) {
      setActiveMessageDetail(null);
    }
    notify?.('Diskusi berhasil dihapus', 'delete');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (!categories.includes(newCatName.trim())) {
      setCategories([...categories, newCatName.trim()]);
      notify?.(`Kategori "${newCatName.trim()}" ditambahkan`, 'success');
    }
    setNewCatName('');
  };

  const handleSaveEditCategory = (index) => {
    if (!editCatNameText.trim()) return;
    const oldCat = categories[index];
    const updated = [...categories];
    updated[index] = editCatNameText.trim();
    setCategories(updated);

    // Update messages under old category
    setMessages(messages.map(m => m.category === oldCat ? { ...m, category: editCatNameText.trim() } : m));
    if (selectedCategory === oldCat) setSelectedCategory(editCatNameText.trim());

    setEditingCatIndex(null);
    setEditCatNameText('');
  };

  const handleDeleteCategory = (catToDelete) => {
    const updated = categories.filter(c => c !== catToDelete);
    setCategories(updated);
    if (selectedCategory === catToDelete) setSelectedCategory('Semua');
  };

  const handleAddComment = (msgId) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Budi Santoso',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Baru saja',
      text: commentText
    };

    setMessages(messages.map(m => {
      if (m.id === msgId) {
        const comments = m.comments || [];
        return {
          ...m,
          commentsCount: m.commentsCount + 1,
          comments: [...comments, newComment]
        };
      }
      return m;
    }));

    if (activeMessageDetail && activeMessageDetail.id === msgId) {
      setActiveMessageDetail({
        ...activeMessageDetail,
        commentsCount: activeMessageDetail.commentsCount + 1,
        comments: [...(activeMessageDetail.comments || []), newComment]
      });
    }

    setCommentText('');
  };

  const handleDeleteComment = (msgId, commentId) => {
    setMessages(messages.map(m => {
      if (m.id === msgId) {
        const updatedComments = (m.comments || []).filter(c => c.id !== commentId);
        return {
          ...m,
          commentsCount: Math.max(0, m.commentsCount - 1),
          comments: updatedComments
        };
      }
      return m;
    }));

    if (activeMessageDetail && activeMessageDetail.id === msgId) {
      setActiveMessageDetail({
        ...activeMessageDetail,
        commentsCount: Math.max(0, activeMessageDetail.commentsCount - 1),
        comments: (activeMessageDetail.comments || []).filter(c => c.id !== commentId)
      });
    }
  };

  const togglePin = (msgId, e) => {
    if (e) e.stopPropagation();
    setMessages(messages.map(m => m.id === msgId ? { ...m, pinned: !m.pinned } : m));
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare color="var(--g-blue)" size={24} /> Diskusi & Pengumuman
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Pengumuman resmi, ide inovasi, dan utas diskusi terarah untuk tim.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowCategoryModal(true)} style={{ fontSize: '0.85rem' }}>
            <Settings size={15} /> Kelola Kategori
          </button>
          <button className="btn btn-primary" onClick={() => {
            setTitle('');
            setContent('');
            setCategory(categories[0] || 'Pengumuman');
            setShowCreateModal(true);
          }}>
            <Plus size={18} /> Posting Diskusi Baru
          </button>
        </div>
      </div>

      {/* Filter Categories & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn"
            onClick={() => setSelectedCategory('Semua')}
            style={{
              fontSize: '0.8rem',
              padding: '6px 14px',
              borderRadius: '20px',
              background: selectedCategory === 'Semua' ? 'var(--g-blue)' : 'var(--bg-surface)',
              color: selectedCategory === 'Semua' ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            Semua
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              className="btn"
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '0.8rem',
                padding: '6px 14px',
                borderRadius: '20px',
                background: selectedCategory === cat ? 'var(--g-blue)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Cari postingan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem', height: '36px' }}
          />
        </div>
      </div>

      {/* Message Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{msg.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    className="btn-icon"
                    onClick={(e) => togglePin(msg.id, e)}
                    title={msg.pinned ? 'Lepas Pin' : 'Sematkan Postingan'}
                  >
                    <Pin size={15} color={msg.pinned ? 'var(--g-blue)' : 'var(--text-muted)'} fill={msg.pinned ? 'var(--g-blue)' : 'none'} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => handleOpenEditModal(msg, e)}
                    title="Edit Diskusi"
                  >
                    <Edit3 size={15} color="var(--text-secondary)" />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => handleDeletePost(msg.id, e)}
                    title="Hapus Diskusi"
                  >
                    <Trash2 size={15} color="var(--g-red)" />
                  </button>
                </div>
              </div>

              <h3 
                onClick={() => setActiveMessageDetail(msg)}
                style={{ fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '8px', lineHeight: 1.3 }}
              >
                {msg.title}
              </h3>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                {msg.content}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={msg.authorAvatar} alt={msg.author} className="avatar" style={{ width: '26px', height: '26px' }} />
                <span style={{ fontWeight: 600 }}>{msg.author}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {msg.date}
                </span>
                <span 
                  onClick={() => setActiveMessageDetail(msg)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--g-blue)', fontWeight: 600 }}
                >
                  <MessageCircle size={14} /> {msg.commentsCount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category CRUD Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Kelola Kategori Diskusi</h3>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Nama kategori baru..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Plus size={16} /> Tambah
              </button>
            </form>

            {/* Category List CRUD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {categories.map((cat, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  {editingCatIndex === idx ? (
                    <div style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '8px' }}>
                      <input
                        type="text"
                        className="input-field"
                        value={editCatNameText}
                        onChange={(e) => setEditCatNameText(e.target.value)}
                        style={{ height: '32px', fontSize: '0.85rem' }}
                      />
                      <button className="btn btn-primary" onClick={() => handleSaveEditCategory(idx)} style={{ padding: '4px 8px' }}>
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat}</span>
                  )}

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setEditingCatIndex(idx);
                        setEditCatNameText(cat);
                      }}
                      title="Edit Kategori"
                      style={{ padding: '4px' }}
                    >
                      <Edit3 size={15} color="var(--text-secondary)" />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteCategory(cat)}
                      title="Hapus Kategori"
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={15} color="var(--g-red)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail & Comment Modal */}
      {activeMessageDetail && (
        <div className="modal-overlay" onClick={() => setActiveMessageDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-blue">{activeMessageDetail.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeMessageDetail.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-secondary" onClick={(e) => handleOpenEditModal(activeMessageDetail, e)} style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                  <Edit3 size={13} /> Edit
                </button>
                <button className="btn btn-secondary" onClick={() => handleDeletePost(activeMessageDetail.id)} style={{ padding: '4px 8px', fontSize: '0.78rem', color: 'var(--g-red)' }}>
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
              {activeMessageDetail.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <img src={activeMessageDetail.authorAvatar} alt={activeMessageDetail.author} className="avatar" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeMessageDetail.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Penulis</div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
              marginBottom: '24px',
              border: '1px solid var(--border-color)'
            }}>
              {activeMessageDetail.content}
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageCircle size={18} color="var(--g-blue)" /> Tanggapan & Komentar ({activeMessageDetail.commentsCount || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {(activeMessageDetail.comments || []).map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '10px', background: 'var(--bg-surface-hover)', padding: '12px', borderRadius: 'var(--radius-sm)', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <img src={c.avatar} alt={c.author} className="avatar" style={{ width: '28px', height: '28px' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.author}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>{c.text}</div>
                    </div>
                  </div>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteComment(activeMessageDetail.id, c.id)}
                    title="Hapus Komentar"
                    style={{ padding: '2px' }}
                  >
                    <Trash2 size={13} color="var(--g-red)" />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Tulis balasan..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activeMessageDetail.id)}
              />
              <button className="btn btn-primary" onClick={() => handleAddComment(activeMessageDetail.id)}>
                Kirim
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setActiveMessageDetail(null)}>
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Message Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Posting Diskusi Baru</h3>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Judul</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Perencanaan Arsitektur API Firestore..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Isi Diskusi</label>
                <textarea
                  className="input-field"
                  rows={5}
                  placeholder="Tulis uraian topik diskusi..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Message Modal */}
      {editingMessage && (
        <div className="modal-overlay" onClick={() => setEditingMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Diskusi</h3>
            <form onSubmit={handleSaveEditPost}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Judul</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Isi Diskusi</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingMessage(null)}>
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
