import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, LayoutGrid, List, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TodoList({ todos, setTodos, activeProject, notify }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Task add & edit state
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [editingTask, setEditingTask] = useState(null); // { catId, item }
  
  const [taskText, setTaskText] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Rian Hidayat');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleToggleItem = (catId, itemId, e) => {
    if (e) e.stopPropagation();
    setTodos(todos.map(cat => {
      if (cat.id === catId) {
        const updatedItems = cat.items.map(item => {
          if (item.id === itemId) {
            const willBeCompleted = !item.completed;
            if (willBeCompleted) {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.7 }
              });
              notify?.(`Tugas "${item.text}" selesai 🎉`, 'success');
            } else {
              notify?.(`Status tugas "${item.text}" diperbarui`, 'info');
            }
            return { ...item, completed: willBeCompleted };
          }
          return item;
        });
        return { ...cat, items: updatedItems };
      }
      return cat;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!taskText.trim() || !activeCategoryId) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: taskText,
      completed: false,
      assignee: taskAssignee,
      dueDate: taskDueDate || 'Hari ini'
    };

    setTodos(todos.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    }));

    setTaskText('');
    setTaskDueDate('');
    setActiveCategoryId(null);
    notify?.(`Tugas "${newItem.text}" berhasil dibuat`, 'success');
  };

  const handleOpenEditTask = (catId, item, e) => {
    if (e) e.stopPropagation();
    setEditingTask({ catId, item });
    setTaskText(item.text);
    setTaskAssignee(item.assignee || 'Budi Santoso');
    setTaskDueDate(item.dueDate || '');
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!taskText.trim() || !editingTask) return;

    const { catId, item } = editingTask;

    setTodos(todos.map(cat => {
      if (cat.id === catId) {
        const updatedItems = cat.items.map(i => {
          if (i.id === item.id) {
            return {
              ...i,
              text: taskText,
              assignee: taskAssignee,
              dueDate: taskDueDate
            };
          }
          return i;
        });
        return { ...cat, items: updatedItems };
      }
      return cat;
    }));

    setEditingTask(null);
    setTaskText('');
    setTaskDueDate('');
    notify?.(`Tugas "${taskText}" diperbarui`, 'info');
  };

  const handleDeleteTask = (catId, itemId, e) => {
    if (e) e.stopPropagation();
    setTodos(todos.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.filter(i => i.id !== itemId)
        };
      }
      return cat;
    }));
    notify?.('Tugas berhasil dihapus', 'delete');
  };

  const handleDeleteCategory = (catId) => {
    setTodos(todos.filter(c => c.id !== catId));
    notify?.('Grup tugas berhasil dihapus', 'delete');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCategory = {
      id: `todo-cat-${Date.now()}`,
      projectId: activeProject.id,
      categoryName: newCategoryName,
      items: []
    };

    setTodos([...todos, newCategory]);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header & View Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare color="var(--g-green)" size={24} /> Manajemen Tugas (Task Manager)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Daftar tugas terstruktur dengan penetapan penanggung jawab & target penyelesaian.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-hover)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              className="btn"
              onClick={() => setViewMode('list')}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <List size={14} /> List View
            </button>
            <button
              className="btn"
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent',
                boxShadow: viewMode === 'kanban' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <LayoutGrid size={14} /> Kanban View
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddCategoryModal(true)}>
            <Plus size={18} /> Tambah Kelompok List
          </button>
        </div>
      </div>

      {/* Render List View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {todos.map(cat => {
            const completedCount = cat.items.filter(i => i.completed).length;
            const totalCount = cat.items.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div key={cat.id} className="glass-card" style={{ padding: '20px' }}>
                {/* Category Header & Progress */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.categoryName}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {completedCount} dari {totalCount} tugas selesai ({percent}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Progress Meter */}
                    <div style={{ width: '120px' }}>
                      <div style={{ height: '6px', background: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--g-green)', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                    
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteCategory(cat.id)}
                      title="Hapus Kelompok List Ini"
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={16} color="var(--g-red)" />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {cat.items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '10px 14px',
                        background: item.completed ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div 
                        onClick={(e) => handleToggleItem(cat.id, item.id, e)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={20} color="var(--g-green)" />
                        ) : (
                          <Circle size={20} color="var(--text-muted)" />
                        )}
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          textDecoration: item.completed ? 'line-through' : 'none',
                          color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}>
                          {item.text}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
                        {item.assignee && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--g-blue-light)', color: 'var(--g-blue)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                            <User size={12} /> {item.assignee}
                          </span>
                        )}
                        {item.dueDate && (
                          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {item.dueDate}
                          </span>
                        )}

                        {/* Edit & Delete Task Actions */}
                        <div style={{ display: 'flex', gap: '2px', marginLeft: '6px' }}>
                          <button
                            className="btn-icon"
                            onClick={(e) => handleOpenEditTask(cat.id, item, e)}
                            title="Edit Tugas"
                            style={{ padding: '3px' }}
                          >
                            <Edit3 size={14} color="var(--text-secondary)" />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={(e) => handleDeleteTask(cat.id, item.id, e)}
                            title="Hapus Tugas"
                            style={{ padding: '3px' }}
                          >
                            <Trash2 size={14} color="var(--g-red)" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setTaskText('');
                    setTaskDueDate('');
                    setActiveCategoryId(cat.id);
                  }}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Tambah Item Tugas
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Render Kanban View */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {todos.map(cat => (
            <div key={cat.id} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.categoryName}</h4>
                <button className="btn-icon" onClick={() => handleDeleteCategory(cat.id)} style={{ padding: '2px' }}>
                  <Trash2 size={14} color="var(--g-red)" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cat.items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div onClick={(e) => handleToggleItem(cat.id, item.id, e)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}>
                        {item.completed ? <CheckCircle2 size={16} color="var(--g-green)" /> : <Circle size={16} color="var(--text-muted)" />}
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, textDecoration: item.completed ? 'line-through' : 'none' }}>
                          {item.text}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button className="btn-icon" onClick={(e) => handleOpenEditTask(cat.id, item, e)} style={{ padding: '2px' }}>
                          <Edit3 size={13} color="var(--text-secondary)" />
                        </button>
                        <button className="btn-icon" onClick={(e) => handleDeleteTask(cat.id, item.id, e)} style={{ padding: '2px' }}>
                          <Trash2 size={13} color="var(--g-red)" />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>👤 {item.assignee}</span>
                      <span>📅 {item.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Item Modal */}
      {activeCategoryId && (
        <div className="modal-overlay" onClick={() => setActiveCategoryId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Item Tugas Baru</h3>
            <form onSubmit={handleAddItem}>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Penanggung Jawab (Assignee)</label>
                <select
                  className="input-field"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                >
                  <option value="Budi Santoso">Budi Santoso (Project Lead)</option>
                  <option value="Siti Rahma">Siti Rahma (UI Designer)</option>
                  <option value="Rian Hidayat">Rian Hidayat (Frontend)</option>
                  <option value="Dewi Lestari">Dewi Lestari (QA)</option>
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
                <button type="button" className="btn btn-secondary" onClick={() => setActiveCategoryId(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Item Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Item Tugas</h3>
            <form onSubmit={handleSaveEditTask}>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Penanggung Jawab (Assignee)</label>
                <select
                  className="input-field"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                >
                  <option value="Budi Santoso">Budi Santoso (Project Lead)</option>
                  <option value="Siti Rahma">Siti Rahma (UI Designer)</option>
                  <option value="Rian Hidayat">Rian Hidayat (Frontend)</option>
                  <option value="Dewi Lestari">Dewi Lestari (QA)</option>
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
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTask(null)}>
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

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowAddCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Tambah Kelompok List Baru</h3>
            <form onSubmit={handleAddCategory}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Kelompok List</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Phase 3: Launching & Marketing"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCategoryModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Buat Kelompok List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
