import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { USERS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const usersRef = collection(firebaseDb, USERS);

export const getUserInfo = async selectedUser => {
  let userInfo = {};
  try {
    const q = query(usersRef, where('email', '==', selectedUser));
    const docs = await getDocs(q);
    docs.forEach(doc => {
      userInfo = doc.data();
    });
  } catch (err) {
    console.error(err);
  }

  return { userInfo };
};

export const disableUsersBan = async selectedUser => {
  const q = query(usersRef, where('email', '==', selectedUser));
  const docs = await getDocs(q);
  docs.forEach(userData => {
    const userInfo = userData.data();
    const id = userData.id;

    const newUsersInfo = {
      ...userInfo,
      isBanned: false,
    };

    updateDoc(doc(usersRef, id), newUsersInfo);
  });
};
