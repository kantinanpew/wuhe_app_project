import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'viewer' | null;
  isLoading: boolean;
  error: string | null;
  adminEmails: string[];
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addAdminEmail: (email: string) => Promise<void>;
  removeAdminEmail: (email: string) => Promise<void>;
  refreshAdminEmails: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);

  const fetchAdminEmails = async () => {
    const adminEmailsCollection = collection(db, 'adminEmails');
    const snapshot = await getDocs(adminEmailsCollection);
    const emails = snapshot.docs.map(doc => doc.data().email as string);
    setAdminEmails(emails);
    return emails;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const emails = await fetchAdminEmails();
        const role = emails.includes(user.email || '') ? 'admin' : 'viewer';
        setUserRole(role);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('userRole', role);
      } else {
        setUser(null);
        setUserRole(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userRole');
      }
      setIsLoading(false);
    });

    const checkStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedRole = await AsyncStorage.getItem('userRole');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setUserRole(storedRole as 'admin' | 'viewer');
      }
      await fetchAdminEmails();
      setIsLoading(false);
    };

    checkStoredUser();

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const emails = await fetchAdminEmails();
      const role = emails.includes(email) ? 'admin' : 'viewer';
      setUserRole(role);
      await AsyncStorage.setItem('userRole', role);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userRole');
      setUserRole(null);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addAdminEmail = async (email: string) => {
    if (userRole !== 'admin') {
      throw new Error('Only admins can add other admins');
    }
    await addDoc(collection(db, 'adminEmails'), { email });
    await refreshAdminEmails();
  };

  const removeAdminEmail = async (email: string) => {
    if (userRole !== 'admin') {
      throw new Error('Only admins can remove other admins');
    }
    const adminEmailsCollection = collection(db, 'adminEmails');
    const q = query(adminEmailsCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    await refreshAdminEmails();
  };

  const refreshAdminEmails = async () => {
    await fetchAdminEmails();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      isLoading, 
      error, 
      adminEmails,
      signUp, 
      signIn, 
      signOut, 
      addAdminEmail, 
      removeAdminEmail, 
      refreshAdminEmails 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};