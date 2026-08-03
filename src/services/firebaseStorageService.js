import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Uploads any file binary to Google Firebase / Cloud Storage bucket
 * Returns public HTTPS download URL accessible across all team members & devices
 */
export const uploadFileToCloudStorage = (file, projectId, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!storage) {
      reject(new Error('Firebase Storage is not initialized'));
      return;
    }

    // Clean file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `projects/${projectId || 'general'}/${Date.now()}_${sanitizedName}`;
    const fileRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.warn('Cloud Storage upload warning:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
