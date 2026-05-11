import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase.js';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 * @returns {Promise<object>} User object
 */
export async function signInWithGoogle() {
  if (!auth) {
    return { success: false, error: 'Firebase not initialized' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Sign out user
 * @returns {Promise<boolean>} Success status
 */
export async function signOutUser() {
  if (!auth) return false;
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}

/**
 * Listen to authentication state changes
 * @param {function} callback - Callback function receiving user object or null
 * @returns {function} Unsubscribe function
 */
export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Get current user
 * @returns {object|null} Current user or null
 */
export function getCurrentUser() {
  if (!auth || !auth.currentUser) return null;
  return {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    displayName: auth.currentUser.displayName,
    photoURL: auth.currentUser.photoURL,
  };
}

/**
 * Save route to user's saved routes
 * @param {string} uid - User ID
 * @param {object} routeData - Route information
 * @returns {Promise<object>} Saved route with ID
 */
export async function saveRoute(uid, routeData) {
  if (!db) return { success: false, error: 'Firebase not initialized' };
  try {
    const routeDoc = {
      ...routeData,
      createdAt: new Date(),
      userId: uid,
    };
    
    const docRef = await addDoc(
      collection(db, 'users', uid, 'savedRoutes'),
      routeDoc
    );
    
    return {
      success: true,
      routeId: docRef.id,
      data: routeData,
    };
  } catch (error) {
    console.error('Save route error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get user's saved routes
 * @param {string} uid - User ID
 * @returns {Promise<array>} Array of saved routes
 */
export async function getSavedRoutes(uid) {
  if (!db) return { success: false, error: 'Firebase not initialized', routes: [] };
  try {
    const q = query(collection(db, 'users', uid, 'savedRoutes'));
    const querySnapshot = await getDocs(q);
    
    const routes = [];
    querySnapshot.forEach((doc) => {
      routes.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return {
      success: true,
      routes: routes,
    };
  } catch (error) {
    console.error('Get saved routes error:', error);
    return {
      success: false,
      error: error.message,
      routes: [],
    };
  }
}

/**
 * Delete saved route
 * @param {string} uid - User ID
 * @param {string} routeId - Route ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSavedRoute(uid, routeId) {
  if (!db) return { success: false, error: 'Firebase not initialized' };
  try {
    await deleteDoc(doc(db, 'users', uid, 'savedRoutes', routeId));
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete route error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get single saved route
 * @param {string} uid - User ID
 * @param {string} routeId - Route ID
 * @returns {Promise<object>} Route data
 */
export async function getSavedRoute(uid, routeId) {
  try {
    const docRef = doc(db, 'users', uid, 'savedRoutes', routeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        route: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      };
    } else {
      return {
        success: false,
        error: 'Route not found',
      };
    }
  } catch (error) {
    console.error('Get route error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
