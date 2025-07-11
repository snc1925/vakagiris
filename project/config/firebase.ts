import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBckjpZCXMuzulxhROTn9u35EAiOy1awwA",
  authDomain: "vakagiris-e8795.firebaseapp.com",
  projectId: "vakagiris-e8795",
  storageBucket: "vakagiris-e8795.firebasestorage.app",
  messagingSenderId: "443716114314",
  appId: "1:443716114314:android:5bd69cd0b221d248345a73",
  measurementId: "G-XXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;