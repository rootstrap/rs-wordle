import { collection, getDocs, query } from 'firebase/firestore';

import { USERS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;

export const getUsers = async () => {
  const q = query(collection(firebaseDb, USERS));
  const docs = await getDocs(q);
  const users = {};
  docs.forEach(doc => {
    const user = doc.data();
    users[user.email] = user;
  });

  return { users };
};
