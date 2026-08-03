import React, { useState } from 'react';
import { HelpCircle, Plus, Send, Clock, User, CheckCircle2 } from 'lucide-react';
import { isMatchProject } from '../hooks/useWorkspaceData';

export default function AutomaticCheckins({ checkins, setCheckins, activeProject, projects = [], currentUser, notify }) {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newSchedule, setNewSchedule] = useState('Setiap hari kerja jam 16:30');
  
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [answerInput, setAnswerInput] = useState('');

  const authorName = currentUser ? currentUser.name : 'Rausal Bahtiar';
  const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newChk = {
      id: `chk-${Date.now()}`,
      projectId: activeProject.id,
      question: newQuestion,
      schedule: newSchedule,
      responses: []
    };

    const updated = [newChk, ...checkins];
    setCheckins(updated, newChk, false);
    setNewQuestion('');
    setShowAddQuestionModal(false);
    notify?.('Pertanyaan standup otomatis berhasil ditambahkan!', 'success');
  };

  const handleSubmitAnswer = (chkId) => {
    if (!answerInput.trim()) return;

    const newResponse = {
      author: authorName,
      avatar: authorAvatar,
      time: 'Baru saja',
      answer: answerInput
    };

    let targetUpdated = null;
    const updated = checkins.map(chk => {
      if (chk.id === chkId) {
        targetUpdated = {
          ...chk,
          responses: [newResponse, ...(chk.responses || [])]
        };
        return targetUpdated;
      }
      return chk;
    });

    setCheckins(updated, targetUpdated, false);
    setAnswerInput('');
    setActiveQuestionId(null);
    notify?.('Jawaban standup berhasil dikirim!', 'info');
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle color="var(--g-red)" size={24} /> Standup Otomatis (Status Report)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Pengumpulan status pengerjaan harian tim secara teratur dari Cloud Functions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddQuestionModal(true)}>
          <Plus size={18} /> Buat Pertanyaan Standup
        </button>
      </div>

      {/* Questions Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {checkins.filter(c => isMatchProject(c.projectId, activeProject, projects)).map(chk => (
          <div key={chk.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{chk.question}</h3>
              <span className="badge badge-yellow" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {chk.schedule}
              </span>
            </div>

            {/* Answer Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {(chk.responses || []).map((resp, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <img 
                    src={resp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(resp.author || 'User')}&background=0D8ABC&color=fff&bold=true`} 
                    alt={resp.author} 
                    className="avatar" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resp.author || 'User')}&background=0D8ABC&color=fff&bold=true`;
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{resp.author}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{resp.time}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem' }}>{resp.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Answer Trigger */}
            {activeQuestionId === chk.id ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tuliskan laporan status..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer(chk.id)}
                />
                <button className="btn btn-primary" onClick={() => handleSubmitAnswer(chk.id)}>
                  Kirim Status
                </button>
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => setActiveQuestionId(chk.id)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Send size={14} /> Jawab Status Ini
              </button>
            )}
          </div>
        ))}
      </div>

      {/* New Question Modal */}
      {showAddQuestionModal && (
        <div className="modal-overlay" onClick={() => setShowAddQuestionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Buat Pertanyaan Standup Baru</h3>
            <form onSubmit={handleAddQuestion}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Pertanyaan Status</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Apa target yang berhasil kamu capai hari ini?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Jadwal Pertanyaan</label>
                <select className="input-field" value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)}>
                  <option value="Setiap hari kerja jam 16:30">Setiap hari kerja jam 16:30</option>
                  <option value="Setiap Senin jam 09:00">Setiap Senin jam 09:00 (Weekly Kickoff)</option>
                  <option value="Setiap Jumat jam 16:00">Setiap Jumat jam 16:00 (Weekly Recap)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddQuestionModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Aktifkan Standup</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
