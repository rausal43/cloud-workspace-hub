import { supabase } from '../supabase';

// Helper to safely execute Supabase query
const runQuery = async (queryPromise) => {
  if (!supabase) return { data: null, error: 'Supabase client not initialized' };
  try {
    const response = await queryPromise;
    return response;
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// ==========================================
// 1. Projects Service
// ==========================================
export const fetchProjectsFromDb = async () => {
  const { data } = await runQuery(supabase.from('projects').select('*'));
  return data || null;
};

export const saveProjectToDb = async (project, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('projects').delete().eq('id', project.id));
  }
  return await runQuery(supabase.from('projects').upsert(project));
};

// ==========================================
// 2. Messages Service
// ==========================================
export const fetchMessagesFromDb = async () => {
  const { data } = await runQuery(supabase.from('messages').select('*'));
  return data || null;
};

export const saveMessageToDb = async (message, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('messages').delete().eq('id', message.id));
  }
  return await runQuery(supabase.from('messages').upsert(message));
};

// ==========================================
// 3. Todos Service
// ==========================================
export const fetchTodosFromDb = async () => {
  const { data } = await runQuery(supabase.from('todos').select('*'));
  return data || null;
};

export const saveTodoToDb = async (todo, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('todos').delete().eq('id', todo.id));
  }
  return await runQuery(supabase.from('todos').upsert(todo));
};

// ==========================================
// 4. Chat Messages Service
// ==========================================
export const fetchChatMessagesFromDb = async () => {
  const { data } = await runQuery(supabase.from('chatMessages').select('*'));
  return data || null;
};

export const saveChatMessageToDb = async (chatMsg, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('chatMessages').delete().eq('id', chatMsg.id));
  }
  return await runQuery(supabase.from('chatMessages').upsert(chatMsg));
};

// ==========================================
// 5. Files Service
// ==========================================
export const fetchFilesFromDb = async () => {
  const { data } = await runQuery(supabase.from('files').select('*'));
  return data || null;
};

export const saveFileToDb = async (fileItem, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('files').delete().eq('id', fileItem.id));
  }
  return await runQuery(supabase.from('files').upsert(fileItem));
};

// ==========================================
// 6. Events Service
// ==========================================
export const fetchEventsFromDb = async () => {
  const { data } = await runQuery(supabase.from('events').select('*'));
  return data || null;
};

export const saveEventToDb = async (eventItem, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('events').delete().eq('id', eventItem.id));
  }
  return await runQuery(supabase.from('events').upsert(eventItem));
};

// ==========================================
// 7. Checkins Service
// ==========================================
export const fetchCheckinsFromDb = async () => {
  const { data } = await runQuery(supabase.from('checkins').select('*'));
  return data || null;
};

export const saveCheckinToDb = async (checkinItem, isDelete = false) => {
  if (isDelete) {
    return await runQuery(supabase.from('checkins').delete().eq('id', checkinItem.id));
  }
  return await runQuery(supabase.from('checkins').upsert(checkinItem));
};

// ==========================================
// 8. Activities Service
// ==========================================
export const fetchActivitiesFromDb = async () => {
  const { data } = await runQuery(supabase.from('activities').select('*'));
  return data || null;
};

export const saveActivityToDb = async (activityItem) => {
  return await runQuery(supabase.from('activities').upsert(activityItem));
};
