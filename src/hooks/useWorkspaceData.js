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

export function useWorkspaceData(currentUser) {
  // State initialization with LocalStorage fallbacks
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('hub_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProject, setActiveProject] = useState(() => projects[0] || INITIAL_PROJECTS[0]);
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

  // 1. Fetch & Realtime Sync from Supabase PostgreSQL (safely checking array length to prevent wiping local storage)
  useEffect(() => {
    if (!supabase) return;

    const fetchAllData = async () => {
      const projData = await dbService.fetchProjectsFromDb();
      if (projData && Array.isArray(projData) && projData.length > 0) {
        setProjects(projData);
        localStorage.setItem('hub_projects', JSON.stringify(projData));
        setActiveProject(prev => {
          if (!prev) return projData[0];
          return projData.find(p => p.id === prev.id) || projData[0];
        });
      }

      const msgData = await dbService.fetchMessagesFromDb();
      if (msgData && Array.isArray(msgData) && msgData.length > 0) { 
        setMessages(msgData); 
        localStorage.setItem('hub_messages', JSON.stringify(msgData)); 
      }

      const todoData = await dbService.fetchTodosFromDb();
      if (todoData && Array.isArray(todoData) && todoData.length > 0) { 
        setTodos(todoData); 
        localStorage.setItem('hub_todos', JSON.stringify(todoData)); 
      }

      const chatData = await dbService.fetchChatMessagesFromDb();
      if (chatData && Array.isArray(chatData) && chatData.length > 0) { 
        setChatMessages(chatData); 
        localStorage.setItem('hub_chat', JSON.stringify(chatData)); 
      }

      const fileData = await dbService.fetchFilesFromDb();
      if (fileData && Array.isArray(fileData) && fileData.length > 0) { 
        setFiles(fileData); 
        localStorage.setItem('hub_files', JSON.stringify(fileData)); 
      }

      const eventData = await dbService.fetchEventsFromDb();
      if (eventData && Array.isArray(eventData) && eventData.length > 0) { 
        setEvents(eventData); 
        localStorage.setItem('hub_events', JSON.stringify(eventData)); 
      }

      const checkinData = await dbService.fetchCheckinsFromDb();
      if (checkinData && Array.isArray(checkinData) && checkinData.length > 0) { 
        setCheckins(checkinData); 
        localStorage.setItem('hub_checkins', JSON.stringify(checkinData)); 
      }

      const actData = await dbService.fetchActivitiesFromDb();
      if (actData && Array.isArray(actData) && actData.length > 0) { 
        setActivities(actData); 
        localStorage.setItem('hub_activities', JSON.stringify(actData)); 
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
  }, []);

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

  // Helper Mutation Wrappers (Atomic Local & Supabase Sync)
  const handleAddActivity = async (actionText) => {
    const newAct = {
      id: `act-${Date.now()}`,
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
    if (updatedItem) dbService.saveTodoToDb(updatedItem, isDelete);
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
