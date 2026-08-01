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

import { useWorkspaceData } from './hooks/useWorkspaceData';
import * as dbService from './services/supabaseService';
import { Plus } from 'lucide-react';

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
        let resolvedEmail = currentUser ? currentUser.email : inviteEmail;
        if (!resolvedEmail || resolvedEmail === 'user') resolvedEmail = 'sepedab746@gmail.com';

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
        projects={projects}
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
        <NavigationSubTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'global' && (
          <GlobalDashboard
            projects={projects}
            events={events}
            checkins={checkins}
            onSelectProject={(projId) => {
              const target = projects.find(p => p.id === projId);
              if (target) { setActiveProject(target); setActiveTab('overview'); }
            }}
            setEvents={(newEvts) => handleUpdateEvents(newEvts)}
          />
        )}

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
              {activeTab === 'messages' && <MessageBoard messages={messages} setMessages={handleUpdateMessages} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
              {activeTab === 'todos' && <TodoList todos={todos} setTodos={handleUpdateTodos} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
              {activeTab === 'chat' && <CampfireChat chatMessages={chatMessages} setChatMessages={handleUpdateChatMessages} activeProject={activeProject} currentUser={currentUser} />}
              {activeTab === 'schedule' && <ScheduleCalendar events={events} setEvents={handleUpdateEvents} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
              {activeTab === 'files' && <DocsAndFiles files={files} setFiles={handleUpdateFiles} activeProject={activeProject} currentUser={currentUser} onAddActivity={handleAddActivity} />}
              {activeTab === 'standups' && <AutomaticCheckins checkins={checkins} setCheckins={handleUpdateCheckins} activeProject={activeProject} currentUser={currentUser} />}
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

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <TeamManagerModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} activeProject={activeProject} onUpdateProjectMembers={handleUpdateProjectMembers} availableRoles={availableRoles} setAvailableRoles={setAvailableRoles} onAddActivity={handleAddActivity} />
      <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} projName={projName} setProjName={setProjName} projCat={projCat} setProjCat={setProjCat} projDesc={projDesc} setProjDesc={setProjDesc} onSubmit={handleCreateProject} />
      <EditProjectModal isOpen={showEditProjectModal} onClose={() => setShowEditProjectModal(false)} projName={projName} setProjName={setProjName} projCat={projCat} setProjCat={setProjCat} projDesc={projDesc} setProjDesc={setProjDesc} onSubmit={handleSaveEditProject} />
      <DeleteProjectModal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} activeProject={activeProject} onDeleteConfirm={handleDeleteProject} />
    </div>
  );
}
