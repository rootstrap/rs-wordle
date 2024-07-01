import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';

import { USERS } from './collections';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(firebaseAuth, googleProvider);
    const user = res.user;
    const q = query(collection(firebaseDb, USERS), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(firebaseDb, USERS), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
        photo: user.photoURL,
      });
    }
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};

const logout = async () => {
  await signOut(firebaseAuth);
};

const firebaseData = {
  firebaseAuth,
  firebaseDb,
  signInWithGoogle,
  logout,
};

export default firebaseData;
