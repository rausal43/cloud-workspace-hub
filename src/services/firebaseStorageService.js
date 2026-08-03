import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Uploads any file binary to Google Firebase / Cloud Storage bucket
 * Includes 4-second CORS timeout guard to prevent browser preflight blocking
 */
export const uploadFileToCloudStorage = (file, projectId, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!storage) {
      reject(new Error('Firebase Storage is not initialized'));
      return;
    }

    let isDone = false;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `projects/${projectId || 'general'}/${Date.now()}_${sanitizedName}`;
    const fileRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(fileRef, file);

    // Timeout guard if domain is blocked by Firebase CORS preflight policy
    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        try { uploadTask.cancel(); } catch (e) { /* ignore */ }
        reject(new Error('Firebase CORS preflight timeout - falling back to Direct Data URL'));
      }
    }, 4000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (isDone) return;
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          reject(error);
        }
      },
      async () => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      }
    );
  });
};
