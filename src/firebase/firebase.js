import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';

import { USERS } from './collections';

const firebaseConfig = {
  apiKey: 'AIzaSyDtNY3LQVPluB4BLU97CZpr-1X8GELUNZU',
  authDomain: 'rs-wordle.firebaseapp.com',
  projectId: 'rs-wordle',
  storageBucket: 'rs-wordle.appspot.com',
  messagingSenderId: '511939813168',
  appId: '1:511939813168:web:922d084f432c7a9dfb72f5',
  measurementId: 'G-JTWS734E5Z',
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
