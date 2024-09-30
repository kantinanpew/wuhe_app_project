import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with theFirebase project configuration, please do not push this to a public repository
const firebaseConfig = {
    apiKey: "AIzaSyA2Qz6sPtUOVRuqXgAyf_DW-kTPYCL4kqk",
    authDomain: "tea-farm-app.firebaseapp.com",
    projectId: "tea-farm-app",
    storageBucket: "tea-farm-app.appspot.com",
    messagingSenderId: "747218706547",
    appId: "1:747218706547:web:ef150179bfd8d5822f4a06",
    measurementId: "G-NLX9QYQGV3"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };