import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { USERS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;

export const getUsers = async ({ isObject = false, username }) => {
  const q = query(collection(firebaseDb, USERS), orderBy('name'));
  const docs = await getDocs(q);
  const users = isObject ? {} : [];
  docs.forEach(doc => {
    const user = doc.data();
    const { email, name, photo, uid } = user;
    if (isObject) {
      users[user.email] = user;
    } else {
      if (name.toUpperCase().includes(username.toUpperCase())) {
        users.push({ email, name, photo, id: uid });
      }
    }
  });

  return { users };
};
