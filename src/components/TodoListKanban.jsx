import React from 'react';
import { Trash2, CheckCircle2, Circle, Edit3, User, Calendar } from 'lucide-react';

export default function TodoListKanban({ 
  filteredTodos, 
  onDeleteCategory, 
  onToggleItem, 
  onOpenEditTask, 
  onDeleteTask 
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      {filteredTodos.map(cat => (
        <div key={cat.id} className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.categoryName}</h4>
            <button className="btn-icon" onClick={() => onDeleteCategory(cat.id)} style={{ padding: '2px' }}>
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
                  <div onClick={(e) => onToggleItem(cat.id, item.id, e)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}>
                    {item.completed ? <CheckCircle2 size={16} color="var(--g-green)" /> : <Circle size={16} color="var(--text-muted)" />}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textDecoration: item.completed ? 'line-through' : 'none' }}>
                      {item.text}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button className="btn-icon" onClick={(e) => onOpenEditTask(cat.id, item, e)} style={{ padding: '2px' }}>
                      <Edit3 size={13} color="var(--text-secondary)" />
                    </button>
                    <button className="btn-icon" onClick={(e) => onDeleteTask(cat.id, item.id, e)} style={{ padding: '2px' }}>
                      <Trash2 size={13} color="var(--g-red)" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {item.assignee && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {item.assignee}
                    </span>
                  )}
                  {item.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {item.dueDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
