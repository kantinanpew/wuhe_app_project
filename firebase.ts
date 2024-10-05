import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
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

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

// Function to initialize the adminEmails collection
export const initializeAdminEmails = async (initialAdminEmail: string) => {
  const adminEmailsCollection = collection(db, 'adminEmails');
  const snapshot = await getDocs(adminEmailsCollection);
  
  if (snapshot.empty) {
    // If the collection is empty, add the initial admin email
    try {
      await addDoc(adminEmailsCollection, { email: initialAdminEmail });
      console.log('Initial admin email added successfully');
    } catch (error) {
      console.error('Error adding initial admin email:', error);
    }
  } else {
    console.log('adminEmails collection already exists');
  }
};

export { app, auth, db, storage };