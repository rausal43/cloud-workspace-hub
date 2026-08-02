import { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_MESSAGES, 
  INITIAL_TODOS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_FILES, 
  INITIAL_EVENTS, 
  INITIAL_CHECKINS
} from '../data/mockData';
import { supabase } from '../supabase';
import * as dbService from '../services/supabaseService';

export function isMatchProject(itemProjectId, activeProject, allProjects = []) {
  if (!itemProjectId) return true;
  if (!activeProject) return true;
  if (itemProjectId === activeProject.id) return true;
  
  // Match by project name fallback if IDs differ between clients
  if (activeProject.name) {
    const itemProj = allProjects.find(p => p.id === itemProjectId);
    if (itemProj && itemProj.name && itemProj.name.toLowerCase() === activeProject.name.toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function isUserMemberOfProject(project, user) {
  if (!project) return false;
  // Require login: Unauthenticated users cannot access private projects
  if (!user || !user.email) return false;
  if (!Array.isArray(project.members) || project.members.length === 0) return false;

  const userEmail = user.email.trim().toLowerCase();
  return project.members.some(m => m && m.email && m.email.trim().toLowerCase() === userEmail);
}

export function useWorkspaceData(currentUser) {
  // State initialization with LocalStorage fallbacks
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('hub_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProject, setActiveProject] = useState(() => {
    if (!currentUser) return null;
    const saved = localStorage.getItem('hub_projects');
    const allProjs = saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    const allowed = allProjs.filter(p => isUserMemberOfProject(p, currentUser));
    return allowed[0] || null;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('hub_activities');
    return saved ? JSON.parse(saved) : [];
  });

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

  // 1. Fetch & Realtime Sync from Supabase PostgreSQL
  useEffect(() => {
    if (!supabase) return;

    const fetchAllData = async () => {
      const projData = await dbService.fetchProjectsFromDb();
      if (projData && Array.isArray(projData) && projData.length > 0) {
        setProjects(projData);
        localStorage.setItem('hub_projects', JSON.stringify(projData));
        setActiveProject(prev => {
          if (!currentUser) return null;
          const allowed = projData.filter(p => isUserMemberOfProject(p, currentUser));
          if (allowed.length === 0) return null;
          if (prev && allowed.some(p => p.id === prev.id)) return prev;
          return allowed[0] || null;
        });
      }

      const msgData = await dbService.fetchMessagesFromDb();
      if (msgData && Array.isArray(msgData)) {
        setMessages(prev => {
          const dbIds = new Set(msgData.map(m => String(m.id)));
          const localOnly = prev.filter(m => m && m.id && !dbIds.has(String(m.id)));
          const merged = [...msgData, ...localOnly];
          localStorage.setItem('hub_messages', JSON.stringify(merged));
          return merged;
        });
      }

      const todoData = await dbService.fetchTodosFromDb();
      if (todoData && Array.isArray(todoData)) {
        setTodos(prev => {
          const dbIds = new Set(todoData.map(t => String(t.id)));
          const localOnly = prev.filter(t => t && t.id && !dbIds.has(String(t.id)));
          const merged = [...todoData, ...localOnly];
          localStorage.setItem('hub_todos', JSON.stringify(merged));
          return merged;
        });
      }

      const chatData = await dbService.fetchChatMessagesFromDb();
      if (chatData && Array.isArray(chatData)) {
        setChatMessages(prev => {
          const dbIds = new Set(chatData.map(c => String(c.id)));
          const localOnly = prev.filter(c => c && c.id && !dbIds.has(String(c.id)));
          const merged = [...chatData, ...localOnly];
          localStorage.setItem('hub_chat', JSON.stringify(merged));
          return merged;
        });
      }

      const fileData = await dbService.fetchFilesFromDb();
      if (fileData && Array.isArray(fileData)) {
        setFiles(prev => {
          const dbIds = new Set(fileData.map(f => String(f.id)));
          const localOnly = prev.filter(f => f && f.id && !dbIds.has(String(f.id)));
          const merged = [...fileData, ...localOnly];
          localStorage.setItem('hub_files', JSON.stringify(merged));
          return merged;
        });
      }

      const eventData = await dbService.fetchEventsFromDb();
      if (eventData && Array.isArray(eventData)) {
        setEvents(prev => {
          const dbIds = new Set(eventData.map(e => String(e.id)));
          const localOnly = prev.filter(e => e && e.id && !dbIds.has(String(e.id)));
          const merged = [...eventData, ...localOnly];
          localStorage.setItem('hub_events', JSON.stringify(merged));
          return merged;
        });
      }

      const checkinData = await dbService.fetchCheckinsFromDb();
      if (checkinData && Array.isArray(checkinData)) {
        setCheckins(prev => {
          const dbIds = new Set(checkinData.map(c => String(c.id)));
          const localOnly = prev.filter(c => c && c.id && !dbIds.has(String(c.id)));
          const merged = [...checkinData, ...localOnly];
          localStorage.setItem('hub_checkins', JSON.stringify(merged));
          return merged;
        });
      }

      const actData = await dbService.fetchActivitiesFromDb();
      if (actData && Array.isArray(actData)) {
        setActivities(prev => {
          const dbIds = new Set(actData.map(a => String(a.id)));
          const localOnly = prev.filter(a => a && a.id && !dbIds.has(String(a.id)));
          const merged = [...actData, ...localOnly];
          localStorage.setItem('hub_activities', JSON.stringify(merged));
          return merged;
        });
      }
    };

    fetchAllData();

    const channel = supabase.channel('supabase-workspace-realtime')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // 2. BroadcastChannel for instant same-browser cross-tab sync
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('gcloud_hub_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ALL' && event.data.payload) {
          const p = event.data.payload;
          if (p.projects) setProjects(p.projects);
          if (p.messages) setMessages(p.messages);
          if (p.todos) setTodos(p.todos);
          if (p.chatMessages) setChatMessages(p.chatMessages);
          if (p.events) setEvents(p.events);
          if (p.files) setFiles(p.files);
          if (p.checkins) setCheckins(p.checkins);
          if (p.activities) setActivities(p.activities);
        }
      };
    } catch (e) {}
    return () => { if (bc) bc.close(); };
  }, []);

  const broadcastSync = (override = {}) => {
    const payload = {
      projects: override.projects || projects,
      messages: override.messages || messages,
      todos: override.todos || todos,
      chatMessages: override.chatMessages || chatMessages,
      files: override.files || files,
      events: override.events || events,
      checkins: override.checkins || checkins,
      activities: override.activities || activities
    };
    try {
      const bc = new BroadcastChannel('gcloud_hub_sync');
      bc.postMessage({ type: 'SYNC_ALL', payload });
      bc.close();
    } catch (e) {}
  };

  // Helper Mutation Wrappers
  const handleAddActivity = async (actionText, customProjId = null) => {
    const targetProjId = customProjId || (activeProject ? activeProject.id : null);
    const newAct = {
      id: `act-${Date.now()}`,
      projectId: targetProjId,
      user: currentUser ? currentUser.name : 'Pengguna',
      action: actionText,
      time: 'Baru saja',
      createdAt: Date.now()
    };
    const updated = [newAct, ...activities];
    setActivities(updated);
    localStorage.setItem('hub_activities', JSON.stringify(updated));
    broadcastSync({ activities: updated });
    dbService.saveActivityToDb(newAct);
  };

  const handleUpdateMessages = async (newList, updatedItem = null, isDelete = false) => {
    setMessages(newList);
    localStorage.setItem('hub_messages', JSON.stringify(newList));
    broadcastSync({ messages: newList });
    if (updatedItem) dbService.saveMessageToDb(updatedItem, isDelete);
  };

  const handleUpdateTodos = async (newList, updatedItem = null, isDelete = false) => {
    setTodos(newList);
    localStorage.setItem('hub_todos', JSON.stringify(newList));
    broadcastSync({ todos: newList });
    if (updatedItem) {
      dbService.saveTodoToDb(updatedItem, isDelete);
    } else if (Array.isArray(newList)) {
      newList.forEach(item => dbService.saveTodoToDb(item, false));
    }
  };

  const handleUpdateChatMessages = async (newList, updatedItem = null, isDelete = false) => {
    setChatMessages(newList);
    localStorage.setItem('hub_chat', JSON.stringify(newList));
    broadcastSync({ chatMessages: newList });
    if (updatedItem) dbService.saveChatMessageToDb(updatedItem, isDelete);
  };

  const handleUpdateEvents = async (newList, updatedItem = null, isDelete = false) => {
    setEvents(newList);
    localStorage.setItem('hub_events', JSON.stringify(newList));
    broadcastSync({ events: newList });
    if (updatedItem) dbService.saveEventToDb(updatedItem, isDelete);
  };

  const handleUpdateFiles = async (newList, updatedItem = null, isDelete = false) => {
    setFiles(newList);
    localStorage.setItem('hub_files', JSON.stringify(newList));
    broadcastSync({ files: newList });
    if (updatedItem) dbService.saveFileToDb(updatedItem, isDelete);
  };

  const handleUpdateCheckins = async (newList, updatedItem = null, isDelete = false) => {
    setCheckins(newList);
    localStorage.setItem('hub_checkins', JSON.stringify(newList));
    broadcastSync({ checkins: newList });
    if (updatedItem) dbService.saveCheckinToDb(updatedItem, isDelete);
  };

  return {
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
  };
}
