import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, LayoutGrid, List, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import TodoListKanban from './TodoListKanban';
import { AddTaskModal, EditTaskModal, AddCategoryModal } from './TodoListModals';

export default function TodoList({ todos, setTodos, activeProject, projects = [], currentUser, notify }) {
  const [viewMode, setViewMode] = useState('list');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  
  const defaultAssignee = currentUser?.name || activeProject?.members?.[0]?.name || 'Rausal Bahtiar';
  const [taskText, setTaskText] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(defaultAssignee);
  const [taskDueDate, setTaskDueDate] = useState('');

  const isMatchProject = (projId) => {
    if (!projId || !activeProject) return false;
    if (projId === activeProject.id) return true;
    if (activeProject.name && Array.isArray(projects)) {
      const targetProj = projects.find(p => p.id === projId);
      if (targetProj && targetProj.name && targetProj.name.toLowerCase() === activeProject.name.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const filteredTodos = todos.filter(cat => isMatchProject(cat.projectId));

  const handleToggleItem = (catId, itemId, e) => {
    if (e) e.stopPropagation();
    let targetUpdatedCat = null;
    const updated = todos.map(cat => {
      if (cat.id === catId) {
        const updatedItems = cat.items.map(item => {
          if (item.id === itemId) {
            const willBeCompleted = !item.completed;
            if (willBeCompleted) {
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
              notify?.(`Tugas "${item.text}" selesai 🎉`, 'success');
            } else {
              notify?.(`Status tugas "${item.text}" diperbarui`, 'info');
            }
            return { ...item, completed: willBeCompleted };
          }
          return item;
        });
        targetUpdatedCat = { ...cat, items: updatedItems };
        return targetUpdatedCat;
      }
      return cat;
    });
    setTodos(updated, targetUpdatedCat, false);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!taskText.trim() || !activeCategoryId) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: taskText,
      completed: false,
      assignee: taskAssignee || defaultAssignee,
      dueDate: taskDueDate || 'Hari ini'
    };

    let targetUpdatedCat = null;
    const updated = todos.map(cat => {
      if (cat.id === activeCategoryId) {
        targetUpdatedCat = { ...cat, items: [...cat.items, newItem] };
        return targetUpdatedCat;
      }
      return cat;
    });

    setTodos(updated, targetUpdatedCat, false);
    setTaskText('');
    setTaskDueDate('');
    setActiveCategoryId(null);
    notify?.(`Tugas "${newItem.text}" berhasil dibuat`, 'success');
  };

  const handleOpenEditTask = (catId, item, e) => {
    if (e) e.stopPropagation();
    setEditingTask({ catId, item });
    setTaskText(item.text);
    setTaskAssignee(item.assignee || defaultAssignee);
    setTaskDueDate(item.dueDate || '');
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!taskText.trim() || !editingTask) return;

    const { catId, item } = editingTask;
    let targetUpdatedCat = null;

    const updated = todos.map(cat => {
      if (cat.id === catId) {
        const updatedItems = cat.items.map(i => {
          if (i.id === item.id) {
            return { ...i, text: taskText, assignee: taskAssignee, dueDate: taskDueDate };
          }
          return i;
        });
        targetUpdatedCat = { ...cat, items: updatedItems };
        return targetUpdatedCat;
      }
      return cat;
    });

    setTodos(updated, targetUpdatedCat, false);
    setEditingTask(null);
    setTaskText('');
    setTaskDueDate('');
    notify?.(`Tugas "${taskText}" diperbarui`, 'info');
  };

  const handleDeleteTask = (catId, itemId, e) => {
    if (e) e.stopPropagation();
    let targetUpdatedCat = null;
    const updated = todos.map(cat => {
      if (cat.id === catId) {
        targetUpdatedCat = { ...cat, items: cat.items.filter(i => i.id !== itemId) };
        return targetUpdatedCat;
      }
      return cat;
    });
    setTodos(updated, targetUpdatedCat, false);
    notify?.('Tugas berhasil dihapus', 'delete');
  };

  const handleDeleteCategory = (catId) => {
    const deletedCat = todos.find(c => c.id === catId) || { id: catId };
    const remaining = todos.filter(c => c.id !== catId);
    setTodos(remaining, deletedCat, true);
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

    const updated = [...todos, newCategory];
    setTodos(updated, newCategory, false);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  return (
    <div style={{ padding: '8px 0' }}>
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
          <div style={{ display: 'flex', background: 'var(--bg-surface-hover)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button className="btn" onClick={() => setViewMode('list')} style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '4px', background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent' }}>
              <List size={14} /> List View
            </button>
            <button className="btn" onClick={() => setViewMode('kanban')} style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '4px', background: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent' }}>
              <LayoutGrid size={14} /> Kanban View
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddCategoryModal(true)}>
            <Plus size={18} /> Tambah Kelompok List
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredTodos.map(cat => {
            const completedCount = cat.items.filter(i => i.completed).length;
            const totalCount = cat.items.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div key={cat.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.categoryName}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {completedCount} dari {totalCount} tugas selesai ({percent}%)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ height: '6px', background: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--g-green)', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => handleDeleteCategory(cat.id)} style={{ padding: '4px' }}>
                      <Trash2 size={16} color="var(--g-red)" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {cat.items.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                      <div onClick={(e) => handleToggleItem(cat.id, item.id, e)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
                        {item.completed ? <CheckCircle2 size={18} color="var(--g-green)" /> : <Circle size={18} color="var(--text-muted)" />}
                        <span style={{ fontSize: '0.9rem', textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: item.completed ? 400 : 500 }}>
                          {item.text}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
                        {item.assignee && <span style={{ color: 'var(--g-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {item.assignee}</span>}
                        {item.dueDate && <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {item.dueDate}</span>}
                        <div style={{ display: 'flex', gap: '2px', marginLeft: '6px' }}>
                          <button className="btn-icon" onClick={(e) => handleOpenEditTask(cat.id, item, e)} style={{ padding: '3px' }}><Edit3 size={14} color="var(--text-secondary)" /></button>
                          <button className="btn-icon" onClick={(e) => handleDeleteTask(cat.id, item.id, e)} style={{ padding: '3px' }}><Trash2 size={14} color="var(--g-red)" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-secondary" onClick={() => { setTaskText(''); setTaskDueDate(''); setActiveCategoryId(cat.id); }} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  <Plus size={14} /> Tambah Item Tugas
                </button>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'kanban' && (
        <TodoListKanban filteredTodos={filteredTodos} onDeleteCategory={handleDeleteCategory} onToggleItem={handleToggleItem} onOpenEditTask={handleOpenEditTask} onDeleteTask={handleDeleteTask} />
      )}

      <AddTaskModal isOpen={!!activeCategoryId} onClose={() => setActiveCategoryId(null)} taskText={taskText} setTaskText={setTaskText} taskAssignee={taskAssignee} setTaskAssignee={setTaskAssignee} taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} activeProject={activeProject} currentUser={currentUser} onSubmit={handleAddItem} />
      <EditTaskModal isOpen={!!editingTask} onClose={() => setEditingTask(null)} taskText={taskText} setTaskText={setTaskText} taskAssignee={taskAssignee} setTaskAssignee={setTaskAssignee} taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} activeProject={activeProject} currentUser={currentUser} onSubmit={handleSaveEditTask} />
      <AddCategoryModal isOpen={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} onSubmit={handleAddCategory} />
    </div>
  );
}
