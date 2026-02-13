import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNH7X1c5kPlji_3rOju7bOhVST-3N-Bds",
  authDomain: "the-elders--wisdom.firebaseapp.com",
  projectId: "the-elders--wisdom",
  storageBucket: "the-elders--wisdom.firebasestorage.app",
  messagingSenderId: "566986328473",
  appId: "1:566986328473:web:f407c708ebe9d976a36b08",
  measurementId: "G-DSSZ85XBGF"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
