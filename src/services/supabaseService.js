import { supabase } from '../supabase';

// Helper to safely execute Supabase query
const runQuery = async (queryPromise) => {
  if (!supabase) return { data: null, error: 'Supabase client not initialized' };
  try {
    const response = await queryPromise;
    if (response.error) {
      console.warn('Supabase DB Notice:', response.error.message);
    }
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
  const row = {
    id: project.id,
    name: project.name,
    description: project.description,
    category: project.category,
    color: project.color,
    updatedAt: project.updatedAt,
    members: project.members || []
  };
  return await runQuery(supabase.from('projects').upsert(row));
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
  const row = {
    id: message.id,
    projectId: message.projectId,
    title: message.title,
    author: message.author,
    authorAvatar: message.authorAvatar,
    category: message.category,
    date: message.date,
    content: message.content,
    commentsCount: message.commentsCount || 0,
    comments: message.comments || [],
    pinned: Boolean(message.pinned)
  };
  return await runQuery(supabase.from('messages').upsert(row));
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
  const row = {
    id: todo.id,
    projectId: todo.projectId,
    categoryName: todo.categoryName || todo.title || 'General',
    items: todo.items || []
  };
  return await runQuery(supabase.from('todos').upsert(row));
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
  const row = {
    id: chatMsg.id,
    projectId: chatMsg.projectId,
    channel: chatMsg.channel,
    sender: chatMsg.sender,
    avatar: chatMsg.avatar,
    time: chatMsg.time,
    text: chatMsg.text,
    createdAt: chatMsg.createdAt || Date.now()
  };
  return await runQuery(supabase.from('chatMessages').upsert(row));
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
  const row = {
    id: fileItem.id,
    projectId: fileItem.projectId,
    name: fileItem.name,
    size: fileItem.size,
    type: fileItem.type,
    uploader: fileItem.uploader,
    date: fileItem.date,
    url: fileItem.url
  };
  return await runQuery(supabase.from('files').upsert(row));
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
  const row = {
    id: eventItem.id,
    projectId: eventItem.projectId,
    title: eventItem.title,
    date: eventItem.date,
    time: eventItem.time,
    category: eventItem.category
  };
  return await runQuery(supabase.from('events').upsert(row));
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
  const row = {
    id: checkinItem.id,
    projectId: checkinItem.projectId,
    question: checkinItem.question,
    frequency: checkinItem.frequency,
    responses: checkinItem.responses || []
  };
  return await runQuery(supabase.from('checkins').upsert(row));
};

// ==========================================
// 8. Activities Service
// ==========================================
export const fetchActivitiesFromDb = async () => {
  const { data } = await runQuery(supabase.from('activities').select('*'));
  return data || null;
};

export const saveActivityToDb = async (activityItem) => {
  const row = {
    id: activityItem.id,
    user: activityItem.user,
    action: activityItem.action,
    time: activityItem.time,
    createdAt: activityItem.createdAt || Date.now()
  };
  return await runQuery(supabase.from('activities').upsert(row));
};
