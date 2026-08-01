import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectDashboard from './components/ProjectDashboard';
import MessageBoard from './components/MessageBoard';
import TodoList from './components/TodoList';
import CampfireChat from './components/CampfireChat';
import ScheduleCalendar from './components/ScheduleCalendar';
import DocsAndFiles from './components/DocsAndFiles';
import AutomaticCheckins from './components/AutomaticCheckins';
import GlobalDashboard from './components/GlobalDashboard';
import FirebaseSettingsModal from './components/FirebaseSettingsModal';
import LoginModal from './components/LoginModal';
import TeamManagerModal from './components/TeamManagerModal';

import { 
  INITIAL_PROJECTS, 
  INITIAL_MESSAGES, 
  INITIAL_TODOS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_FILES, 
  INITIAL_EVENTS, 
  INITIAL_CHECKINS
} from './data/mockData';

import { 
  db, 
  isLiveFirebase, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc
} from './firebase';

import { LayoutDashboard, MessageSquare, CheckSquare, MessageCircle, Calendar, HardDrive, HelpCircle, Plus, Edit3, Trash2, Globe } from 'lucide-react';

const INITIAL_ROLES = [
  { id: 'role-lead', name: 'Project Lead', level: 'Admin', canEdit: true, canDelete: true, canInvite: true, canManageProject: true, color: '#1a73e8' },
  { id: 'role-dev', name: 'Developer', level: 'Editor', canEdit: true, canDelete: true, canInvite: false, canManageProject: false, color: '#34a853' },
  { id: 'role-design', name: 'UI/UX Designer', level: 'Editor', canEdit: true, canDelete: false, canInvite: false, canManageProject: false, color: '#fbbc04' },
  { id: 'role-qa', name: 'QA Engineer', level: 'Editor', canEdit: true, canDelete: false, canInvite: false, canManageProject: false, color: '#ea4335' },
  { id: 'role-viewer', name: 'Viewer', level: 'Read-Only', canEdit: false, canDelete: false, canInvite: false, canManageProject: false, color: '#80868b' }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User & Auth State (Persisted in LocalStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('hub_currentUser');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return null;
  });

  // Projects State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('hub_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState(() => projects[0] || INITIAL_PROJECTS[0]);
  const [activeTab, setActiveTab] = useState('overview');

  // Available Roles State
  const [availableRoles, setAvailableRoles] = useState(INITIAL_ROLES);

  // Dynamic Real Activities Feed State
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('hub_activities');
    return saved ? JSON.parse(saved) : [];
  });

  // Module States
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hub_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('hub_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('hub_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('hub_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('hub_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [checkins, setCheckins] = useState(() => {
    const saved = localStorage.getItem('hub_checkins');
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Form states
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCat, setProjCat] = useState('Productivity');
  const [projColor, setProjColor] = useState('#1a73e8');

  // =========================================================
  // ⚡ FIRESTORE REALTIME SYNC LISTENERS (`onSnapshot`)
  // =========================================================
  useEffect(() => {
    if (!db) return;

    // Seed active projects to Firestore Cloud on start
    projects.forEach(async (p) => {
      try {
        await setDoc(doc(db, 'projects', p.id), p, { merge: true });
      } catch (e) {}
    });

    // 1. Projects Realtime Listener
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudProj = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setProjects(cloudProj);
        localStorage.setItem('hub_projects', JSON.stringify(cloudProj));

        setActiveProject(prev => {
          if (!prev) return cloudProj[0];
          const updated = cloudProj.find(p => p.id === prev.id);
          return updated || cloudProj[0];
        });
      }
    });

    // 2. Activities Realtime Listener
    const unsubActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudAct = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        cloudAct.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setActivities(cloudAct);
        localStorage.setItem('hub_activities', JSON.stringify(cloudAct));
      }
    });

    // 3. Todos Realtime Listener
    const unsubTodos = onSnapshot(collection(db, 'todos'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudTodos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setTodos(cloudTodos);
        localStorage.setItem('hub_todos', JSON.stringify(cloudTodos));
      }
    });

    // 4. Messages Realtime Listener
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudMsg = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setMessages(cloudMsg);
        localStorage.setItem('hub_messages', JSON.stringify(cloudMsg));
      }
    });

    // 5. Chat Messages Realtime Listener
    const unsubChat = onSnapshot(collection(db, 'chatMessages'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudChat = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        cloudChat.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        setChatMessages(cloudChat);
        localStorage.setItem('hub_chat', JSON.stringify(cloudChat));
      }
    });

    // 6. Events Realtime Listener
    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudEvents = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setEvents(cloudEvents);
        localStorage.setItem('hub_events', JSON.stringify(cloudEvents));
      }
    });

    // 7. Files Realtime Listener
    const unsubFiles = onSnapshot(collection(db, 'files'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudFiles = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setFiles(cloudFiles);
        localStorage.setItem('hub_files', JSON.stringify(cloudFiles));
      }
    });

    // 8. Checkins Realtime Listener
    const unsubCheckins = onSnapshot(collection(db, 'checkins'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudCheck = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setCheckins(cloudCheck);
        localStorage.setItem('hub_checkins', JSON.stringify(cloudCheck));
      }
    });

    return () => {
      unsubProjects();
      unsubActivities();
      unsubTodos();
      unsubMessages();
      unsubChat();
      unsubEvents();
      unsubFiles();
      unsubCheckins();
    };
  }, []);

  // Helper to add real activity log and write to Cloud Firestore
  const handleAddActivity = async (actionText) => {
    const newAct = {
      id: `act-${Date.now()}`,
      user: currentUser ? currentUser.name : 'Pengguna',
      action: actionText,
      time: 'Baru saja',
      createdAt: Date.now()
    };
    setActivities(prev => [newAct, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'activities', newAct.id), newAct);
      } catch (err) {}
    }
  };

  // State sync wrapper functions for child modules to write to Firestore
  const handleUpdateMessages = async (newMessagesList, updatedItem = null, isDelete = false) => {
    setMessages(newMessagesList);
    localStorage.setItem('hub_messages', JSON.stringify(newMessagesList));
    if (db && updatedItem) {
      try {
        if (isDelete) {
          await deleteDoc(doc(db, 'messages', updatedItem.id));
        } else {
          await setDoc(doc(db, 'messages', updatedItem.id), updatedItem);
        }
      } catch (e) {}
    }
  };

  const handleUpdateTodos = async (newTodosList, updatedItem = null, isDelete = false) => {
    setTodos(newTodosList);
    localStorage.setItem('hub_todos', JSON.stringify(newTodosList));
    if (db && updatedItem) {
      try {
        if (isDelete) {
          await deleteDoc(doc(db, 'todos', updatedItem.id));
        } else {
          await setDoc(doc(db, 'todos', updatedItem.id), updatedItem);
        }
      } catch (e) {}
    }
  };

  const handleUpdateChatMessages = async (newChatList, updatedItem = null) => {
    setChatMessages(newChatList);
    localStorage.setItem('hub_chat', JSON.stringify(newChatList));
    if (db && updatedItem) {
      try {
        await setDoc(doc(db, 'chatMessages', updatedItem.id), updatedItem);
      } catch (e) {}
    }
  };

  const handleUpdateEvents = async (newEventsList, updatedItem = null, isDelete = false) => {
    setEvents(newEventsList);
    localStorage.setItem('hub_events', JSON.stringify(newEventsList));
    if (db && updatedItem) {
      try {
        if (isDelete) {
          await deleteDoc(doc(db, 'events', updatedItem.id));
        } else {
          await setDoc(doc(db, 'events', updatedItem.id), updatedItem);
        }
      } catch (e) {}
    }
  };

  const handleUpdateFiles = async (newFilesList, updatedItem = null, isDelete = false) => {
    setFiles(newFilesList);
    localStorage.setItem('hub_files', JSON.stringify(newFilesList));
    if (db && updatedItem) {
      try {
        if (isDelete) {
          await deleteDoc(doc(db, 'files', updatedItem.id));
        } else {
          await setDoc(doc(db, 'files', updatedItem.id), updatedItem);
        }
      } catch (e) {}
    }
  };

  const handleUpdateCheckins = async (newCheckinsList, updatedItem = null, isDelete = false) => {
    setCheckins(newCheckinsList);
    localStorage.setItem('hub_checkins', JSON.stringify(newCheckinsList));
    if (db && updatedItem) {
      try {
        if (isDelete) {
          await deleteDoc(doc(db, 'checkins', updatedItem.id));
        } else {
          await setDoc(doc(db, 'checkins', updatedItem.id), updatedItem);
        }
      } catch (e) {}
    }
  };

  // Sync theme with HTML root attribute & Check for Invite Link in URL
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Auto-detect Invitation Join Link
    const urlParams = new URLSearchParams(window.location.search);
    const inviteProjId = urlParams.get('invite');
    const inviteRoleName = urlParams.get('role') || 'Developer';
    const inviteEmail = urlParams.get('email');

    if (inviteProjId) {
      const processInviteLink = async () => {
        let targetProj = null;

        // Fetch directly from Cloud Firestore FIRST to get real updated project (e.g. 'Beon')
        if (db) {
          try {
            const docSnap = await getDoc(doc(db, 'projects', inviteProjId));
            if (docSnap.exists()) {
              targetProj = { id: docSnap.id, ...docSnap.data() };
            }
          } catch (e) {}
        }

        if (!targetProj) {
          targetProj = projects.find(p => p.id === inviteProjId);
        }

        if (targetProj) {
          // Add target project to projects array or update existing
          setProjects(prev => {
            const exists = prev.some(p => p.id === targetProj.id);
            return exists ? prev.map(p => p.id === targetProj.id ? targetProj : p) : [targetProj, ...prev];
          });

          // Switch Active Project directly to targetProj!
          setActiveProject(targetProj);

          // Update member status to 'joined'
          const memberEmail = currentUser ? currentUser.email : (inviteEmail || 'oukiwang72@gmail.com');
          const existingMembers = targetProj.members || [];
          
          const updatedMembers = existingMembers.map(m => {
            if (m.email?.toLowerCase() === memberEmail?.toLowerCase()) {
              return { ...m, status: 'joined' };
            }
            return m;
          });

          const hasMember = existingMembers.some(m => m.email?.toLowerCase() === memberEmail?.toLowerCase());
          if (!hasMember) {
            updatedMembers.push({
              name: currentUser ? currentUser.name : (inviteEmail ? inviteEmail.split('@')[0] : 'Wang'),
              email: memberEmail,
              avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              role: inviteRoleName,
              status: 'joined'
            });
          }

          handleUpdateProjectMembers(updatedMembers);
          handleAddActivity(`bergabung ke dalam tim proyek "${targetProj.name}" via link undangan`);
        }
      };

      processInviteLink();
    }
  }, [isDarkMode]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProjId = `proj-${Date.now()}`;
    const newProject = {
      id: newProjId,
      name: projName,
      description: projDesc || 'Proyek baru berbasis Google Cloud Platform',
      category: projCat,
      color: projColor,
      updatedAt: 'Baru saja',
      members: [
        { 
          name: currentUser?.name || 'Admin', 
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 
          role: 'Project Lead', 
          email: currentUser?.email || 'admin@gmail.com',
          status: 'joined'
        }
      ]
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setActiveProject(newProject);
    setProjName('');
    setProjDesc('');
    setShowNewProjectModal(false);

    if (db) {
      try {
        await setDoc(doc(db, 'projects', newProject.id), newProject);
      } catch (err) {}
    }

    handleAddActivity(`membuat proyek baru: ${newProject.name}`);
  };

  const handleOpenEditProject = () => {
    if (!activeProject) return;
    setProjName(activeProject.name);
    setProjDesc(activeProject.description);
    setProjCat(activeProject.category);
    setProjColor(activeProject.color);
    setShowEditProjectModal(true);
  };

  const handleSaveEditProject = async (e) => {
    e.preventDefault();
    if (!projName.trim() || !activeProject) return;

    const updatedData = {
      ...activeProject,
      name: projName,
      description: projDesc,
      category: projCat,
      color: projColor,
      updatedAt: 'Baru saja diperbarui'
    };

    const updatedProjects = projects.map(p => p.id === activeProject.id ? updatedData : p);

    setProjects(updatedProjects);
    setActiveProject(updatedData);
    setShowEditProjectModal(false);

    if (db) {
      try {
        await setDoc(doc(db, 'projects', activeProject.id), updatedData);
      } catch (err) {}
    }

    handleAddActivity(`memperbarui informasi proyek menjadi "${projName}"`);
  };

  const handleDeleteProject = async () => {
    if (!activeProject) return;
    const deletedId = activeProject.id;
    const remaining = projects.filter(p => p.id !== deletedId);
    setProjects(remaining);
    if (remaining.length > 0) {
      setActiveProject(remaining[0]);
    } else {
      setActiveProject(null);
    }
    setShowDeleteConfirmModal(false);

    if (db) {
      try {
        await deleteDoc(doc(db, 'projects', deletedId));
      } catch (err) {}
    }
  };

  const handleUpdateProjectMembers = async (newMembers) => {
    if (!activeProject) return;
    const updatedProj = { ...activeProject, members: newMembers };
    const updatedProjects = projects.map(p => p.id === activeProject.id ? updatedProj : p);
    
    setProjects(updatedProjects);
    setActiveProject(updatedProj);

    if (db) {
      try {
        await setDoc(doc(db, 'projects', activeProject.id), updatedProj);
      } catch (err) {}
    }
  };

  const handleSelectProjectFromGlobal = (projId) => {
    const target = projects.find(p => p.id === projId);
    if (target) {
      setActiveProject(target);
      setActiveTab('overview');
    }
  };

  const navTabs = [
    { id: 'global', label: 'Dashboard Master (Semua Proyek)', icon: Globe },
    { id: 'overview', label: 'Ringkasan Proyek', icon: LayoutDashboard },
    { id: 'messages', label: 'Diskusi & Pengumuman', icon: MessageSquare },
    { id: 'todos', label: 'Manajemen Tugas', icon: CheckSquare },
    { id: 'chat', label: 'Obrolan Tim', icon: MessageCircle },
    { id: 'schedule', label: 'Kalender', icon: Calendar },
    { id: 'files', label: 'Google Drive & File', icon: HardDrive },
    { id: 'standups', label: 'Standup Otomatis', icon: HelpCircle }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSettings={() => setShowSettingsModal(true)}
        onNewProject={() => {
          setProjName('');
          setProjDesc('');
          setShowNewProjectModal(true);
        }}
        onEditProject={handleOpenEditProject}
        onDeleteProject={() => setShowDeleteConfirmModal(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenTeamModal={() => setShowTeamModal(true)}
        currentUser={currentUser}
        isLiveFirebase={isLiveFirebase}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        {/* Secondary Tab Sub-Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingTop: '16px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--g-blue)' : '3px solid transparent',
                  color: isActive ? 'var(--g-blue)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Master Dashboard Tab */}
        {activeTab === 'global' && (
          <GlobalDashboard
            projects={projects}
            events={events}
            checkins={checkins}
            onSelectProject={handleSelectProjectFromGlobal}
            setEvents={(newEvts) => handleUpdateEvents(newEvts)}
          />
        )}

        {/* Active Project View Content */}
        {activeTab !== 'global' && (
          activeProject ? (
            <>
              {activeTab === 'overview' && (
                <ProjectDashboard
                  activeProject={activeProject}
                  onSelectTab={setActiveTab}
                  messages={messages}
                  todos={todos}
                  chatMessages={chatMessages}
                  events={events}
                  files={files}
                  checkins={checkins}
                  onOpenTeamModal={() => setShowTeamModal(true)}
                  activities={activities}
                />
              )}

              {activeTab === 'messages' && (
                <MessageBoard
                  messages={messages}
                  setMessages={handleUpdateMessages}
                  activeProject={activeProject}
                  currentUser={currentUser}
                  onAddActivity={handleAddActivity}
                />
              )}

              {activeTab === 'todos' && (
                <TodoList
                  todos={todos}
                  setTodos={handleUpdateTodos}
                  activeProject={activeProject}
                  currentUser={currentUser}
                  onAddActivity={handleAddActivity}
                />
              )}

              {activeTab === 'chat' && (
                <CampfireChat
                  chatMessages={chatMessages}
                  setChatMessages={handleUpdateChatMessages}
                  activeProject={activeProject}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleCalendar
                  events={events}
                  setEvents={handleUpdateEvents}
                  activeProject={activeProject}
                  currentUser={currentUser}
                  onAddActivity={handleAddActivity}
                />
              )}

              {activeTab === 'files' && (
                <DocsAndFiles
                  files={files}
                  setFiles={handleUpdateFiles}
                  activeProject={activeProject}
                  currentUser={currentUser}
                  onAddActivity={handleAddActivity}
                />
              )}

              {activeTab === 'standups' && (
                <AutomaticCheckins
                  checkins={checkins}
                  setCheckins={handleUpdateCheckins}
                  activeProject={activeProject}
                  currentUser={currentUser}
                />
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Belum ada Proyek Aktif</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Buat proyek baru untuk memulai kolaborasi.</p>
              <button className="btn btn-primary" onClick={() => setShowNewProjectModal(true)}>
                <Plus size={16} /> Buat Proyek Baru
              </button>
            </div>
          )
        )}
      </main>

      {/* Login & Auth Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Team Manager & Gmail Invite Modal */}
      <TeamManagerModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        activeProject={activeProject}
        onUpdateProjectMembers={handleUpdateProjectMembers}
        availableRoles={availableRoles}
        setAvailableRoles={setAvailableRoles}
        onAddActivity={handleAddActivity}
      />

      {/* Settings Modal */}
      <FirebaseSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isLiveFirebase={isLiveFirebase}
      />

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal-overlay" onClick={() => setShowNewProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Buat Proyek Baru</h3>
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Proyek</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: test / Portal Pelanggan Google Cloud"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Misal: Infrastructure / Mobile App"
                  value={projCat}
                  onChange={(e) => setProjCat(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Singkat</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Jelaskan tujuan utama proyek ini..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewProjectModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Buat Proyek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && activeProject && (
        <div className="modal-overlay" onClick={() => setShowEditProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Edit Informasi Proyek</h3>
            <form onSubmit={handleSaveEditProject}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nama Proyek</label>
                <input
                  type="text"
                  className="input-field"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Kategori</label>
                <input
                  type="text"
                  className="input-field"
                  value={projCat}
                  onChange={(e) => setProjCat(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Deskripsi</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditProjectModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && activeProject && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ marginBottom: '12px', fontWeight: 800, color: 'var(--g-red)' }}>Hapus Proyek?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Apakah Anda yakin ingin menghapus proyek <strong>"{activeProject.name}"</strong>? Seluruh data tugas dan diskusi di dalamnya akan dihapus.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirmModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleDeleteProject} style={{ background: 'var(--g-red)' }}>
                Ya, Hapus Proyek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
