/**
 * Google Drive API v3 Physical Upload Service
 * Target Shared Google Drive Folder: 15XGKmxcWPcS5n9Vl1E4D5OOC6FMYllOs
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '947032579128-dtr8i18696ovrsi7gnk2pfmr8fr4c5po.apps.googleusercontent.com';
const GOOGLE_DRIVE_FOLDER_ID = '15XGKmxcWPcS5n9Vl1E4D5OOC6FMYllOs';

let cachedAccessToken = localStorage.getItem('gdrive_access_token') || null;
let tokenClient = null;

/**
 * Checks if user is connected to Google Drive API
 */
export const isGoogleDriveConnected = () => {
  return Boolean(cachedAccessToken);
};

/**
 * Explicitly connects user's Google Account to Google Drive API via OAuth 2.0 GIS
 */
export const connectGoogleDriveAccount = () => {
  return new Promise((resolve, reject) => {
    const initClient = () => {
      try {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: (response) => {
            if (response.error) {
              reject(response);
            } else {
              cachedAccessToken = response.access_token;
              try { localStorage.setItem('gdrive_access_token', response.access_token); } catch (e) {}
              resolve(response.access_token);
            }
          }
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    };

    if (window.google?.accounts?.oauth2) {
      initClient();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => initClient();
      script.onerror = () => reject(new Error('GSI Script load failed'));
      document.body.appendChild(script);
    }
  });
};

/**
 * Requests or retrieves current Google OAuth Access Token
 */
export const requestGoogleAccessToken = async () => {
  if (cachedAccessToken) return cachedAccessToken;
  return await connectGoogleDriveAccount();
};

/**
 * Physical file upload directly into target Google Drive Folder (15XGKmxcWPcS5n9Vl1E4D5OOC6FMYllOs)
 */
export const uploadFileToGoogleDrive = async (file, projectId, accessToken = null, onProgress = null) => {
  let token = accessToken || cachedAccessToken;

  if (!token) {
    token = await requestGoogleAccessToken();
  }

  const metadata = {
    name: file.name,
    parents: [GOOGLE_DRIVE_FOLDER_ID],
    description: `Project Management File for Project ID: ${projectId}`
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', file);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401) {
      cachedAccessToken = null;
      try { localStorage.removeItem('gdrive_access_token'); } catch (e) {}
    }
    throw new Error(`Google Drive API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return {
    fileId: data.id,
    previewUrl: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    downloadUrl: data.webContentLink || `https://drive.google.com/uc?export=download&id=${data.id}`
  };
};
