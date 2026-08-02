import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NavigationSubTabs from './components/NavigationSubTabs';
import ProjectDashboard from './components/ProjectDashboard';
import MessageBoard from './components/MessageBoard';
import TodoList from './components/TodoList';
import CampfireChat from './components/CampfireChat';
import ScheduleCalendar from './components/ScheduleCalendar';
import DocsAndFiles from './components/DocsAndFiles';
import AutomaticCheckins from './components/AutomaticCheckins';
import GlobalDashboard from './components/GlobalDashboard';
import LoginModal from './components/LoginModal';
import TeamManagerModal from './components/TeamManagerModal';
import { NewProjectModal, EditProjectModal, DeleteProjectModal } from './components/ProjectModals';

import { useWorkspaceData, isUserMemberOfProject } from './hooks/useWorkspaceData';
import * as dbService from './services/supabaseService';
import { Plus, Lock, LogIn } from 'lucide-react';

const INITIAL_ROLES = [
  { id: 'role-lead', name: 'Project Lead', level: 'Admin', canEdit: true, canDelete: true, canInvite: true, canManageProject: true, color: '#1a73e8' },
  { id: 'role-dev', name: 'Developer', level: 'Editor', canEdit: true, canDelete: true, canInvite: false, canManageProject: false, color: '#34a853' },
  { id: 'role-design', name: 'UI/UX Designer', level: 'Editor', canEdit: true, canDelete: false, canInvite: false, canManageProject: false, color: '#fbbc04' },
  { id: 'role-qa', name: 'QA Engineer', level: 'Editor', canEdit: true, canDelete: false, canInvite: false, canManageProject: false, color: '#ea4335' },
  { id: 'role-viewer', name: 'Viewer', level: 'Read-Only', canEdit: false, canDelete: false, canInvite: false, canManageProject: false, color: '#80868b' }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // User & Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('hub_currentUser');
    if (savedUser) { try { return JSON.parse(savedUser); } catch (e) {} }
    return null;
  });

  // Custom Hook for Supabase Workspace Data
  const {
    projects, setProjects,
    activeProject, setActiveProject,
    activities, handleAddActivity,
    messages, handleUpdateMessages,
    todos, handleUpdateTodos,
    chatMessages, handleUpdateChatMessages,
    files, handleUpdateFiles,
    events, handleUpdateEvents,
    checkins, handleUpdateCheckins,
    broadcastSync
  } = useWorkspaceData(currentUser);

  // Filter projects accessible to current user
  const userProjects = projects.filter(p => isUserMemberOfProject(p, currentUser));

  // Sync active project if user loses or lacks access to current activeProject
  useEffect(() => {
    if (!currentUser) {
      setActiveProject(null);
      return;
    }
    if (userProjects.length > 0) {
      if (!activeProject || !userProjects.some(p => p.id === activeProject.id)) {
        setActiveProject(userProjects[0]);
      }
    } else {
      setActiveProject(null);
    }
  }, [currentUser, projects]);

  // Unread Notification Tracker Engine across all 6 sub-features
  const [lastVisitedTabs, setLastVisitedTabs] = useState(() => {
    const saved = localStorage.getItem('hub_lastVisitedTabs');
    const now = Date.now();
    return saved ? JSON.parse(saved) : { 
      overview: now,
      messages: now - 3600000,
      todos: now - 3600000,
      chat: now - 3600000,
      schedule: now - 3600000,
      files: now - 3600000,
      standups: now - 3600000
    };
  });

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    const updated = { ...lastVisitedTabs, [tabId]: Date.now() };
    setLastVisitedTabs(updated);
    localStorage.setItem('hub_lastVisitedTabs', JSON.stringify(updated));
  };

  const extractItemTimestamp = (item) => {
    if (!item) return 0;
    if (typeof item.createdAt === 'number' && item.createdAt > 0) return item.createdAt;
    if (item.id) {
      const match = String(item.id).match(/\d{10,}/);
      if (match) return parseInt(match[0]);
    }
    return 0;
  };

  const isItemForActiveProject = (itemProjId) => {
    if (!currentUser || !activeProject) return false;
    if (!itemProjId) return false;
    if (itemProjId === activeProject.id) return true;
    if (activeProject.name && Array.isArray(userProjects)) {
      const proj = userProjects.find(p => p.id === itemProjId);
      if (proj && proj.name && proj.name.toLowerCase() === activeProject.name.toLowerCase()) return true;
    }
    return false;
  };

  const calculateUnreadCounts = () => {
    const defaultTime = Date.now() - 3600000;

    // 1. Messages (Diskusi & Pengumuman)
    const lastMsg = lastVisitedTabs.messages || defaultTime;
    const unreadMessages = messages.filter(m => 
      isItemForActiveProject(m.projectId) && extractItemTimestamp(m) > lastMsg
    ).length;

    // 2. Todos (Manajemen Tugas - check categories & inner items)
    const lastTodo = lastVisitedTabs.todos || defaultTime;
    let unreadTodos = 0;
    todos.forEach(cat => {
      if (isItemForActiveProject(cat.projectId)) {
        if (extractItemTimestamp(cat) > lastTodo) unreadTodos++;
        if (Array.isArray(cat.items)) {
          cat.items.forEach(it => {
            if (extractItemTimestamp(it) > lastTodo) unreadTodos++;
          });
        }
      }
    });

    // 3. Chat (Obrolan Tim)
    const lastChat = lastVisitedTabs.chat || defaultTime;
    const unreadChat = chatMessages.filter(c => 
      isItemForActiveProject(c.projectId) && extractItemTimestamp(c) > lastChat
    ).length;

    // 4. Schedule (Kalender)
    const lastSched = lastVisitedTabs.schedule || defaultTime;
    const unreadSchedule = events.filter(e => 
      isItemForActiveProject(e.projectId) && extractItemTimestamp(e) > lastSched
    ).length;

    // 5. Files (Google Drive & File)
    const lastFile = lastVisitedTabs.files || defaultTime;
    const unreadFiles = files.filter(f => 
      isItemForActiveProject(f.projectId) && extractItemTimestamp(f) > lastFile
    ).length;

    // 6. Standups (Standup Otomatis)
    const lastStandup = lastVisitedTabs.standups || defaultTime;
    let unreadStandups = 0;
    checkins.forEach(chk => {
      if (isItemForActiveProject(chk.projectId)) {
        if (extractItemTimestamp(chk) > lastStandup) unreadStandups++;
        if (Array.isArray(chk.responses)) {
          chk.responses.forEach(r => {
            if (extractItemTimestamp(r) > lastStandup) unreadStandups++;
          });
        }
      }
    });

    return {
      messages: unreadMessages,
      todos: unreadTodos,
      chat: unreadChat,
      schedule: unreadSchedule,
      files: unreadFiles,
      standups: unreadStandups
    };
  };

  const unreadCounts = calculateUnreadCounts();

  // Available Roles & Modals state
  const [availableRoles, setAvailableRoles] = useState(INITIAL_ROLES);
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

  // Theme Sync & Auto Join Link Detection
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    const urlParams = new URLSearchParams(window.location.search);
    const inviteProjId = urlParams.get('invite');
    const inviteRoleName = urlParams.get('role') || 'Developer';
    const inviteEmail = urlParams.get('email');

    if (inviteProjId) {
      let targetProj = projects.find(p => p.id === inviteProjId) || projects[0];
      if (targetProj) {
        let resolvedEmail = currentUser ? currentUser.email : (inviteEmail && inviteEmail !== 'user' ? inviteEmail : null);

        if (resolvedEmail) {
          const existingMembers = targetProj.members || [];
          const updatedMembers = existingMembers.map(m => 
            m.email?.toLowerCase() === resolvedEmail?.toLowerCase() ? { ...m, status: 'joined' } : m
          );

          if (!existingMembers.some(m => m.email?.toLowerCase() === resolvedEmail?.toLowerCase())) {
            updatedMembers.push({
              name: currentUser ? currentUser.name : resolvedEmail.split('@')[0],
              email: resolvedEmail,
              avatar: currentUser ? currentUser.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedEmail.split('@')[0])}&background=0D8ABC&color=fff&bold=true`,
              role: inviteRoleName,
              status: 'joined'
            });
          }

          const finalProj = { ...targetProj, members: updatedMembers };
          const updatedProjects = projects.map(p => p.id === finalProj.id ? finalProj : p);
          setProjects(updatedProjects);
          setActiveProject(finalProj);
          broadcastSync({ projects: updatedProjects });
          dbService.saveProjectToDb(finalProj);
        }
      }
    }
  }, [isDarkMode, currentUser]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      name: projName,
      description: projDesc || 'Proyek baru berbasis Google Cloud Platform',
      category: projCat,
      color: projColor,
      updatedAt: 'Baru saja',
      members: [{ 
        name: currentUser?.name || 'Admin', 
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 
        role: 'Project Lead', 
        email: currentUser?.email || 'admin@gmail.com',
        status: 'joined'
      }]
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setActiveProject(newProject);
    setProjName('');
    setProjDesc('');
    setShowNewProjectModal(false);

    broadcastSync({ projects: updatedProjects });
    dbService.saveProjectToDb(newProject);
    handleAddActivity(`membuat proyek baru: ${newProject.name}`);
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

    broadcastSync({ projects: updatedProjects });
    dbService.saveProjectToDb(updatedData);
    handleAddActivity(`memperbarui informasi proyek menjadi "${projName}"`);
  };

  const handleDeleteProject = async () => {
    if (!activeProject) return;
    const deletedProj = activeProject;
    const remaining = projects.filter(p => p.id !== deletedProj.id);
    setProjects(remaining);
    setActiveProject(remaining[0] || null);
    setShowDeleteConfirmModal(false);

    broadcastSync({ projects: remaining });
    dbService.saveProjectToDb(deletedProj, true);
  };

  const handleUpdateProjectMembers = async (newMembers) => {
    if (!activeProject) return;
    const updatedProj = { ...activeProject, members: newMembers };
    const updatedProjects = projects.map(p => p.id === activeProject.id ? updatedProj : p);
    setProjects(updatedProjects);
    setActiveProject(updatedProj);

    broadcastSync({ projects: updatedProjects });
    dbService.saveProjectToDb(updatedProj);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        projects={userProjects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onNewProject={() => { setProjName(''); setProjDesc(''); setShowNewProjectModal(true); }}
        onEditProject={() => {
          setProjName(activeProject?.name || '');
          setProjDesc(activeProject?.description || '');
          setProjCat(activeProject?.category || 'Productivity');
          setProjColor(activeProject?.color || '#1a73e8');
          setShowEditProjectModal(true);
        }}
        onDeleteProject={() => setShowDeleteConfirmModal(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenTeamModal={() => setShowTeamModal(true)}
        currentUser={currentUser}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        {!currentUser ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', margin: '40px auto', maxWidth: '540px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--g-blue-light)',
              color: 'var(--g-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Akses Terkunci — Login Diperlukan</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Anda belum masuk ke sistem. Silakan login menggunakan akun Google atau email Anda untuk melihat dan mengelola proyek tim secara aman.
            </p>
            <button className="btn btn-primary" onClick={() => setShowLoginModal(true)} style={{ padding: '10px 24px', fontSize: '0.95rem', fontWeight: 700, gap: '8px' }}>
              <LogIn size={18} /> Masuk Akun Sekarang
            </button>
          </div>
        ) : (
          <>
            <NavigationSubTabs activeTab={activeTab} setActiveTab={handleSelectTab} unreadCounts={unreadCounts} />

            {activeTab === 'global' && (
              <GlobalDashboard
                projects={userProjects}
                events={events}
                checkins={checkins}
                onSelectProject={(projId) => {
                  const target = userProjects.find(p => p.id === projId);
                  if (target) { setActiveProject(target); setActiveTab('overview'); }
                }}
                setEvents={(newEvts) => handleUpdateEvents(newEvts)}
              />
            )}

            {activeTab !== 'global' && (
              (activeProject && isUserMemberOfProject(activeProject, currentUser)) ? (
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
                  {activeTab === 'messages' && <MessageBoard messages={messages} setMessages={handleUpdateMessages} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
                  {activeTab === 'todos' && <TodoList todos={todos} setTodos={handleUpdateTodos} activeProject={activeProject} projects={userProjects} currentUser={currentUser} onAddActivity={handleAddActivity} />}
                  {activeTab === 'chat' && <CampfireChat chatMessages={chatMessages} setChatMessages={handleUpdateChatMessages} activeProject={activeProject} currentUser={currentUser} />}
                  {activeTab === 'schedule' && <ScheduleCalendar events={events} setEvents={handleUpdateEvents} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
                  {activeTab === 'files' && <DocsAndFiles files={files} setFiles={handleUpdateFiles} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
                  {activeTab === 'standups' && <AutomaticCheckins checkins={checkins} setCheckins={handleUpdateCheckins} activeProject={activeProject} currentUser={currentUser} />}
                </>
              ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', margin: '40px auto', maxWidth: '540px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(234, 67, 53, 0.1)',
                    color: '#ea4335',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto'
                  }}>
                    <Lock size={32} />
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Akses Proyek Dibatasi</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    Akun Anda (<strong>{currentUser.email}</strong>) tidak memiliki hak akses ke proyek ini, atau Anda belum diundang ke proyek manapun.
                  </p>
                  <button className="btn btn-primary" onClick={() => setShowNewProjectModal(true)}>
                    <Plus size={16} /> Buat Proyek Baru
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <TeamManagerModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} activeProject={activeProject} onUpdateProjectMembers={handleUpdateProjectMembers} availableRoles={availableRoles} setAvailableRoles={setAvailableRoles} onAddActivity={handleAddActivity} />
      <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} projName={projName} setProjName={setProjName} projCat={projCat} setProjCat={setProjCat} projDesc={projDesc} setProjDesc={setProjDesc} onSubmit={handleCreateProject} />
      <EditProjectModal isOpen={showEditProjectModal} onClose={() => setShowEditProjectModal(false)} projName={projName} setProjName={setProjName} projCat={projCat} setProjCat={setProjCat} projDesc={projDesc} setProjDesc={setProjDesc} onSubmit={handleSaveEditProject} />
      <DeleteProjectModal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} activeProject={activeProject} onDeleteConfirm={handleDeleteProject} />
    </div>
  );
}
