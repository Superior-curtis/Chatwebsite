// Example usage of Firebase services

import { auth, db, storage, analytics } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

// ============================================
// Authentication Examples
// ============================================

export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

// ============================================
// Firestore Examples
// ============================================

export interface Certificate {
  id?: string;
  userId: string;
  name: string;
  issueDate: Date;
  expiryDate?: Date;
  verificationCode: string;
  issuer: string;
}

export async function saveCertificate(certificate: Certificate) {
  try {
    const docRef = await addDoc(collection(db, "certificates"), {
      ...certificate,
      issueDate: certificate.issueDate.toISOString(),
      expiryDate: certificate.expiryDate?.toISOString() || null
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving certificate:", error);
    throw error;
  }
}

export async function getUserCertificates(userId: string) {
  try {
    const q = query(
      collection(db, "certificates"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw error;
  }
}

// ============================================
// Chat with auth state
// ============================================

export function setupAuthListener(callback: (user: any) => void) {
  const unsubscribe = auth.onAuthStateChanged(user => {
    callback(user);
  });
  return unsubscribe;
}
