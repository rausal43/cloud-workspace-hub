// Cloudflare Pages Serverless Function for Realtime Cloud Data Synchronization

// In-memory global state store for Cloudflare Edge Worker
let cloudStore = {
  projects: [
    {
      id: 'proj-1',
      name: 'Beon',
      description: 'Ruang kerja utama untuk mengelola tugas, diskusi, dan berkas tim.',
      category: 'General',
      color: '#1a73e8',
      updatedAt: 'Baru saja',
      members: [
        { name: 'Rausal Bahtiar', email: 'rausal43@gmail.com', role: 'Project Lead', status: 'joined', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { name: 'Wang', email: 'oukiwang72@gmail.com', role: 'Project Lead', status: 'joined', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      ]
    }
  ],
  messages: [],
  todos: [],
  chatMessages: [],
  events: [],
  files: [],
  checkins: [],
  activities: []
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET Request: Return Cloud Collections
  if (request.method === 'GET') {
    const col = url.searchParams.get('collection');
    if (col && cloudStore[col]) {
      return new Response(JSON.stringify({ success: true, collection: col, data: cloudStore[col] }), { headers });
    }
    return new Response(JSON.stringify({ success: true, data: cloudStore }), { headers });
  }

  // POST Request: Update or Delete Cloud Document
  if (request.method === 'POST') {
    try {
      const payload = await request.json();
      const { collection: col, docId, data, isDelete } = payload;

      if (!col || !docId) {
        return new Response(JSON.stringify({ error: 'Missing collection or docId' }), { status: 400, headers });
      }

      if (!cloudStore[col]) {
        cloudStore[col] = [];
      }

      if (isDelete) {
        cloudStore[col] = cloudStore[col].filter(item => item.id !== docId);
      } else if (data) {
        const index = cloudStore[col].findIndex(item => item.id === docId);
        if (index >= 0) {
          cloudStore[col][index] = { ...cloudStore[col][index], ...data };
        } else {
          cloudStore[col].unshift(data);
        }
      }

      return new Response(JSON.stringify({ success: true, collection: col, docId, total: cloudStore[col].length }), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
